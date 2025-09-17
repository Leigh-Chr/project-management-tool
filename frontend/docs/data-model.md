# Modèle de Données - Project Management Tool

## Vue d'ensemble

Ce document présente le modèle de données **parfaitement cohérent** avec le code frontend du Project Management Tool, incluant toutes les entités, leurs attributs et leurs relations.

## Entités Principales

### 1. UserEntity (Utilisateurs)

```typescript
interface UserEntity {
  id: number;           // Clé primaire
  username: string;     // Nom d'utilisateur unique
  email: string;        // Email unique
  password: string;     // Mot de passe hashé
}
```

**Contraintes :**
- `id` : Clé primaire, auto-incrément
- `username` : Unique, non null
- `email` : Unique, non null, format email valide
- `password` : Non null, minimum 6 caractères, hashé avec bcrypt

**Relations :**
- Un utilisateur peut être membre de plusieurs projets (1:N via ProjectMemberEntity)
- Un utilisateur peut être assigné à plusieurs tâches (1:N via TaskEntity.assigneeId)

### 2. RoleEntity (Rôles)

```typescript
interface RoleEntity {
  id: number;           // Clé primaire
  name: string;         // Nom du rôle
}
```

**Valeurs possibles :**
- `1` : "Admin" - Accès complet
- `2` : "Member" - Accès limité
- `3` : "Observer" - Lecture seule

**Relations :**
- Un rôle peut être assigné à plusieurs membres de projet (1:N via ProjectMemberEntity)

### 3. StatusEntity (Statuts)

```typescript
interface StatusEntity {
  id: number;           // Clé primaire
  name: string;         // Nom du statut
}
```

**Valeurs possibles :**
- `1` : "To Do" - À faire
- `2` : "In Progress" - En cours
- `3` : "Done" - Terminé

**Relations :**
- Un statut peut être utilisé par plusieurs projets (1:N via ProjectEntity)
- Un statut peut être utilisé par plusieurs tâches (1:N via TaskEntity)

### 4. ProjectEntity (Projets)

```typescript
interface ProjectEntity {
  id: number;           // Clé primaire
  name: string;         // Nom du projet
  description?: string; // Description optionnelle
  startDate?: Date;     // Date de début optionnelle
  endDate?: Date;       // Date de fin optionnelle
  statusId: number;     // Clé étrangère vers StatusEntity
}
```

**Contraintes :**
- `id` : Clé primaire, auto-incrément
- `name` : Non null, unique
- `description` : Optionnel, maximum 500 caractères
- `startDate` : Optionnel, doit être antérieure à endDate
- `endDate` : Optionnel, doit être postérieure à startDate
- `statusId` : Non null, clé étrangère vers StatusEntity

**Relations :**
- Un projet appartient à un statut (N:1 vers StatusEntity)
- Un projet peut avoir plusieurs membres (1:N via ProjectMemberEntity)
- Un projet peut contenir plusieurs tâches (1:N via TaskEntity)

### 5. ProjectMemberEntity (Membres de Projet)

```typescript
interface ProjectMemberEntity {
  id: number;           // Clé primaire
  projectId: number;    // Clé étrangère vers ProjectEntity
  userId: number;       // Clé étrangère vers UserEntity
  roleId: number;       // Clé étrangère vers RoleEntity
}
```

**Contraintes :**
- `id` : Clé primaire, auto-incrément
- `projectId` : Non null, clé étrangère vers ProjectEntity
- `userId` : Non null, clé étrangère vers UserEntity
- `roleId` : Non null, clé étrangère vers RoleEntity
- Combinaison `(projectId, userId)` : Unique (un utilisateur ne peut être membre d'un projet qu'une seule fois)

**Relations :**
- Un membre appartient à un projet (N:1 vers ProjectEntity)
- Un membre est un utilisateur (N:1 vers UserEntity)
- Un membre a un rôle (N:1 vers RoleEntity)

### 6. TaskEntity (Tâches)

```typescript
interface TaskEntity {
  id: number;           // Clé primaire
  projectId: number;    // Clé étrangère vers ProjectEntity
  name: string;         // Nom de la tâche
  description?: string; // Description optionnelle
  dueDate?: Date;       // Date d'échéance optionnelle
  priority?: number;    // Priorité optionnelle (1-5)
  assigneeId?: number;  // Clé étrangère vers UserEntity (CORRIGÉ)
  statusId: number;     // Clé étrangère vers StatusEntity
}
```

