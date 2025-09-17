# API Contract - Project Management Tool

## Overview

This document defines the complete API contract for the Project Management Tool backend. The API follows REST conventions and uses JWT authentication.

## Base Configuration

- **Base URL**: `/api`
- **Authentication**: JWT Bearer Token in Authorization header
- **Content-Type**: `application/json`
- **Response Format**: JSON

## Data Models (Entities)

### UserEntity
```typescript
interface UserEntity {
  id: number;
  username: string;
  email: string;
  password: string; // Hashed on backend
}
```

### RoleEntity
```typescript
interface RoleEntity {
  id: number;
  name: string; // "Admin", "Member", "Observer"
}
```

### StatusEntity
```typescript
interface StatusEntity {
  id: number;
  name: string; // "Active", "Completed", "On Hold", etc.
}
```

### ProjectEntity
```typescript
interface ProjectEntity {
  id: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  statusId: number; // Reference to StatusEntity
}
```

### ProjectMemberEntity
```typescript
interface ProjectMemberEntity {
  id: number;
  projectId: number; // Reference to ProjectEntity
  userId: number;    // Reference to UserEntity
  roleId: number;    // Reference to RoleEntity
}
```

### TaskEntity
```typescript
interface TaskEntity {
  id: number;
  projectId: number;        // Reference to ProjectEntity
  name: string;
  description?: string;
  dueDate?: Date;
  priority?: number;        // 1-5 (1 = high priority)
  assigneeId?: number;      // Reference to ProjectMemberEntity.userId
  statusId: number;         // Reference to StatusEntity
}
```

### TaskEventEntity
```typescript
interface TaskEventEntity {
  id: number;
  taskId: number;           // Reference to TaskEntity
  description?: string;
  date: Date;
}
```

## Authentication Endpoints

### POST /api/auth/register
**Request Body:**
```typescript
{
  username: string;
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  id: number;
  username: string;
  email: string;
  exp: number;        // Expiration timestamp
  token: string;      // JWT Token
}
```

### POST /api/auth/login
**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  id: number;
  username: string;
  email: string;
  exp: number;        // Expiration timestamp
  token: string;      // JWT Token
}
```

### POST /api/auth/logout
**Response:**
```typescript
{
  message: string;    // "Logged out successfully"
}
```

## User Endpoints

### GET /api/users
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
[
  {
    id: number;
    username: string;
    email: string;
  }
]
```

## Status Endpoints

### GET /api/statuses
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
[
  {
    id: number;
    name: string;
  }
]
```

## Role Endpoints

### GET /api/roles
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
[
  {
    id: number;
    name: string;
  }
]
```

### GET /api/roles/{id}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
}
```

## Project Endpoints

### GET /api/projects
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
[
  {
    id: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;        // Status name
    myRole?: string;       // User's role in project
  }
]
```

### GET /api/projects/{id}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  myRole?: string;
}
```

### GET /api/projects/{id}/details
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  myRole?: string;
  projectMembers: [
    {
      id: number;
      project: string;     // Project name
      username: string;
      email: string;
      role: string;
    }
  ];
  tasks: [
    {
      id: number;
      name: string;
      description?: string;
      status: string;
      priority?: number;
      dueDate?: Date;
      assignee?: {
        id: number;
        username: string;
        email: string;
        role: string;
      };
    }
  ];
}
```

### POST /api/projects
**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  statusId: number;
}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  myRole?: string;
}
```

### DELETE /api/projects/{id}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  myRole?: string;
}
```

## Project Member Endpoints

### GET /api/projects/{id}/members
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
[
  {
    id: number;
    project: string;     // Project name
    username: string;
    email: string;
    role: string;
  }
]
```

### GET /api/projects/{id}/members/{memberId}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  project: string;
  username: string;
  email: string;
  role: string;
}
```

### POST /api/projects/{id}/members
**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  projectId: number;
  userId: number;
  roleId: number;
}
```

**Response:**
```typescript
{
  id: number;
  project: string;
  username: string;
  email: string;
  role: string;
}
```

### DELETE /api/projects/{id}/members/{memberId}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  project: string;
  username: string;
  email: string;
  role: string;
}
```

## Task Endpoints

