import { inject, Injectable } from '@angular/core';
import { TaskResponse } from '../../../models/Tasks/TaskResponse';
import { TaskDetailsResponse } from '../../../models/Tasks/TaskDetailsResponse';
import { filterEntitiesByField, findEntityById } from '../database/utils';
import { DatabaseMockService } from '../database/database.service';
import {
  ProjectEntity,
  StatusEntity,
  TaskEntity,
  TaskHistoryEntity,
  UserEntity,
} from '../database/entities';
import { TaskSummaryResponse } from '../../../models/Tasks/TaskSummaryResponse';
import { AddTaskRequest } from '../../../models/Tasks/AddTaskRequest';
import { AuthService } from '../../auth.service';
import { TaskEventResponse } from '../../../models/Tasks/TaskEventResponse';

@Injectable({ providedIn: 'root' })
export class TaskController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  async getTaskDetails(taskId: number): Promise<TaskDetailsResponse | null> {
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
    >(this.database.taskHistory, 'taskId', taskId);

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

  async getTaskSummaries(
    assignedOnly: boolean = false
  ): Promise<TaskSummaryResponse[]> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return [];
    let taskEntities = this.database.tasks;

    if (assignedOnly) {
      const userTaskIds = this.database.tasks
        .filter((task) => task.assigneeId === userId)
        .map((task) => task.id);

      taskEntities = this.database.tasks.filter((task) =>
        userTaskIds.includes(task.id)
      );
    }

    const statusEntities = this.database.statuses;

    const taskSummaries: TaskSummaryResponse[] = await Promise.all(
      taskEntities.map(async (task) => {
        const status =
          statusEntities.find((status) => status.id === task.statusId)?.name ??
          statusEntities[0].name;

        const permissions = {
          deleteTask: await this.isAdmin(task.id, userId),
        };

        return {
          id: task.id,
          name: task.name,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          status,
          project:
            this.database.projects.find((p) => p.id === task.projectId)?.name ??
            'Unknown',
          permissions,
        };
      })
    );

    return taskSummaries;
  }

  async getTaskSummary(taskId: number): Promise<TaskSummaryResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;

    const taskEntity = findEntityById<TaskEntity>(this.database.tasks, taskId);

    if (!taskEntity) return null;

    const statusEntities = this.database.statuses.find(
      (s) => s.id === taskEntity.statusId
    );
    const status = statusEntities?.name ?? 'Unknown';

    const permissions = {
      deleteTask: await this.isAdmin(taskEntity.id, userId),
    };

    return {
      id: taskEntity.id,
      name: taskEntity.name,
      description: taskEntity.description,
      dueDate: taskEntity.dueDate,
      priority: taskEntity.priority,
      status,
      project:
        this.database.projects.find((p) => p.id === taskEntity.projectId)
          ?.name ?? 'Unknown',
      permissions,
    };
  }

  async getTask(taskId: number): Promise<TaskResponse | null> {
    const taskEntity = findEntityById<TaskEntity>(this.database.tasks, taskId);

    if (!taskEntity) return null;

    return {
      id: taskEntity.id,
      name: taskEntity.name,
      description: taskEntity.description,
      dueDate: taskEntity.dueDate,
      priority: taskEntity.priority,
      statusId: taskEntity.statusId,
      assigneeId: taskEntity.assigneeId,
      projectId: taskEntity.projectId,
    };
  }

  async deleteTask(taskId: number): Promise<TaskResponse | null> {
    const task: TaskResponse | null =
      this.database.tasks.find((t) => t.id === taskId) ?? null;

    if (!task) return null;
    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);
    this.database.taskHistory.splice(
      this.database.taskHistory.findIndex((th) => th.taskId === taskId),
      1
    );

    return task;
  }

  async addTask(task: AddTaskRequest): Promise<TaskResponse> {
    const taskEntity: TaskEntity = {
      id: this.database.tasks.length + 1,
      ...task,
      statusId: 1,
    };

    this.database.tasks.push(taskEntity);

    return taskEntity;
  }

  async isAdmin(taskId: number, userId: number): Promise<boolean> {
    const projectId = this.database.tasks.find(
      (t) => t.id === taskId
    )?.projectId;

    return this.database.projectMembers.some(
      (pm) =>
        pm.projectId === projectId && pm.userId === userId && pm.roleId === 1
    );
  }

  async getTaskHistory(): Promise<TaskEventResponse[]> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return [];

    const taskIds = this.database.tasks
      .filter((task) => task.assigneeId === userId)
      .map((task) => task.id);

    const taskHistoryEntities = this.database.taskHistory.filter((th) =>
      taskIds.includes(th.taskId)
    );

    return taskHistoryEntities.map((th) => ({
      id: th.id,
      taskId: th.taskId,
      name: th.name,
      description: th.description,
      date: th.date,
    }));
  }
}
