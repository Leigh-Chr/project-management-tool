# API Documentation

## Authentication

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "string",
    "type": "Bearer",
    "id": 0,
    "username": "string",
    "email": "string",
    "roles": ["string"]
  }
  ```

### Register
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 0,
    "username": "string",
    "email": "string"
  }
  ```

## Projects

### List Projects
- **Endpoint**: `GET /api/projects`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "status": {
        "id": 0,
        "name": "string"
      },
      "createdAt": "2024-01-01T00:00:00",
      "updatedAt": "2024-01-01T00:00:00"
    }
  ]
  ```

### Create Project
- **Endpoint**: `POST /api/projects`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "statusId": 0
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "status": {
      "id": 0,
      "name": "string"
    },
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
  ```

### Get Project Details
- **Endpoint**: `GET /api/projects/{id}`
- **Response**: `200 OK`
  ```json
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "status": {
      "id": 0,
      "name": "string"
    },
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
  ```

## Tasks

### List Tasks
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `projectId`: Filter by project ID
  - `assigneeId`: Filter by assignee ID
  - `statusId`: Filter by status ID
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "dueDate": "2024-01-01",
      "priority": 0,
      "status": {
        "id": 0,
        "name": "string"
      },
      "project": {
        "id": 0,
        "name": "string"
      },
      "assignee": {
        "id": 0,
        "username": "string",
        "email": "string"
      },
      "createdAt": "2024-01-01T00:00:00",
      "updatedAt": "2024-01-01T00:00:00"
    }
  ]
  ```

### Create Task
- **Endpoint**: `POST /api/tasks`
- **Request Body**:
  ```json
  {
    "projectId": 0,
    "name": "string",
    "description": "string",
    "dueDate": "2024-01-01",
    "priority": 0,
    "assigneeId": 0,
    "statusId": 0
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "dueDate": "2024-01-01",
    "priority": 0,
    "status": {
      "id": 0,
      "name": "string"
    },
    "project": {
      "id": 0,
      "name": "string"
    },
    "assignee": {
      "id": 0,
      "username": "string",
      "email": "string"
    },
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
  ```

### Get Task Details
- **Endpoint**: `GET /api/tasks/{id}`
- **Response**: `200 OK`
  ```json
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "dueDate": "2024-01-01",
    "priority": 0,
    "status": {
      "id": 0,
      "name": "string"
    },
    "project": {
      "id": 0,
      "name": "string"
    },
    "assignee": {
      "id": 0,
      "username": "string",
      "email": "string"
    },
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
  ```

## Project Members

### Add Project Member
- **Endpoint**: `POST /api/projects/{projectId}/members`
- **Request Body**:
  ```json
  {
    "userId": 0,
    "roleId": 0
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 0,
    "username": "string",
    "email": "string",
    "role": {
      "id": 0,
      "name": "string"
    }
  }
  ```

### Remove Project Member
- **Endpoint**: `DELETE /api/projects/{projectId}/members/{memberId}`
- **Response**: `200 OK`
  ```json
  {
    "message": "Member removed successfully"
  }
  ```

## Task Events

### List Task Events
- **Endpoint**: `GET /api/task-events/task/{taskId}`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 0,
      "taskId": 0,
      "description": "string",
      "date": "2024-01-01T00:00:00"
    }
  ]
  ```

### Create Task Event
- **Endpoint**: `POST /api/task-events`
- **Request Body**:
  ```json
  {
    "taskId": 0,
    "description": "string"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 0,
    "taskId": 0,
    "description": "string",
    "date": "2024-01-01T00:00:00"
  }
  ```

## Status and Roles

### List Statuses
- **Endpoint**: `GET /api/statuses`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 0,
      "name": "string"
    }
  ]
  ```

### List Roles
- **Endpoint**: `GET /api/roles`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 0,
      "name": "string"
    }
  ]
  ```

## Error Codes

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists 