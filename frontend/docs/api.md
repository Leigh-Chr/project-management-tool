# API Documentation

## Vue d'ensemble

Le projet PMT utilise actuellement un backend mock intégré qui simule une API REST complète. Cette documentation décrit les endpoints disponibles et leur utilisation.

## Base URL

```
/api
```

**Note** : L'application utilise actuellement un backend mock intégré. L'URL `/api` est interceptée par le mock interceptor.

## Authentification

### Headers Requis

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Gestion des Tokens

- **Expiration** : 24 heures
- **Format** : JWT avec hash SHA-256
- **Stockage** : Cookies côté client + Bearer Token dans les headers
- **Intercepteur** : Ajout automatique du token Bearer via `authInterceptor`

## Endpoints

### Authentification

#### POST /auth/register

Inscription d'un nouvel utilisateur.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "exp": 1234567890,
  "token": "string"
}
```

#### POST /auth/login

Connexion d'un utilisateur existant.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "exp": 1234567890,
  "token": "string"
}
```

#### POST /auth/logout

Déconnexion de l'utilisateur.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Utilisateurs

#### GET /users

Récupération de la liste des utilisateurs.

**Response:**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string"
  }
]
```

### Projets

#### GET /projects

Récupération de la liste des projets de l'utilisateur.

**Response:**
```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "string",
    "myRole": "string"
  }
]
```

#### GET /projects/:id

Récupération des détails d'un projet.

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "status": "string",
  "myRole": "string",
  "projectMembers": [
    {
      "id": 1,
      "project": "string",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  ],
  "tasks": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "status": "string",
      "priority": 1,
      "dueDate": "2024-01-15T00:00:00.000Z",
      "assignee": {
        "id": 1,
        "username": "string",
        "email": "string",
        "role": "string"
      }
    }
  ]
}
```

#### POST /projects

Création d'un nouveau projet.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "statusId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "status": "string",
  "myRole": "Admin"
}
```

#### DELETE /projects/:id

Suppression d'un projet (Admin uniquement).

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "status": "string"
}
```

### Membres de Projet

#### GET /projects/:id/members

Récupération des membres d'un projet.

**Response:**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "string"
  }
]
```

#### POST /projects/:id/members

Ajout d'un membre au projet (Admin uniquement).

**Request Body:**
```json
{
  "projectId": 1,
  "userId": 2,
  "roleId": 2
}
```

**Response:**
```json
{
  "id": 1,
  "project": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}
```

#### DELETE /projects/:id/members/:memberId

Suppression d'un membre du projet (Admin uniquement).

**Response:**
```json
{
  "id": 1,
  "project": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}