**Contraintes :**
- `id` : Clé primaire, auto-incrément
- `projectId` : Non null, clé étrangère vers ProjectEntity
- `name` : Non null, maximum 100 caractères
- `description` : Optionnel, maximum 1000 caractères
- `dueDate` : Optionnel, format Date
- `priority` : Optionnel, entier entre 1 et 5 (1 = haute priorité)
- `assigneeId` : Optionnel, clé étrangère vers UserEntity (pas ProjectMemberEntity)
- `statusId` : Non null, clé étrangère vers StatusEntity

**Relations :**
- Une tâche appartient à un projet (N:1 vers ProjectEntity)
- Une tâche peut être assignée à un utilisateur (N:1 vers UserEntity via assigneeId)
- Une tâche a un statut (N:1 vers StatusEntity)
- Une tâche peut avoir plusieurs événements (1:N vers TaskEventEntity)

### 7. TaskEventEntity (Événements de Tâche)

```typescript
interface TaskEventEntity {
  id: number;           // Clé primaire
  taskId: number;       // Clé étrangère vers TaskEntity
  description?: string; // Description de l'événement
  date: Date;           // Date de l'événement
}
```

**Contraintes :**
- `id` : Clé primaire, auto-incrément
- `taskId` : Non null, clé étrangère vers TaskEntity
- `description` : Optionnel, maximum 500 caractères
- `date` : Non null, format Date

**Relations :**
- Un événement appartient à une tâche (N:1 vers TaskEntity)

## Diagramme des Relations

```
UserEntity (1) ←→ (N) ProjectMemberEntity (N) ←→ (1) ProjectEntity
     ↑                        ↓                           ↓
     │                        ↓                           ↓
     │                   RoleEntity (1)                   ↓
     │                                                   ↓
     └─────────── (N) ←→ TaskEntity (N) ←→ (1) StatusEntity
                              ↓
                              ↓
                    TaskEventEntity (N)
```

## Relations Détaillées

### Relations 1:N (One-to-Many)

1. **StatusEntity → ProjectEntity**
   - Un statut peut être utilisé par plusieurs projets
   - Clé étrangère : `ProjectEntity.statusId`

2. **StatusEntity → TaskEntity**
   - Un statut peut être utilisé par plusieurs tâches
   - Clé étrangère : `TaskEntity.statusId`

3. **ProjectEntity → ProjectMemberEntity**
   - Un projet peut avoir plusieurs membres
   - Clé étrangère : `ProjectMemberEntity.projectId`

4. **ProjectEntity → TaskEntity**
   - Un projet peut contenir plusieurs tâches
   - Clé étrangère : `TaskEntity.projectId`

5. **UserEntity → ProjectMemberEntity**
   - Un utilisateur peut être membre de plusieurs projets
   - Clé étrangère : `ProjectMemberEntity.userId`

6. **UserEntity → TaskEntity**
   - Un utilisateur peut être assigné à plusieurs tâches
   - Clé étrangère : `TaskEntity.assigneeId` (CORRIGÉ)

7. **RoleEntity → ProjectMemberEntity**
   - Un rôle peut être assigné à plusieurs membres
   - Clé étrangère : `ProjectMemberEntity.roleId`

8. **TaskEntity → TaskEventEntity**
   - Une tâche peut avoir plusieurs événements
   - Clé étrangère : `TaskEventEntity.taskId`

### Relations N:1 (Many-to-One)

Toutes les relations ci-dessus sont bidirectionnelles, donc chaque entité "Many" a une relation "belongs to" vers l'entité "One".

## Contraintes d'Intégrité

### Contraintes de Clé Étrangère

1. **ProjectEntity.statusId** → **StatusEntity.id**
2. **TaskEntity.statusId** → **StatusEntity.id**
3. **ProjectMemberEntity.projectId** → **ProjectEntity.id**
4. **ProjectMemberEntity.userId** → **UserEntity.id**
5. **ProjectMemberEntity.roleId** → **RoleEntity.id**
6. **TaskEntity.projectId** → **ProjectEntity.id**
7. **TaskEntity.assigneeId** → **UserEntity.id** (CORRIGÉ)
8. **TaskEventEntity.taskId** → **TaskEntity.id**

### Contraintes d'Unicité

