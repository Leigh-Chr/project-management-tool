# Database Migrations

This document describes the database migrations managed by Flyway. For the complete data model, see [Backend Architecture](backend-architecture.md#2-data-model).

## Migration Files

### V1__init_schema.sql
Initial schema creation with all necessary tables:

- `roles`: User roles (ADMIN, MEMBER, OBSERVER)
- `statuses`: Task and project statuses (TODO, IN_PROGRESS, DONE, CANCELLED)
- `users`: User accounts
- `projects`: Project information
- `project_members`: Project membership and roles
- `tasks`: Task information
- `task_events`: Task history and events

### V2__add_indexes.sql
Add indexes for better query performance:

- `idx_tasks_project_id`: For faster project-based task queries
- `idx_tasks_assignee_id`: For faster assignee-based task queries
- `idx_tasks_status_id`: For faster status-based task queries
- `idx_project_members_project_id`: For faster project-based member queries
- `idx_project_members_user_id`: For faster user-based member queries
- `idx_task_events_task_id`: For faster task-based event queries
- `idx_projects_status_id`: For faster status-based project queries

### V3__insert_initial_data.sql
Insert initial data for the application:

- Statuses: TODO, IN_PROGRESS, DONE, CANCELLED
- Roles: ADMIN, MEMBER, OBSERVER
- Users: admin, user1, user2
- Projects: Project 1, Project 2
- Project Members: admin in Project 1 as ADMIN, user1 in Project 1 as MEMBER, admin in Project 2 as ADMIN, user2 in Project 2 as OBSERVER
- Tasks: Task 1, Task 2, Task 3
- Task Events: Creation events for each task

## Database Constraints

### Foreign Key Constraints
- `projects.status_id` → `statuses.id`
- `project_members.project_id` → `projects.id`
- `project_members.user_id` → `users.id`
- `project_members.role_id` → `roles.id`
- `tasks.project_id` → `projects.id`
- `tasks.assignee_id` → `project_members.id`
- `tasks.status_id` → `statuses.id`
- `task_events.task_id` → `tasks.id`

### Validation Constraints
- `users.username`: NOT NULL, UNIQUE, max 50 chars
- `users.email`: NOT NULL, UNIQUE
- `users.password`: NOT NULL
- `projects.name`: NOT NULL, max 100 chars
- `projects.start_date`: NOT NULL
- `tasks.name`: NOT NULL, max 100 chars
- `tasks.priority`: NOT NULL
- `task_events.description`: NOT NULL
- `task_events.date`: NOT NULL

## Related Documentation
- [Backend Architecture](backend-architecture.md#2-data-model) - Complete data model documentation
- [API Documentation](api-documentation.md) - API endpoints and data structures 