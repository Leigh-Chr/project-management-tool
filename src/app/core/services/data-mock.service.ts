import { Injectable } from '@angular/core';
import { LoginParams, RegisterParams, RegisterResponse } from './auth.service';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type Role = {
  id: number;
  name: string;
};

export type Status = {
  id: number;
  name: string;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  statusId: Status['id'];
};

export type ProjectKey = keyof Project;

export type ProjectMember = {
  projectId: Project['id'];
  userId: User['id'];
  roleId: Role['id'];
};

export type Task = {
  id: number;
  projectId: Project['id'];
  name: string;
  description?: string;
  dueDate: Date;
  priority: number;
  assigneeId: number;
  statusId: Status['id'];
};

export type TaskHistory = {
  id: number;
  taskId: Task['id'];
  name: string;
  description?: string;
  date: Date;
};

@Injectable({
  providedIn: 'root',
})
export class DataMockService {
  readonly users: User[] = [
    {
      id: 1,
      username: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    },
    {
      id: 2,
      username: 'Bob',
      email: 'bob@example.com',
      password: 'password456',
    },
    {
      id: 3,
      username: 'Charlie',
      email: 'charlie@example.com',
      password: 'password789',
    },
  ];

  readonly statuses: Status[] = [
    {
      id: 1,
      name: 'Non commencé',
    },
    {
      id: 2,
      name: 'En cours',
    },
    {
      id: 3,
      name: 'Terminé',
    },
    {
      id: 4,
      name: 'Annulé',
    },
  ];

  readonly projects: Project[] = [
    {
      id: 1,
      name: 'Project Alpha',
      description: 'Description of Project Alpha',
      startDate: new Date('2024-01-01'),
      statusId: 1,
    },
    {
      id: 2,
      name: 'Project Beta',
      description: 'Description of Project Beta',
      startDate: new Date('2024-02-01'),
      statusId: 2,
    },
  ];

  readonly roles: Role[] = [
    {
      id: 1,
      name: 'Admin',
    },
    {
      id: 2,
      name: 'Member',
    },
    {
      id: 3,
      name: 'Observer',
    },
  ];

  readonly projectMembers: ProjectMember[] = [
    {
      projectId: 1,
      userId: 1,
      roleId: 1,
    },
    {
      projectId: 1,
      userId: 2,
      roleId: 2,
    },
    {
      projectId: 1,
      userId: 3,
      roleId: 3,
    },
    {
      projectId: 2,
      userId: 2,
      roleId: 1,
    },
    {
      projectId: 2,
      userId: 1,
      roleId: 2,
    },
    {
      projectId: 2,
      userId: 3,
      roleId: 2,
    },
  ];

  readonly tasks: Task[] = [
    {
      id: 1,
      projectId: 1,
      name: 'Task 1',
      description: 'Description of Task 1',
      dueDate: new Date('2024-01-15'),
      priority: 1,
      assigneeId: 1,
      statusId: 1,
    },
    {
      id: 2,
      projectId: 1,
      name: 'Task 2',
      description: 'Description of Task 2',
      dueDate: new Date('2024-01-30'),
      priority: 2,
      assigneeId: 2,
      statusId: 2,
    },
    {
      id: 3,
      projectId: 2,
      name: 'Task 3',
      description: 'Description of Task 3',
      dueDate: new Date('2024-02-15'),
      priority: 1,
      assigneeId: 3,
      statusId: 3,
    },
    {
      id: 4,
      projectId: 2,
      name: 'Task 4',
      description: 'Description of Task 4',
      dueDate: new Date('2024-02-28'),
      priority: 2,
      assigneeId: 1,
      statusId: 4,
    },
  ];

  readonly taskHistories: TaskHistory[] = [
    {
      id: 1,
      taskId: 1,
      name: 'Task 1 Created',
      description: 'Task 1 created by Alice',
      date: new Date('2024-01-01'),
    },
    {
      id: 2,
      taskId: 2,
      name: 'Task 2 Created',
      description: 'Task 2 created by Bob',
      date: new Date('2024-01-02'),
    },
    {
      id: 3,
      taskId: 3,
      name: 'Task 3 Created',
      description: 'Task 3 created by Charlie',
      date: new Date('2024-02-01'),
    },
    {
      id: 4,
      taskId: 4,
      name: 'Task 4 Created',
      description: 'Task 4 created by Alice',
      date: new Date('2024-02-02'),
    },
  ];

  addUser(userParams: RegisterParams): RegisterResponse {
    const newUser: User = {
      id: this.users.length + 1,
      ...userParams,
    };
    this.users.push(newUser);
    return newUser;
  }

  getUser(userParams: LoginParams): User | undefined {
    return this.users.find(
      (user) =>
        user.email === userParams.email && user.password === userParams.password
    );
  }

  getProjectMembers(): ProjectMember[] {
    return this.projectMembers;
  }

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: Project): void {
    this.projects.push(project);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getTaskHistories(): TaskHistory[] {
    return this.taskHistories;
  }
}