1. **UserEntity.email** : Unique
2. **UserEntity.username** : Unique
3. **ProjectEntity.name** : Unique
4. **ProjectMemberEntity(projectId, userId)** : Unique (un utilisateur ne peut être membre d'un projet qu'une seule fois)

### Contraintes de Validation

1. **TaskEntity.priority** : Entier entre 1 et 5
2. **ProjectEntity.startDate** : Doit être antérieure à endDate
3. **ProjectEntity.endDate** : Doit être postérieure à startDate
4. **UserEntity.password** : Minimum 6 caractères, hashé
5. **UserEntity.email** : Format email valide

## Index Recommandés

### Index de Performance

1. **UserEntity.email** : Index unique
2. **UserEntity.username** : Index unique
3. **ProjectEntity.name** : Index unique
4. **ProjectEntity.statusId** : Index
5. **ProjectMemberEntity.projectId** : Index
6. **ProjectMemberEntity.userId** : Index
7. **TaskEntity.projectId** : Index
8. **TaskEntity.assigneeId** : Index (CORRIGÉ)
9. **TaskEntity.statusId** : Index
10. **TaskEventEntity.taskId** : Index

### Index Composés

1. **ProjectMemberEntity(projectId, userId)** : Index unique composé
2. **TaskEntity(projectId, statusId)** : Index composé pour les requêtes de filtrage

## Données de Test (Cohérentes avec le code)

### Utilisateurs
```typescript
[
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123' },
  { id: 2, username: 'alice', email: 'alice@example.com', password: 'alice123' },
  { id: 3, username: 'bob', email: 'bob@example.com', password: 'bob123' },
  { id: 4, username: 'charlie', email: 'charlie@example.com', password: 'charlie123' },
  { id: 5, username: 'diana', email: 'diana@example.com', password: 'diana123' }
]
```

### Rôles
```typescript
[
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Member' },
  { id: 3, name: 'Observer' }
]
```

### Statuts
```typescript
[
  { id: 1, name: 'To Do' },
  { id: 2, name: 'In Progress' },
  { id: 3, name: 'Done' }
]
```

### Projets
```typescript
[
  {
    id: 1,
    name: 'E-commerce Website',
    description: 'Development of a modern e-commerce platform with payment integration',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 5, 30),
    statusId: 2
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'Cross-platform mobile application for iOS and Android',
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 7, 31),
    statusId: 1
  },
  {
    id: 3,
    name: 'Backend API',
    description: 'RESTful API development with microservices architecture',
    startDate: new Date(2024, 1, 15),
    endDate: new Date(2024, 6, 15),
    statusId: 2
  }
]
```

### Membres de Projet
```typescript
[
  // E-commerce Website
  { id: 1, projectId: 1, userId: 1, roleId: 1 }, // Admin
  { id: 2, projectId: 1, userId: 2, roleId: 2 }, // Alice - Member
  { id: 3, projectId: 1, userId: 3, roleId: 2 }, // Bob - Member
  { id: 4, projectId: 1, userId: 5, roleId: 3 }, // Diana - Observer

  // Mobile App
  { id: 5, projectId: 2, userId: 1, roleId: 1 }, // Admin
  { id: 6, projectId: 2, userId: 3, roleId: 2 }, // Bob - Member
  { id: 7, projectId: 2, userId: 4, roleId: 2 }, // Charlie - Member

  // Backend API
  { id: 8, projectId: 3, userId: 1, roleId: 1 }, // Admin
  { id: 9, projectId: 3, userId: 2, roleId: 2 }, // Alice - Member
  { id: 10, projectId: 3, userId: 4, roleId: 2 }, // Charlie - Member
  { id: 11, projectId: 3, userId: 5, roleId: 3 }  // Diana - Observer
]
```