### GET /api/tasks
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
[
  {
    id: number;
    name: string;
    description?: string;
    dueDate?: Date;
    status: string;
    project: {
      id: number;
      name: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      status: string;
      myRole?: string;
    };
    assignee?: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    priority?: number;
    taskHistory: [
      {
        id: number;
        description?: string;
        date: Date;
      }
    ];
    myRole?: string;
  }
]
```

### GET /api/tasks/{id}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  dueDate?: Date;
  status: string;
  project: {
    id: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    myRole?: string;
  };
  assignee?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  priority?: number;
  taskHistory: [
    {
      id: number;
      description?: string;
      date: Date;
    }
  ];
  myRole?: string;
}
```

### GET /api/tasks/{id}/details
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  dueDate?: Date;
  status: string;
  project: {
    id: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    myRole?: string;
  };
  assignee?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  priority?: number;
  taskHistory: [
    {
      id: number;
      description?: string;
      date: Date;
    }
  ];
  myRole?: string;
}
```

### POST /api/tasks
**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  projectId: number;
  name: string;
  description?: string;
  dueDate?: Date;
  priority?: number;
  assigneeId?: number;
  statusId: number;
}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  dueDate?: Date;
  status: string;
  project: {
    id: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    myRole?: string;
  };
  assignee?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  priority?: number;
  taskHistory: [];
  myRole?: string;
}
```

### PATCH /api/tasks/{id}
**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  projectId?: number;
  name?: string;
  description?: string;
  dueDate?: Date;
  priority?: number;
  assigneeId?: number;
  statusId?: number;
}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  dueDate?: Date;
  status: string;
  project: {
    id: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    myRole?: string;
  };
  assignee?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  priority?: number;
  taskHistory: [
    {
      id: number;
      description?: string;
      date: Date;
    }
  ];
  myRole?: string;
}
```

### DELETE /api/tasks/{id}
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  dueDate?: Date;
  status: string;
  project: {
    id: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    myRole?: string;
  };
  assignee?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  priority?: number;
  taskHistory: [
    {
      id: number;
      description?: string;
      date: Date;
    }
  ];
  myRole?: string;
}
```

## Permission System

### Role-Based Access Control

| Action | Admin | Member | Observer |
|--------|-------|--------|----------|
| **Projects** | | | |
| Create project | ✅ | ❌ | ❌ |
| Modify project | ✅ | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ |
| View projects | ✅ | ✅ | ✅ |
| **Tasks** | | | |
| Create task | ✅ | ✅ | ❌ |
| Modify task | ✅ | ✅ | ❌ |
| Delete task | ✅ | ✅ | ❌ |
| View tasks | ✅ | ✅ | ✅ |
| **Members** | | | |
| Add member | ✅ | ❌ | ❌ |
| Remove member | ✅ | ❌ | ❌ |
| View members | ✅ | ✅ | ✅ |

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

### Error Response Format
```typescript
{
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
```

## Technical Notes

1. **JWT Authentication**: Token must be included in Authorization header as `Bearer {token}`
2. **Validation**: All required fields must be validated
3. **Relationships**: Entity relationships must be maintained
4. **Task History**: Task modifications should create events in `TaskEventEntity`
5. **Permissions**: User permissions must be checked before each operation
6. **Dates**: Use ISO 8601 format for dates
7. **Pagination**: Consider pagination for large lists (optional)
8. **CORS**: Configure CORS for frontend domain
9. **Rate Limiting**: Implement rate limiting for security
10. **Logging**: Log all API requests and errors

## Security Considerations

1. **Password Hashing**: Use bcrypt or similar for password hashing
2. **JWT Secret**: Use a strong, environment-specific JWT secret
3. **Input Validation**: Validate and sanitize all inputs
4. **SQL Injection**: Use parameterized queries
5. **XSS Protection**: Sanitize outputs
6. **HTTPS**: Use HTTPS in production
7. **Token Expiration**: Implement reasonable token expiration times
8. **Refresh Tokens**: Consider implementing refresh token mechanism

## Database Schema Recommendations

### Indexes
- `users.email` (unique)
- `users.username` (unique)
- `projects.statusId`
- `project_members.projectId`
- `project_members.userId`
- `tasks.projectId`
- `tasks.assigneeId`
- `tasks.statusId`
- `task_events.taskId`

### Constraints
- Foreign key constraints on all relationships
- Unique constraints on user email and username
- Check constraints on priority values (1-5)
- Not null constraints on required fields

## Related Documentation

- [Project Overview](../README.md)
- [Frontend Architecture](frontend-architecture.md)
- [Database Design](database-design.md)
- [Deployment Guide](deployment.md)
