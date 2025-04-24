# Backend Architecture

## 1. Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── projectmanagementtool/
│   │           ├── BackendApplication.java
│   │           ├── config/
│   │           │   └── SecurityConfig.java
│   │           ├── controller/
│   │           │   ├── AuthController.java
│   │           │   ├── ProjectController.java
│   │           │   ├── TaskController.java
│   │           │   ├── UserController.java
│   │           │   ├── ProjectMemberController.java
│   │           │   ├── TaskEventController.java
│   │           │   ├── StatusController.java
│   │           │   └── RoleController.java
│   │           ├── model/
│   │           │   ├── User.java
│   │           │   ├── Project.java
│   │           │   ├── Task.java
│   │           │   ├── ProjectMember.java
│   │           │   ├── TaskEvent.java
│   │           │   ├── Status.java
│   │           │   └── Role.java
│   │           ├── repository/
│   │           │   ├── UserRepository.java
│   │           │   ├── ProjectRepository.java
│   │           │   ├── TaskRepository.java
│   │           │   ├── ProjectMemberRepository.java
│   │           │   ├── TaskEventRepository.java
│   │           │   ├── StatusRepository.java
│   │           │   └── RoleRepository.java
│   │           ├── service/
│   │           │   ├── UserService.java
│   │           │   ├── ProjectService.java
│   │           │   ├── TaskService.java
│   │           │   ├── ProjectMemberService.java
│   │           │   ├── TaskEventService.java
│   │           │   ├── StatusService.java
│   │           │   ├── RoleService.java
│   │           │   └── impl/
│   │           │       ├── UserServiceImpl.java
│   │           │       ├── ProjectServiceImpl.java
│   │           │       ├── TaskServiceImpl.java
│   │           │       ├── ProjectMemberServiceImpl.java
│   │           │       ├── TaskEventServiceImpl.java
│   │           │       ├── StatusServiceImpl.java
│   │           │       └── RoleServiceImpl.java
│   │           ├── dto/
│   │           │   ├── AuthRequest.java
│   │           │   ├── AuthResponse.java
│   │           │   ├── TaskDTO.java
│   │           │   ├── TaskDetailsDTO.java
│   │           │   ├── TaskRequestDTO.java
│   │           │   ├── TaskEventDTO.java
│   │           │   ├── ProjectMemberDTO.java
│   │           │   ├── GetProjectMemberResponse.java
│   │           │   ├── PostProjectMemberResponse.java
│   │           │   └── DeleteProjectMemberResponse.java
│   │           ├── mapper/
│   │           │   ├── TaskMapper.java
│   │           │   ├── TaskEventMapper.java
│   │           │   ├── ProjectMemberMapper.java
│   │           │   └── ProjectMapper.java
│   │           ├── security/
│   │           │   ├── JwtService.java
│   │           │   ├── JwtAuthenticationFilter.java
│   │           │   └── UserDetailsServiceImpl.java
│   │           ├── exception/
│   │           │   ├── GlobalExceptionHandler.java
│   │           │   └── ErrorDetails.java
│   │           └── util/
│   └── resources/
│       ├── application.properties
│       └── db/
│           └── migration/
│               ├── V1__init_schema.sql
│               ├── V2__add_indexes.sql
│               └── V3__insert_initial_data.sql
```

## 2. Data Model

For detailed database schema and migrations, see [Database Migrations](database-migrations.md).

### Core Entities

#### User
- `id`: Long (PK)
- `username`: String (unique, max 50 chars)
- `email`: String (unique)
- `password`: String
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### Project
- `id`: Long (PK)
- `name`: String (max 100 chars)
- `description`: String (TEXT)
- `startDate`: LocalDate
- `endDate`: LocalDate
- `status`: Status (FK)
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### Task
- `id`: Long (PK)
- `project`: Project (FK)
- `name`: String (max 100 chars)
- `description`: String (TEXT)
- `dueDate`: LocalDate
- `priority`: Integer
- `assignee`: ProjectMember (FK)
- `status`: Status (FK)
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### ProjectMember
- `id`: Long (PK)
- `project`: Project (FK)
- `user`: User (FK)
- `role`: Role (FK)
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

#### TaskEvent
- `id`: Long (PK)
- `task`: Task (FK)
- `description`: String (TEXT)
- `date`: LocalDateTime
- `createdAt`: LocalDateTime

#### Status
- `id`: Long (PK)
- `name`: String (unique, max 50 chars)

#### Role
- `id`: Long (PK)
- `name`: String (unique, max 50 chars)

## 3. API Endpoints

For detailed API documentation, including request/response formats and examples, see [API Documentation](api-documentation.md).

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/members` - List project members
- `POST /api/projects/{id}/members` - Add project member
- `DELETE /api/projects/{id}/members/{memberId}` - Remove project member

#### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

#### Task Events
- `GET /api/task-events/task/{taskId}` - List task events
- `POST /api/task-events` - Create task event
- `GET /api/task-events/{id}` - Get event details
- `DELETE /api/task-events/{id}` - Delete event

#### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user

#### Status and Roles
- `GET /api/statuses` - List all statuses
- `GET /api/statuses/{id}` - Get status details
- `GET /api/roles` - List all roles
- `GET /api/roles/{id}` - Get role details

## 4. Security

- Spring Security with JWT authentication
- Token-based authentication
- Roles and permissions:
  - ADMIN: Full access
  - MEMBER: Can create/modify tasks
  - OBSERVER: Read-only access

## 5. Database

- MySQL as the database management system
- Flyway for migrations
- Configuration in `application.properties`

For detailed database schema and migrations, see [Database Migrations](database-migrations.md).

## 6. DTOs (Data Transfer Objects)

### AuthRequest
- `username`: String
- `password`: String

### AuthResponse
- `token`: String
- `type`: String
- `id`: Long
- `username`: String
- `email`: String
- `roles`: List<String>

### TaskDTO
- `id`: Long
- `name`: String
- `description`: String
- `dueDate`: LocalDate
- `priority`: Integer
- `status`: StatusDTO
- `project`: ProjectDTO
- `assignee`: UserDTO

### TaskEventDTO
- `id`: Long
- `taskId`: Long
- `description`: String
- `date`: LocalDateTime

### ProjectMemberDTO
- `id`: Long
- `username`: String
- `email`: String
- `role`: RoleDTO

## 7. Exception Handling

For detailed error codes and responses, see [API Documentation](api-documentation.md#error-codes).

### Custom Exceptions
- `ResourceNotFoundException`: Resource not found
- `UnauthorizedAccessException`: Unauthorized access
- `BusinessLogicException`: Business logic error

### Global Exception Handler
- Handles all exceptions and returns appropriate HTTP status codes
- Provides consistent error response format 