### Tâches (avec assigneeId corrigé)
```typescript
[
  // E-commerce Website tasks
  {
    id: 1,
    projectId: 1,
    name: 'Design Homepage',
    description: 'Create wireframes and design for the homepage',
    dueDate: new Date(2024, 0, 15),
    priority: 1,
    assigneeId: 2, // Alice (UserEntity.id)
    statusId: 3
  },
  {
    id: 2,
    projectId: 1,
    name: 'Implement Payment Gateway',
    description: 'Integrate Stripe payment system',
    dueDate: new Date(2024, 1, 28),
    priority: 1,
    assigneeId: 3, // Bob (UserEntity.id)
    statusId: 2
  },
  {
    id: 3,
    projectId: 1,
    name: 'Product Catalog',
    description: 'Develop product listing and filtering system',
    dueDate: new Date(2024, 2, 15),
    priority: 2,
    assigneeId: 2, // Alice (UserEntity.id)
    statusId: 1
  },

  // Mobile App tasks
  {
    id: 4,
    projectId: 2,
    name: 'Setup React Native',
    description: 'Configure development environment',
    dueDate: new Date(2024, 2, 10),
    priority: 1,
    assigneeId: 3, // Bob (UserEntity.id)
    statusId: 1
  },
  {
    id: 5,
    projectId: 2,
    name: 'Design App UI',
    description: 'Create app screens and navigation flow',
    dueDate: new Date(2024, 2, 20),
    priority: 1,
    assigneeId: 4, // Charlie (UserEntity.id)
    statusId: 1
  },

  // Backend API tasks
  {
    id: 6,
    projectId: 3,
    name: 'Design API Schema',
    description: 'Define endpoints and data structures',
    dueDate: new Date(2024, 1, 28),
    priority: 1,
    assigneeId: 2, // Alice (UserEntity.id)
    statusId: 3
  },
  {
    id: 7,
    projectId: 3,
    name: 'Implement Authentication',
    description: 'Create JWT authentication system',
    dueDate: new Date(2024, 2, 15),
    priority: 1,
    assigneeId: 4, // Charlie (UserEntity.id)
    statusId: 2
  },
  {
    id: 8,
    projectId: 3,
    name: 'Database Setup',
    description: 'Configure PostgreSQL and migrations',
    dueDate: new Date(2024, 2, 1),
    priority: 2,
    assigneeId: 2, // Alice (UserEntity.id)
    statusId: 1
  }
]
```

### Événements de Tâche
```typescript
[
  // Homepage Design events
  {
    id: 1,
    taskId: 1,
    description: 'Task created',
    date: new Date(2024, 0, 1)
  },
  {
    id: 2,
    taskId: 1,
    description: 'Assigned to Alice',
    date: new Date(2024, 0, 1)
  },
  {
    id: 3,
    taskId: 1,
    description: 'Status changed to In Progress',
    date: new Date(2024, 0, 5)
  },
  {
    id: 4,
    taskId: 1,
    description: 'Status changed to Done',
    date: new Date(2024, 0, 14)
  },

  // Payment Gateway events
  {
    id: 5,
    taskId: 2,
    description: 'Task created',
    date: new Date(2024, 1, 1)
  },
  {
    id: 6,
    taskId: 2,
    description: 'Assigned to Bob',
    date: new Date(2024, 1, 1)
  },
  {
    id: 7,
    taskId: 2,
    description: 'Status changed to In Progress',
    date: new Date(2024, 1, 5)
  },

  // API Schema events
  {
    id: 8,
    taskId: 6,
    description: 'Task created',
    date: new Date(2024, 1, 15)
  },
  {
    id: 9,
    taskId: 6,
    description: 'Assigned to Alice',
    date: new Date(2024, 1, 15)
  },
  {
    id: 10,
    taskId: 6,
    description: 'Status changed to In Progress',
    date: new Date(2024, 1, 16)
  },
  {
    id: 11,
    taskId: 6,
    description: 'Status changed to Done',
    date: new Date(2024, 1, 27)
  }
]
```

## Scripts SQL de Création (Corrigés)

### PostgreSQL

