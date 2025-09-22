# API REST Documentation - Backend PMT

## Vue d'ensemble

Cette documentation présente l'API REST complète du backend Spring Boot, avec tous les endpoints testés et validés.

## Configuration de Base

- **Base URL** : `http://localhost:8080/api`
- **Authentification** : JWT Bearer Token
- **Content-Type** : `application/json`
- **CORS** : Configuré pour `http://localhost:4200`

## Authentification

### POST /api/auth/login

**Description** : Connexion utilisateur avec génération de token JWT

**Request Body** :
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (200)** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "exp": 1758647155000
}
```

**Curl Example** :
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### POST /api/auth/register

**Description** : Inscription d'un nouvel utilisateur

**Request Body** :
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response (200)** :
```json
"User registered successfully!"
```

**Errors** :
- `400` : Username already taken / Email already in use

### POST /api/auth/logout

**Description** : Déconnexion utilisateur

**Headers** :
```
Authorization: Bearer {jwt_token}
```

**Response (200)** :
```json
"Logged out successfully!"
```

## Projets

### GET /api/projects

**Description** : Liste des projets avec rôle de l'utilisateur connecté

**Headers** :
```
Authorization: Bearer {jwt_token}
```

**Response (200)** :
```json
[
  {
    "id": 1,
    "name": "E-commerce Website",
    "description": "Development of a modern e-commerce platform",
    "status": "In Progress",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "myRole": "Admin"
  }
]
```

**Curl Example** :
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/projects
```

### GET /api/projects/{id}/details

**Description** : Détails complets d'un projet avec membres et tâches

**Response (200)** :
```json
{
  "id": 1,
  "name": "E-commerce Website",
  "description": "Development of a modern e-commerce platform",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "status": "In Progress",
  "myRole": "Admin",
  "projectMembers": [
    {
      "id": 1,
      "project": "E-commerce Website",
      "username": "admin",
      "email": "admin@example.com",
      "role": "Admin"
    }
  ],
  "tasks": [
    {
      "id": 1,
      "name": "Design Homepage",
      "description": "Create wireframes and design",
      "dueDate": "2024-01-15",
      "priority": 1,
      "status": "Done",
      "assignee": {
        "id": 2,
        "username": "alice",
        "email": "alice@example.com",
        "role": "Member"
      },
      "taskHistory": [...]
    }
  ]
}
```

### POST /api/projects

**Description** : Création d'un nouveau projet

**Request Body** :
```json
{
  "name": "New Project",
  "description": "Project description",
  "startDate": "2024-09-22",
  "endDate": "2024-12-31",
  "statusId": 1
}
```

## Tâches

### GET /api/tasks

**Description** : Liste de toutes les tâches avec détails complets

**Response (200)** :
```json
[
  {
    "id": 1,
    "name": "Design Homepage",
    "description": "Create wireframes and design for the homepage",
    "dueDate": "2024-01-15",
    "priority": 1,
    "status": "Done",
    "project": {
      "id": 1,
      "name": "E-commerce Website",
      "status": "In Progress",
      "myRole": "Admin"
    },
    "assignee": {
      "id": 2,
      "username": "alice",
      "email": "alice@example.com",
      "role": "Member"
    },
    "taskHistory": [
      {
        "id": 1,
        "taskId": 1,
        "description": "Task created",
        "date": "2024-01-01T00:00:00"
      }
    ],
    "myRole": "Admin"
  }
]
```

### POST /api/tasks

**Description** : Création d'une nouvelle tâche avec assignation

**Request Body** :
```json
{
  "projectId": 1,
  "name": "New Task",
  "description": "Task description",
  "dueDate": "2024-10-15",
  "priority": 2,
  "assigneeId": 3,
  "statusId": 1
}
```

**Response (200)** :
```json
{
  "id": 9,
  "name": "New Task",
  "description": "Task description",
  "dueDate": "2024-10-15",
  "priority": 2,
  "status": "To Do",
  "assignee": {
    "id": 3,
    "username": "bob",
    "email": "bob@example.com",
    "role": "Member"
  },
  "taskHistory": [
    {
      "id": 12,
      "description": "Task created",
      "date": "2025-09-22T19:06:56.758779837"
    }
  ]
}
```

