import { Injectable } from '@angular/core';
import type {
  ProjectEntity,
  ProjectMemberEntity,
  RoleEntity,
  StatusEntity,
  TaskEntity,
  TaskEventEntity,
  UserEntity,
} from '../../../models/entities';

@Injectable({ providedIn: 'root' })
export class DatabaseMockService {
  readonly statuses: StatusEntity[] = [
    { id: 1, name: 'To Do' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Done' },
  ];

  readonly roles: RoleEntity[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Member' },
    { id: 3, name: 'Observer' },
  ];

  readonly users: UserEntity[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
    },
    {
      id: 2,
      username: 'alice',
      email: 'alice@example.com',
      password: 'alice123',
    },
    { id: 3, username: 'bob', email: 'bob@example.com', password: 'bob123' },
    {
      id: 4,
      username: 'charlie',
      email: 'charlie@example.com',
      password: 'charlie123',
    },
    {
      id: 5,
      username: 'diana',
      email: 'diana@example.com',
      password: 'diana123',
    },
  ];

  readonly projects: ProjectEntity[] = [
    {
      id: 1,
      name: 'E-commerce Website',
      description:
        'Development of a modern e-commerce platform with payment integration',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 5, 30),
      statusId: 2,
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'Cross-platform mobile application for iOS and Android',
      startDate: new Date(2024, 2, 1),
      endDate: new Date(2024, 7, 31),
      statusId: 1,
    },
    {
      id: 3,
      name: 'Backend API',
      description: 'RESTful API development with microservices architecture',
      startDate: new Date(2024, 1, 15),
      endDate: new Date(2024, 6, 15),
      statusId: 2,
    },
  ];

  readonly projectMembers: ProjectMemberEntity[] = [
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
    { id: 11, projectId: 3, userId: 5, roleId: 3 }, // Diana - Observer
  ];

  readonly tasks: TaskEntity[] = [
    // E-commerce Website tasks
    {
      id: 1,
      projectId: 1,
      name: 'Design Homepage',
      description: 'Create wireframes and design for the homepage',
      dueDate: new Date(2024, 0, 15),
      priority: 1,
      assigneeId: 2,
      statusId: 3,
    },
    {
      id: 2,
      projectId: 1,
      name: 'Implement Payment Gateway',
      description: 'Integrate Stripe payment system',
      dueDate: new Date(2024, 1, 28),
      priority: 1,
      assigneeId: 3,
      statusId: 2,
    },
    {
      id: 3,
      projectId: 1,
      name: 'Product Catalog',
      description: 'Develop product listing and filtering system',
      dueDate: new Date(2024, 2, 15),
      priority: 2,
      assigneeId: 2,
      statusId: 1,
    },

    // Mobile App tasks
    {
      id: 4,
      projectId: 2,
      name: 'Setup React Native',
      description: 'Configure development environment',
      dueDate: new Date(2024, 2, 10),
      priority: 1,
      assigneeId: 3,
      statusId: 1,
    },
    {
      id: 5,
      projectId: 2,
      name: 'Design App UI',
      description: 'Create app screens and navigation flow',
      dueDate: new Date(2024, 2, 20),
      priority: 1,
      assigneeId: 4,
      statusId: 1,
    },

    // Backend API tasks
    {
      id: 6,
      projectId: 3,
      name: 'Design API Schema',
      description: 'Define endpoints and data structures',
      dueDate: new Date(2024, 1, 28),
      priority: 1,
      assigneeId: 2,
      statusId: 3,
    },
    {
      id: 7,
      projectId: 3,
      name: 'Implement Authentication',
      description: 'Create JWT authentication system',
      dueDate: new Date(2024, 2, 15),
      priority: 1,
      assigneeId: 4,
      statusId: 2,
    },
    {
      id: 8,
      projectId: 3,
      name: 'Database Setup',
      description: 'Configure PostgreSQL and migrations',
      dueDate: new Date(2024, 2, 1),
      priority: 2,
      assigneeId: 2,
      statusId: 1,
    },
  ];

  readonly taskEvents: TaskEventEntity[] = [
    // Homepage Design events
    {
      id: 1,
      taskId: 1,
      description: 'Task created',
      date: new Date(2024, 0, 1),
    },
    {
      id: 2,
      taskId: 1,
      description: 'Assigned to Alice',
      date: new Date(2024, 0, 1),
    },
    {
      id: 3,
      taskId: 1,
      description: 'Status changed to In Progress',
      date: new Date(2024, 0, 5),
    },
    {
      id: 4,
      taskId: 1,
      description: 'Status changed to Done',
      date: new Date(2024, 0, 14),
    },

    // Payment Gateway events
    {
      id: 5,
      taskId: 2,
      description: 'Task created',
      date: new Date(2024, 1, 1),
    },
    {
      id: 6,
      taskId: 2,
      description: 'Assigned to Bob',
      date: new Date(2024, 1, 1),
    },
    {
      id: 7,
      taskId: 2,
      description: 'Status changed to In Progress',
      date: new Date(2024, 1, 5),
    },

    // API Schema events
    {
      id: 8,
      taskId: 6,
      description: 'Task created',
      date: new Date(2024, 1, 15),
    },
    {
      id: 9,
      taskId: 6,
      description: 'Assigned to Alice',
      date: new Date(2024, 1, 15),
    },
    {
      id: 10,
      taskId: 6,
      description: 'Status changed to In Progress',
      date: new Date(2024, 1, 16),
    },
    {
      id: 11,
      taskId: 6,
      description: 'Status changed to Done',
      date: new Date(2024, 1, 27),
    },
  ];
}
