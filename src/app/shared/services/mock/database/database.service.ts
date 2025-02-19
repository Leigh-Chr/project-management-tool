import { Injectable } from '@angular/core';
import {
  ProjectEntity,
  ProjectMemberEntity,
  RoleEntity,
  StatusEntity,
  TaskEntity,
  TaskHistoryEntity,
  UserEntity,
} from './entities';

@Injectable({ providedIn: 'root' })
export class DatabaseMockService {
  readonly users: UserEntity[] = [
    { id: 1, username: 'alice', email: 'alice@example.com', password: 'pass123' },
    { id: 2, username: 'bob', email: 'bob@example.com', password: 'bobPass' },
    { id: 3, username: 'charlie', email: 'charlie@example.com', password: 'charliePass' },
    { id: 4, username: 'diana', email: 'diana@example.com', password: 'dianaPass' },
    { id: 5, username: 'eve', email: 'eve@example.com', password: 'evePass' },
    { id: 6, username: 'frank', email: 'frank@example.com', password: 'frankPass' },
  ];

  readonly statuses: StatusEntity[] = [
    { id: 1, name: 'Open' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Closed' },
    { id: 4, name: 'On Hold' },
    { id: 5, name: 'Review' },
  ];

  readonly projects: ProjectEntity[] = [
    { id: 1, name: 'Project Alpha', description: 'Initial project', startDate: new Date(2023, 0, 1), statusId: 1 },
    { id: 2, name: 'Project Beta', startDate: new Date(2023, 1, 15), endDate: new Date(2023, 3, 15), statusId: 2 },
    { id: 3, name: 'Project Gamma', description: 'Gamma description', startDate: new Date(2023, 4, 1), statusId: 1 },
    { id: 4, name: 'Project Delta', startDate: new Date(2023, 4, 15), endDate: new Date(2023, 5, 15), statusId: 4 },
  ];

  readonly roles: RoleEntity[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Member' },
  ];

  readonly projectMembers: ProjectMemberEntity[] = [
    { projectId: 1, userId: 1, roleId: 2 },
    { projectId: 1, userId: 2, roleId: 2 },
    { projectId: 2, userId: 3, roleId: 2 },
    { projectId: 2, userId: 4, roleId: 2 },
    { projectId: 3, userId: 5, roleId: 2 },
    { projectId: 3, userId: 6, roleId: 2 },
    { projectId: 4, userId: 3, roleId: 2 },
    { projectId: 1, userId: 6, roleId: 1 },
    { projectId: 2, userId: 1, roleId: 1 },
    { projectId: 3, userId: 2, roleId: 1 },
    { projectId: 4, userId: 5, roleId: 1 },
  ];

  readonly tasks: TaskEntity[] = [
    { id: 1, projectId: 1, name: 'Design UI', dueDate: new Date(2023, 0, 10), priority: 1, assigneeId: 2, statusId: 1 },
    { id: 2, projectId: 1, name: 'Setup Database', dueDate: new Date(2023, 0, 12), priority: 2, assigneeId: 1, statusId: 2 },
    { id: 3, projectId: 2, name: 'Implement API', dueDate: new Date(2023, 1, 20), priority: 1, assigneeId: 3, statusId: 1 },
    { id: 4, projectId: 1, name: 'Review UI', dueDate: new Date(2023, 0, 15), priority: 3, assigneeId: 1, statusId: 5 },
    { id: 5, projectId: 2, name: 'Test Beta features', dueDate: new Date(2023, 2, 25), priority: 2, assigneeId: 4, statusId: 2 },
    { id: 6, projectId: 3, name: 'Create Wireframes', dueDate: new Date(2023, 4, 10), priority: 1, assigneeId: 5, statusId: 1 },
  ];

  readonly taskHistory: TaskHistoryEntity[] = [
    {
      id: 1,
      taskId: 1,
      name: 'Initial Creation',
      date: new Date(2023, 0, 5),
    },
    {
      id: 2,
      taskId: 2,
      name: 'Assigned to Alice',
      date: new Date(2023, 0, 7),
    },
    {
      id: 3,
      taskId: 1,
      name: 'Updated requirements',
      date: new Date(2023, 0, 8),
    },
    {
      id: 4,
      taskId: 3,
      name: 'Work resumed',
      date: new Date(2023, 1, 25),
    },
  ];
}