**Curl Example** :
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId": 1, "name": "New Task", "assigneeId": 3, "statusId": 1}' \
  http://localhost:8080/api/tasks
```

### PATCH /api/tasks/{id}

**Description** : Modification d'une tâche avec historique automatique

**Request Body** :
```json
{
  "name": "Updated Task Name",
  "assigneeId": 4,
  "statusId": 2
}
```

**Response (200)** :
```json
{
  "id": 9,
  "name": "Updated Task Name",
  "assignee": {
    "id": 4,
    "username": "charlie",
    "email": "charlie@example.com",
    "role": "Member"
  },
  "taskHistory": [
    {
      "id": 13,
      "description": "Task name changed from 'Old Name' to 'Updated Task Name'",
      "date": "2025-09-22T19:07:39.076266471"
    }
  ]
}
```

## Utilisateurs et Rôles

### GET /api/users

**Description** : Liste de tous les utilisateurs

**Response (200)** :
```json
[
  {
    "username": "admin",
    "email": "admin@example.com"
  },
  {
    "username": "alice", 
    "email": "alice@example.com"
  }
]
```

### GET /api/roles

**Description** : Liste des rôles disponibles

**Response (200)** :
```json
[
  {"id": 1, "name": "Admin"},
  {"id": 2, "name": "Member"},
  {"id": 3, "name": "Observer"}
]
```

### GET /api/statuses

**Description** : Liste des statuts disponibles

**Response (200)** :
```json
[
  {"id": 1, "name": "To Do"},
  {"id": 2, "name": "In Progress"},
  {"id": 3, "name": "Done"}
]
```

## Endpoints Spécialisés

### GET /api/tasks/project/{projectId}

**Description** : Tâches d'un projet spécifique

### GET /api/tasks/assignee/{assigneeId}

**Description** : Tâches assignées à un utilisateur spécifique

### GET /api/projects/{id}/members

**Description** : Membres d'un projet avec leurs rôles

## Gestion d'Erreurs

### Codes de Statut HTTP

- **200** : Succès
- **400** : Requête invalide (validation échouée)
- **401** : Non authentifié (token manquant/invalide)
- **403** : Non autorisé (permissions insuffisantes)
- **404** : Ressource non trouvée
- **500** : Erreur serveur interne

### Format des Erreurs

```json
{
  "error": "RESOURCE_NOT_FOUND",
  "message": "Project with id 999 not found",
  "statusCode": 404,
  "timestamp": "2025-09-22T19:07:39.123456789"
}
```

## Authentification JWT

### Headers Requis

Pour tous les endpoints protégés :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

### Gestion des Tokens

- **Expiration** : 24 heures par défaut
- **Algorithme** : HS256
- **Claims** : username, iat, exp
- **Validation** : Automatique via JwtAuthenticationFilter

## Validation des Relations

### TaskEntity.assigneeId → UserEntity (CORRIGÉ)

**Validation en Base** :
```sql
SELECT t.id, t.name, t.assignee_id, u.username 
FROM tasks t 
LEFT JOIN users u ON t.assignee_id = u.id;
```

**Résultat Validé** :
```
| id | name                      | assignee_id | username |
|----|---------------------------|-------------|----------|
|  1 | Design Homepage           |           2 | alice    |
|  2 | Implement Payment Gateway |           3 | bob      |
|  3 | Product Catalog           |           2 | alice    |
```

✅ **Toutes les relations sont correctes et cohérentes avec la documentation frontend**

## Collection Postman

### Import de la Collection

1. **Fichier** : `PMT-Backend-Test-Collection.postman_collection.json`
2. **Import** : Postman → Import → Sélectionner le fichier
3. **Variables** : `baseUrl` = `http://localhost:8080/api`

### Tests Automatisés Inclus

- **Authentification** : Login avec récupération automatique du token
- **Projets** : CRUD complet avec validation des données
- **Tâches** : Création, modification, validation des assignees
- **Relations** : Tests spécifiques pour TaskEntity.assigneeId

### Workflow de Test

