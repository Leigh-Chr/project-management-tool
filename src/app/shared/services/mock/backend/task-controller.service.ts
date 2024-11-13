import { inject, Injectable } from '@angular/core';
import { Task } from '../../../models/Task';
import { TaskDetails } from '../../../models/TaskDetails';
import { filterEntitiesByField, findEntityById } from '../database/utils';
import { DatabaseMockService } from '../database/database.service';
import {
  ProjectEntity,
  StatusEntity,
  TaskEntity,
  TaskHistoryEntity,
  UserEntity,
} from '../database/entities';

@Injectable({ providedIn: 'root' })
export class TaskControllerService {
  private readonly database = inject(DatabaseMockService);

  async getTaskDetails(taskId: number): Promise<TaskDetails | null> {
    const taskEntity = findEntityById<TaskEntity>(this.database.tasks, taskId);

    if (!taskEntity) return null;

    const assigneeEntity = filterEntitiesByField<UserEntity, 'id'>(
      this.database.users,
      'id',
      taskEntity.assigneeId
    )[0];

    const defaultStatusEntity = this.database.statuses[0];
    const taskStatusEntity =
      findEntityById<StatusEntity>(
        this.database.statuses,
        taskEntity.statusId
      ) ?? defaultStatusEntity;

    const projectEntity = findEntityById<ProjectEntity>(
      this.database.projects,
      taskEntity.projectId
    );

    if (!projectEntity) return null;

    const projectStatusEntity =
      findEntityById<StatusEntity>(
        this.database.statuses,
        projectEntity.statusId
      ) ?? defaultStatusEntity;

    const taskHistoryEntities = filterEntitiesByField<
      TaskHistoryEntity,
      'taskId'
    >(this.database.taskHistories, 'taskId', taskId);

    return {
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
    };
  }

  async deleteTask(taskId: number): Promise<Task | null> {
    const task: Task | null =
      this.database.tasks.find((t) => t.id === taskId) ?? null;

    if (!task) return null;
    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);

    return task;
  }
}
