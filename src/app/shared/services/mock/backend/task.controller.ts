import { Injectable, inject } from '@angular/core';
import { type Observable, of } from 'rxjs';
import type { TaskEntity, TaskEventEntity } from '../../../models/entities';
import type {
  DeleteTaskResponse,
  GetTaskDetailsResponse,
  GetTaskResponse,
  GetTasksResponse,
  PostTaskRequest,
  PostTaskResponse,
} from '../../../models/task.models';
import { DatabaseMockService } from '../database/database.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TaskController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  getTask(taskId: number): Observable<GetTaskResponse | undefined> {
    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
    if (!taskEntity) return of(undefined);

    const status = this.database.statuses.find(
      (s) => s.id === taskEntity.statusId
    );
    if (!status) return of(undefined);

    const project = this.database.projects.find(
      (p) => p.id === taskEntity.projectId
    );
    if (!project) return of(undefined);

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
      },
    });
  }

  getTasks(): Observable<GetTasksResponse> {
    return of(
      this.database.tasks
        .map((t) => {
          const status = this.database.statuses.find(
            (s) => s.id === t.statusId
          );
          if (!status) return null;

          const project = this.database.projects.find(
            (p) => p.id === t.projectId
          );
          if (!project) return null;

          const assignee = this.database.users.find(
            (u) => u.id === t.assigneeId
          );
          if (!assignee) return null;

          return {
            id: t.id,
            name: t.name,
            description: t.description,
            dueDate: t.dueDate,
            priority: t.priority,
            status: status.name,
            project: {
              id: project.id,
              name: project.name,
              description: project.description,
              status: status.name,
            },
            assignee: assignee.username,
          };
        })
        .filter((t): t is NonNullable<typeof t> => t !== null)
    );
  }

  getTaskDetails(
    taskId: number
  ): Observable<GetTaskDetailsResponse | undefined> {
    const myRole = this.authService.getRole(taskId);

    const task = this.database.tasks.find((t) => t.id === taskId);
    if (!task) return of(undefined);

    const status = this.database.statuses.find((s) => s.id === task.statusId);
    if (!status) return of(undefined);

    const projectEntity = this.database.projects.find(
      (p) => p.id === task.projectId
    );
    if (!projectEntity) return of(undefined);

    const assignee = this.database.users.find((u) => u.id === task.assigneeId);
    if (!assignee) return of(undefined);

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
      assignee: assignee.username,
      priority: task.priority,
      myRole: myRole,
    });
  }

  deleteTask(taskId: number): Observable<DeleteTaskResponse | undefined> {
    const task: TaskEntity | null =
      this.database.tasks.find((t) => t.id === taskId) ?? null;
    if (!task) return of(undefined);

    const myRole = this.authService.getRole(task.projectId);
    if (myRole !== 'Admin') return of(undefined);

    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);
    this.database.taskHistory.splice(
      this.database.taskHistory.findIndex((th) => th.taskId === taskId),
      1
    );

    const status = this.database.statuses.find((s) => s.id === task.statusId);
    if (!status) return of(undefined);

    const projectEntity = this.database.projects.find(
      (p) => p.id === task.projectId
    );
    if (!projectEntity) return of(undefined);

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
      myRole: myRole,
    });
  }

  addTask(task: PostTaskRequest): Observable<PostTaskResponse | undefined> {
    const myRole = this.authService.getRole(task.projectId);
    if (myRole !== 'Admin') return of(undefined);

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
    if (!status) return of(undefined);

    const projectEntity = this.database.projects.find(
      (p) => p.id === taskEntity.projectId
    );
    if (!projectEntity) return of(undefined);

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
    });
  }

  getTaskHistory(): Observable<TaskEventEntity[]> {
    // const userId = this.authService.authUser()?.id;
    const userId = 0; //TODO: remove this
    if (!userId) return of([]);

    const taskIds = this.database.tasks
      .filter((task) => task.assigneeId === userId)
      .map((task) => task.id);

    const taskHistoryEntities = this.database.taskHistory.filter((th) =>
      taskIds.includes(th.taskId)
    );

    return of(
      taskHistoryEntities.map((th) => ({
        id: th.id,
        taskId: th.taskId,
        description: th.description,
        date: th.date,
      }))
    );
  }
}
