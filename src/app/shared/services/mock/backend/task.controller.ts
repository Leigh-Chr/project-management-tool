import { Injectable, inject } from '@angular/core';
import { type Observable, of } from 'rxjs';
import type { TaskEntity } from '../../../models/entities';
import type {
  DeleteTaskResponse,
  GetTaskDetailsResponse,
  GetTaskResponse,
  GetTasksResponse,
  PatchTaskRequest,
  PatchTaskResponse,
  PostTaskRequest,
  PostTaskResponse,
  Task,
} from '../../../models/task.models';
import { DatabaseMockService } from '../database/database.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TaskController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  getTask(taskId: number): Observable<GetTaskResponse | undefined> {
    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
    if (!taskEntity) {
      return of(undefined);
    }

    const myRole = this.authService.getRole(taskEntity.projectId);
    if (!myRole) {
      return of(undefined);
    }

    const status = this.database.statuses.find(
      (s) => s.id === taskEntity.statusId
    );
    if (!status) {
      return of(undefined);
    }

    const project = this.database.projects.find(
      (p) => p.id === taskEntity.projectId
    );
    if (!project) {
      return of(undefined);
    }

    const taskHistory = this.database.taskEvents.filter(
      (te) => te.taskId === taskEntity.id
    );

    return of({
      id: taskEntity.id,
      name: taskEntity.name,
      description: taskEntity.description,
      dueDate: taskEntity.dueDate,
      priority: taskEntity.priority,
      status: status.name,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        status: status.name,
        myRole,
      },
      taskHistory,
    });
  }

  getTasks(): Observable<GetTasksResponse> {
    return of(
      this.database.tasks
        .map((t) => {
          const myRole = this.authService.getRole(t.projectId);
          if (!myRole) {
            return null;
          }

          const statusEntity = this.database.statuses.find(
            (s) => s.id === t.statusId
          );
          if (!statusEntity) {
            return null;
          }

          const projectEntity = this.database.projects.find(
            (p) => p.id === t.projectId
          );
          if (!projectEntity) {
            return null;
          }

          const projectMemberEntity = this.database.projectMembers.find(
            (pm) => pm.projectId === t.projectId && pm.userId === t.assigneeId
          );

          const userEntity = this.database.users.find(
            (u) => u.id === projectMemberEntity?.userId
          );

          const roleEntity = this.database.roles.find(
            (r) => r.id === projectMemberEntity?.roleId
          );

          let assignee: Task['assignee'] | undefined = undefined;
          if (projectMemberEntity && userEntity && roleEntity) {
            assignee = {
              id: projectMemberEntity.id,
              username: userEntity.username,
              email: userEntity.email,
              role: roleEntity.name,
            };
          }

          const taskHistory = this.database.taskEvents.filter(
            (te) => te.taskId === t.id
          );

          return {
            id: t.id,
            name: t.name,
            description: t.description,
            dueDate: t.dueDate,
            priority: t.priority,
            status: statusEntity.name,
            project: {
              id: projectEntity.id,
              name: projectEntity.name,
              description: projectEntity.description,
              status: statusEntity.name,
            },
            assignee,
            myRole,
            taskHistory,
          };
        })
        .filter((t): t is NonNullable<typeof t> => t !== null)
    );
  }

  getTaskDetails(
    taskId: number
  ): Observable<GetTaskDetailsResponse | undefined> {
    const task = this.database.tasks.find((t) => t.id === taskId);
    if (!task) {
      return of(undefined);
    }

    const myRole = this.authService.getRole(task.projectId);
    if (!myRole) {
      return of(undefined);
    }

    const status = this.database.statuses.find((s) => s.id === task.statusId);
    if (!status) {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === task.projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }

    const projectMemberEntity = this.database.projectMembers.find(
      (pm) => pm.projectId === task.projectId && pm.userId === task.assigneeId
    );

    const roleEntity = this.database.roles.find(
      (r) => r.id === projectMemberEntity?.roleId
    );

    const userEntity = this.database.users.find(
      (u) => u.id === projectMemberEntity?.userId
    );

    let assignee: Task['assignee'] | undefined = undefined;
    if (projectMemberEntity && userEntity && roleEntity) {
      assignee = {
        id: projectMemberEntity.id,
        username: userEntity.username,
        email: userEntity.email,
        role: roleEntity.name,
      };
    }

    const taskHistory = this.database.taskEvents.filter(
      (te) => te.taskId === task.id
    );

    return of({
      id: task.id,
      name: task.name,
      description: task.description,
      status: status.name,
      project: {
        id: projectEntity.id,
        name: projectEntity.name,
        description: projectEntity.description,
        status: status.name,
      },
      assignee,
      priority: task.priority,
      myRole,
      dueDate: task.dueDate,
      taskHistory,
    });
  }

  deleteTask(taskId: number): Observable<DeleteTaskResponse | undefined> {
    const task: TaskEntity | null =
      this.database.tasks.find((t) => t.id === taskId) ?? null;
    if (!task) {
      return of(undefined);
    }

    const myRole = this.authService.getRole(task.projectId);
    if (myRole !== 'Admin' && myRole !== 'Member') {
      return of(undefined);
    }

    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);
    this.database.taskEvents.splice(
      this.database.taskEvents.findIndex((th) => th.taskId === taskId),
      1
    );

    const status = this.database.statuses.find((s) => s.id === task.statusId);
    if (!status) {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === task.projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }

    const taskHistory = this.database.taskEvents.filter(
      (te) => te.taskId === task.id
    );

    return of({
      id: task.id,
      name: task.name,
      description: task.description,
      status: status.name,
      project: {
        id: projectEntity.id,
        name: projectEntity.name,
        description: projectEntity.description,
        status: status.name,
      },
      myRole,
      taskHistory,
    });
  }

  addTask(task: PostTaskRequest): Observable<PostTaskResponse | undefined> {
    const myRole = this.authService.getRole(task.projectId);
    if (!myRole || myRole !== 'Admin') {
      return of(undefined);
    }

    const defaultStatus = this.database.statuses[0];

    const taskEntity: TaskEntity = {
      id: this.database.tasks.length + 1,
      ...task,
      statusId: defaultStatus.id,
    };
    this.database.tasks.push(taskEntity);

    const status = this.database.statuses.find(
      (s) => s.id === taskEntity.statusId
    );
    if (!status) {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === taskEntity.projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }

    this.database.taskEvents.push({
      id: this.database.taskEvents.length + 1,
      taskId: taskEntity.id,
      description: `Task ${taskEntity.name} was created`,
      date: new Date(),
    });

    const taskHistory = this.database.taskEvents.filter(
      (te) => te.taskId === taskEntity.id
    );

    return of({
      id: taskEntity.id,
      name: taskEntity.name,
      description: taskEntity.description,
      status: status.name,
      project: {
        id: projectEntity.id,
        name: projectEntity.name,
        description: projectEntity.description,
        status: status.name,
      },
      myRole,
      taskHistory,
    });
  }

  patchTask(
    taskId: number,
    task: PatchTaskRequest
  ): Observable<PatchTaskResponse | undefined> {
    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
    if (!taskEntity) {
      return of(undefined);
    }

    const myRole = this.authService.getRole(taskEntity.projectId);
    if (!myRole || myRole !== 'Admin') {
      return of(undefined);
    }

    const updatedTaskEntity = { ...taskEntity, ...task };
    this.database.tasks[this.database.tasks.indexOf(taskEntity)] =
      updatedTaskEntity;

    const status = this.database.statuses.find(
      (s) => s.id === updatedTaskEntity.statusId
    );
    if (!status) {
      return of(undefined);
    }

    const projectEntity = this.database.projects.find(
      (p) => p.id === updatedTaskEntity.projectId
    );
    if (!projectEntity) {
      return of(undefined);
    }

    const projectMemberEntity = this.database.projectMembers.find(
      (pm) =>
        pm.projectId === updatedTaskEntity.projectId &&
        pm.userId === updatedTaskEntity.assigneeId
    );

    const roleEntity = this.database.roles.find(
      (r) => r.id === projectMemberEntity?.roleId
    );

    const userEntity = this.database.users.find(
      (u) => u.id === projectMemberEntity?.userId
    );

    let assignee: Task['assignee'] | undefined = undefined;
    if (projectMemberEntity && userEntity && roleEntity) {
      assignee = {
        id: projectMemberEntity.id,
        username: userEntity.username,
        email: userEntity.email,
        role: roleEntity.name,
      };
    }

    console.log(taskEntity.dueDate);

    const initialTask: Task = {
      id: taskEntity.id,
      name: taskEntity.name,
      description: taskEntity.description,
      status: status.name,
      project: {
        id: projectEntity.id,
        name: projectEntity.name,
        description: projectEntity.description,
        status: status.name,
      },
      assignee,
      priority: taskEntity.priority,
      dueDate: taskEntity.dueDate,
      myRole,
      taskHistory: [],
    };

    const updatedTask: Task = {
      id: updatedTaskEntity.id,
      name: updatedTaskEntity.name,
      description: updatedTaskEntity.description,
      status: status.name,
      project: {
        id: projectEntity.id,
        name: projectEntity.name,
        description: projectEntity.description,
        status: status.name,
      },
      assignee,
      priority: updatedTaskEntity.priority,
      dueDate: updatedTaskEntity.dueDate,
      myRole,
      taskHistory: [],
    };

    const description = this.parseTaskUpdate(initialTask, updatedTask);
    if (!description) {
      return of(undefined);
    }

    this.database.taskEvents.push({
      id: this.database.taskEvents.length + 1,
      taskId: updatedTaskEntity.id,
      description,
      date: new Date(),
    });

    const taskHistory = this.database.taskEvents.filter(
      (te) => te.taskId === updatedTaskEntity.id
    );

    updatedTask.taskHistory = taskHistory;

    return of(updatedTask);
  }

  private parseTaskUpdate(
    initialTask: Task,
    updatedTask: Task
  ): string | undefined {
    const changes: string[] = [];

    const addChange = (
      label: string,
      oldValue: string | undefined,
      newValue: string | undefined
    ): void => {
      if (oldValue !== newValue) {
        changes.push(`${label}: ${oldValue} > ${newValue}`);
      }
    };

    addChange('name', initialTask.name, updatedTask.name);
    addChange('description', initialTask.description, updatedTask.description);
    addChange('status', initialTask.status, updatedTask.status);
    addChange('project', initialTask.project.name, updatedTask.project.name);
    addChange(
      'assignee',
      initialTask.assignee?.username,
      updatedTask.assignee?.username
    );
    addChange(
      'priority',
      initialTask.priority?.toString(),
      updatedTask.priority?.toString()
    );
    addChange(
      'dueDate',
      initialTask.dueDate?.toLocaleDateString(),
      updatedTask.dueDate?.toLocaleDateString()
    );

    if (changes.length > 0) {
      return `Task ${updatedTask.name} was updated: \n${changes.join('\n')}\n`;
    }

    return undefined;
  }
}