1. **Health Check** : Vérifier que l'API répond
2. **Login** : Récupérer le token JWT (automatique)
3. **Get Projects** : Valider la liste des projets
4. **Get Project Details** : Valider les relations complètes
5. **Create Task** : Tester l'assignation d'utilisateurs
6. **Update Task** : Tester les modifications avec historique

## Données de Test

### Utilisateurs Disponibles

| ID | Username | Email | Password | Rôles Projets |
|----|----------|-------|----------|---------------|
| 1 | admin | admin@example.com | admin123 | Admin (tous) |
| 2 | alice | alice@example.com | alice123 | Member (1,3) |
| 3 | bob | bob@example.com | bob123 | Member (1,2) |
| 4 | charlie | charlie@example.com | charlie123 | Member (2,3) |
| 5 | diana | diana@example.com | diana123 | Observer (1,3) |

### Projets de Test

| ID | Nom | Statut | Membres |
|----|-----|--------|---------|
| 1 | E-commerce Website | In Progress | admin, alice, bob, diana |
| 2 | Mobile App | To Do | admin, bob, charlie |
| 3 | Backend API | In Progress | admin, alice, charlie, diana |

### Tâches avec Assignation

| ID | Nom | Assigné à | Statut |
|----|-----|-----------|--------|
| 1 | Design Homepage | alice (id=2) | Done |
| 2 | Implement Payment Gateway | bob (id=3) | In Progress |
| 3 | Product Catalog | alice (id=2) | To Do |

## Sécurité

### Endpoints Publics
- `GET /api/health` : Santé de l'application
- `POST /api/auth/login` : Connexion
- `POST /api/auth/register` : Inscription

### Endpoints Protégés
Tous les autres endpoints nécessitent un token JWT valide.

### Validation des Permissions

Les permissions sont vérifiées au niveau service selon les rôles :
- **Admin** : Accès complet à tous les projets
- **Member** : Accès aux projets où il est membre
- **Observer** : Lecture seule sur ses projets

## Monitoring

### Health Check

```bash
curl http://localhost:8080/api/health
# Response: "Application is running"
```

### Logs de l'Application

```bash
# Logs en temps réel
tail -f spring-boot.log

# Logs SQL (dev profile)
grep "Hibernate:" spring-boot.log
```

## Troubleshooting API

### Erreurs Courantes

#### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "JWT token is missing or invalid"
}
```
**Solution** : Vérifier le header `Authorization: Bearer {token}`

#### 403 Forbidden
```json
{
  "error": "FORBIDDEN", 
  "message": "Insufficient permissions for this resource"
}
```
**Solution** : Vérifier les rôles utilisateur

#### 404 Not Found
```json
{
  "error": "RESOURCE_NOT_FOUND",
  "message": "Project with id 999 not found"
}
```
**Solution** : Vérifier l'ID de la ressource

### Debug API

```bash
# Test rapide de tous les endpoints
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/projects
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/tasks
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/users
```

## Intégration Frontend

### CORS Configuration

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    return source;
}
```

### Headers Requis

```typescript
// Angular HttpClient
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Structures de Réponse

Toutes les structures sont **100% cohérentes** avec :
- `frontend/docs/api-contract.md`
- `frontend/docs/data-model.md`

**Relation Critique Validée** :
```json
{
  "assignee": {
    "id": 2,           // UserEntity.id (CORRIGÉ)
    "username": "alice",
    "email": "alice@example.com",
    "role": "Member"
  }
}
```

## Performance

### Optimisations

- **Lazy Loading** : Relations JPA optimisées
- **Index Database** : Sur toutes les clés étrangères
- **Connection Pool** : HikariCP configuré
- **Query Optimization** : JPQL optimisées

### Métriques

- **Response Time** : < 100ms pour les requêtes simples
- **Database Queries** : Minimisées avec fetch strategies
- **Memory Usage** : Optimisé avec Lazy Loading

---

**Références :**
- [Architecture Backend](architecture.md)
- [Modèle de Données Backend](data-model.md)
- [Contrat API Global](../../docs/api-contract.md)
- [Modèle de Données Global](../../docs/data-model.md)
- [Collection Postman](../PMT-Backend-Test-Collection.postman_collection.json)
