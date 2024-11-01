import {
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../../../models/Task';
import { TaskDetails } from '../../../models/TaskDetails';
import { filterEntitiesByField, findEntityById } from '../backend.utils';
import { DatabaseMockService } from '../database.service';
import {
  ProjectEntity,
  StatusEntity,
  TaskEntity,
  TaskHistoryEntity,
  UserEntity,
} from '../entities';

@Injectable({ providedIn: 'root' })
export class TaskControllerService {
  private readonly database = inject(DatabaseMockService);

  async getTaskDetails(
    taskId: number
  ): Promise<HttpResponse<TaskDetails> | HttpErrorResponse> {
    const taskEntity = findEntityById<TaskEntity>(
      this.database.tasks,
      taskId,
      'Task'
    );

    const assigneeEntity = filterEntitiesByField<UserEntity, 'id'>(
      this.database.users,
      'id',
      taskEntity.assigneeId
    )[0];

    const defaultStatusEntity = this.database.statuses[0];
    const taskStatusEntity =
      findEntityById<StatusEntity>(
        this.database.statuses,
        taskEntity.statusId,
        'Task Status'
      ) ?? defaultStatusEntity;

    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      taskEntity.projectId,
      'Project'
    );

    const projectStatusEntity =
      findEntityById<StatusEntity>(
        this.database.statuses,
        projectEntity.statusId,
        'Project Status'
      ) ?? defaultStatusEntity;

    const taskHistoryEntities = filterEntitiesByField<
      TaskHistoryEntity,
      'taskId'
    >(this.database.taskHistories, 'taskId', taskId);

    return new HttpResponse({
      status: HttpStatusCode.Ok,
      body: {
        id: taskEntity.id,
        name: taskEntity.name,
        description: taskEntity.description,
        dueDate: taskEntity.dueDate,
        priority: taskEntity.priority,
        assignee: {
          id: assigneeEntity.id,
          username: assigneeEntity.username,
          email: assigneeEntity.email,
        },
        status: {
          id: taskStatusEntity.id,
          name: taskStatusEntity.name,
        },
        project: {
          id: projectEntity.id,
          name: projectEntity.name,
          description: projectEntity.description,
          startDate: projectEntity.startDate,
          endDate: projectEntity.endDate,
          status: {
            id: projectStatusEntity.id,
            name: projectStatusEntity.name,
          },
        },
        taskHistory: taskHistoryEntities.map((th) => ({
          id: th.id,
          name: th.name,
          description: th.description,
          date: th.date,
        })),
      },
    });
  }

  async deleteTask(
    taskId: number
  ): Promise<HttpResponse<Task> | HttpErrorResponse> {
    const task: Task | undefined = this.database.tasks.find(
      (t) => t.id === taskId
    );
    if (!task)
      return new HttpErrorResponse({ status: HttpStatusCode.NotFound });
    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);

    return new HttpResponse({
      status: HttpStatusCode.Ok,
      body: task,
    });
  }
}