```sql
-- Création des tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status_id INTEGER NOT NULL REFERENCES statuses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    priority INTEGER CHECK (priority >= 1 AND priority <= 5),
    assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- CORRIGÉ
    status_id INTEGER NOT NULL REFERENCES statuses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_events (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    description TEXT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Création des index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_projects_status_id ON projects(status_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id); -- CORRIGÉ
CREATE INDEX idx_tasks_status_id ON tasks(status_id);
CREATE INDEX idx_task_events_task_id ON task_events(task_id);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status_id);

-- Insertion des données de base
INSERT INTO roles (name) VALUES ('Admin'), ('Member'), ('Observer');
INSERT INTO statuses (name) VALUES ('To Do'), ('In Progress'), ('Done');

-- Insertion des utilisateurs
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', '$2b$10$...'), -- Hash de 'admin123'
('alice', 'alice@example.com', '$2b$10$...'), -- Hash de 'alice123'
('bob', 'bob@example.com', '$2b$10$...'),     -- Hash de 'bob123'
('charlie', 'charlie@example.com', '$2b$10$...'), -- Hash de 'charlie123'
('diana', 'diana@example.com', '$2b$10$...'); -- Hash de 'diana123'

-- Insertion des projets
INSERT INTO projects (name, description, start_date, end_date, status_id) VALUES 
('E-commerce Website', 'Development of a modern e-commerce platform with payment integration', '2024-01-01', '2024-06-30', 2),
('Mobile App', 'Cross-platform mobile application for iOS and Android', '2024-03-01', '2024-08-31', 1),
('Backend API', 'RESTful API development with microservices architecture', '2024-02-15', '2024-07-15', 2);

-- Insertion des membres de projet
INSERT INTO project_members (project_id, user_id, role_id) VALUES 
-- E-commerce Website
(1, 1, 1), (1, 2, 2), (1, 3, 2), (1, 5, 3),
-- Mobile App
(2, 1, 1), (2, 3, 2), (2, 4, 2),
-- Backend API
(3, 1, 1), (3, 2, 2), (3, 4, 2), (3, 5, 3);

-- Insertion des tâches
INSERT INTO tasks (project_id, name, description, due_date, priority, assignee_id, status_id) VALUES 
-- E-commerce Website tasks
(1, 'Design Homepage', 'Create wireframes and design for the homepage', '2024-01-15', 1, 2, 3),
(1, 'Implement Payment Gateway', 'Integrate Stripe payment system', '2024-02-28', 1, 3, 2),
(1, 'Product Catalog', 'Develop product listing and filtering system', '2024-03-15', 2, 2, 1),
-- Mobile App tasks
(2, 'Setup React Native', 'Configure development environment', '2024-03-10', 1, 3, 1),
(2, 'Design App UI', 'Create app screens and navigation flow', '2024-03-20', 1, 4, 1),
-- Backend API tasks
(3, 'Design API Schema', 'Define endpoints and data structures', '2024-02-28', 1, 2, 3),
(3, 'Implement Authentication', 'Create JWT authentication system', '2024-03-15', 1, 4, 2),
(3, 'Database Setup', 'Configure PostgreSQL and migrations', '2024-03-01', 2, 2, 1);
```

## Corrections Apportées

### 1. **TaskEntity.assigneeId**
- **AVANT** : `assigneeId?: ProjectMemberEntity['userId']`
- **APRÈS** : `assigneeId?: number` (référence directe vers UserEntity.id)

### 2. **Relation TaskEntity → UserEntity**
- **AVANT** : Relation indirecte via ProjectMemberEntity
- **APRÈS** : Relation directe via assigneeId

### 3. **Données de test**
- **AVANT** : assigneeId pointait vers ProjectMemberEntity.userId
- **APRÈS** : assigneeId pointe directement vers UserEntity.id (2, 3, 4)

### 4. **Scripts SQL**
- **AVANT** : assignee_id REFERENCES project_members(user_id)
- **APRÈS** : assignee_id REFERENCES users(id)

## Validation de Cohérence

Ce modèle de données est maintenant **100% cohérent** avec :
- ✅ Le code frontend Angular
- ✅ Les contrôleurs mock
- ✅ Les données de test
- ✅ L'usage réel des relations
- ✅ Les requêtes et jointures

## Notes d'Implémentation

1. **Cascade Deletes** : Les suppressions en cascade sont configurées pour maintenir l'intégrité référentielle
2. **Timestamps** : Ajout de `created_at` et `updated_at` pour l'audit
3. **Soft Deletes** : Considérer l'implémentation de soft deletes pour les données importantes
4. **Validation** : Implémenter la validation au niveau application et base de données
5. **Migrations** : Utiliser un système de migrations pour les évolutions du schéma
6. **Backup** : Mettre en place une stratégie de sauvegarde régulière

## Évolutions Futures

1. **Audit Trail** : Ajouter une table d'audit pour tracer toutes les modifications
2. **Notifications** : Table pour les notifications utilisateur
3. **Fichiers** : Table pour l'attachement de fichiers aux tâches
4. **Commentaires** : Table pour les commentaires sur les tâches
5. **Templates** : Table pour les templates de projets
6. **Tags** : Système de tags pour les projets et tâches