```

### Tâches

#### GET /tasks

Récupération de toutes les tâches de l'utilisateur.

**Response:**
```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "priority": 1,
    "status": "string",
    "project": {
      "id": 1,
      "name": "string",
      "description": "string",
      "status": "string"
    },
    "assignee": {
      "id": 1,
      "username": "string",
      "email": "string",
      "role": "string"
    },
    "myRole": "string",
    "taskHistory": [
      {
        "id": 1,
        "description": "string",
        "date": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

#### GET /tasks/:id

Récupération des détails d'une tâche.

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "priority": 1,
  "status": "string",
  "project": {
    "id": 1,
    "name": "string",
    "description": "string",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "string",
    "myRole": "string"
  },
  "assignee": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "myRole": "string",
  "taskHistory": [
    {
      "id": 1,
      "description": "string",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /tasks/:id/details

Récupération des détails complets d'une tâche.

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "status": "string",
  "project": {
    "id": 1,
    "name": "string",
    "description": "string",
    "status": "string"
  },
  "assignee": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "priority": 1,
  "myRole": "string",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "taskHistory": [
    {
      "id": 1,
      "description": "string",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /tasks

Création d'une nouvelle tâche (Admin/Member uniquement).

**Request Body:**
```json
{
  "projectId": 1,
  "name": "string",
  "description": "string",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "priority": 1,
  "assigneeId": 2,
  "statusId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "status": "string",
  "project": {
    "id": 1,
    "name": "string",
    "description": "string",
    "status": "string"
  },
  "myRole": "string",
  "taskHistory": [
    {
      "id": 1,
      "description": "Task created",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PATCH /tasks/:id

Mise à jour d'une tâche (Admin/Member uniquement).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "priority": 1,
  "assigneeId": 2,
  "statusId": 2
}
```

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "status": "string",
  "project": {
    "id": 1,
    "name": "string",
    "description": "string",
    "status": "string"
  },
  "assignee": {
    "id": 2,
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "priority": 1,
  "myRole": "string",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "taskHistory": [
    {
      "id": 1,
      "description": "Task updated: name: Old Name > New Name",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### DELETE /tasks/:id

Suppression d'une tâche (Admin/Member uniquement).

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "status": "string",
  "project": {
    "id": 1,
    "name": "string",
    "description": "string",
    "status": "string"
  },
  "myRole": "string",
  "taskHistory": []
}
```

### Statuts

#### GET /statuses

Récupération de la liste des statuts disponibles.

**Response:**
```json
[
  {
    "id": 1,
    "name": "To Do"
  },
  {
    "id": 2,
    "name": "In Progress"
  },
  {
    "id": 3,
    "name": "Done"
  }
]
```

### Rôles

#### GET /roles

Récupération de la liste des rôles disponibles.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Admin"
  },
  {
    "id": 2,
    "name": "Member"
  },
  {
    "id": 3,
    "name": "Observer"
  }
]
```

## Codes d'Erreur

### HTTP Status Codes

- **200** : Succès
- **201** : Créé avec succès
- **400** : Requête invalide
- **401** : Non authentifié
- **403** : Non autorisé
- **404** : Ressource non trouvée
- **500** : Erreur serveur

### Format des Erreurs

```json
{
  "error": "string",
  "message": "string",
  "statusCode": 400
}
```

## Permissions

### Matrice des Permissions

| Action | Admin | Member | Observer |
|--------|-------|--------|----------|
| Créer un projet | ✅ | ❌ | ❌ |
| Supprimer un projet | ✅ | ❌ | ❌ |
| Inviter des membres | ✅ | ❌ | ❌ |
| Supprimer des membres | ✅ | ❌ | ❌ |
| Créer des tâches | ✅ | ✅ | ❌ |
| Modifier des tâches | ✅ | ✅ | ❌ |
| Supprimer des tâches | ✅ | ✅ | ❌ |
| Visualiser | ✅ | ✅ | ✅ |
| Voir l'historique | ✅ | ✅ | ✅ |

## Données de Test

### Utilisateurs par Défaut

```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  },
  {
    "id": 2,
    "username": "alice",
    "email": "alice@example.com",
    "password": "alice123"
  },
  {
    "id": 3,
    "username": "bob",
    "email": "bob@example.com",
    "password": "bob123"
  }
]
```

### Projets de Test

- **E-commerce Website** : Projet avec 3 tâches
- **Mobile App** : Projet avec 2 tâches
- **Backend API** : Projet avec 3 tâches

## Utilisation avec le Frontend

### Service API

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  
  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`);
  }
  
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }
}
```

### Intercepteur d'Authentification

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authUser = authService.authUser();
  
  if (authUser?.token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authUser.token}`)
    });
    return next(authReq);
  }
  
  return next(req);
};
```

## Migration vers Spring Boot

### Endpoints à Implémenter

1. **AuthController** : `/auth/*`
2. **ProjectController** : `/projects/*`
3. **TaskController** : `/tasks/*`
4. **UserController** : `/users`
5. **StatusController** : `/statuses`
6. **RoleController** : `/roles`

### Base de Données

- **Tables** : users, projects, tasks, project_members, roles, statuses, task_events
- **Relations** : Foreign keys et contraintes
- **Indexes** : Performance optimisée

---

**Références :**
- [Architecture](architecture.md)
- [Guide de développement](development.md)
- [Déploiement](deployment.md)
