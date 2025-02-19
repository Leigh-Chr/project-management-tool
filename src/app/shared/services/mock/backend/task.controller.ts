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
import { UserResponse } from '../../../models/UserResponse';

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

    const isAdmin = await this.isAdmin(taskId, this.authService.authUser()!.id);
    const permissions = {
      editTask: isAdmin,
    };

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
      permissions,
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

    const taskSummaries =
      taskEntities.filter((task) => this.database.projects.some(
        (p) => p.id === task.projectId

      )).
        map((task) => {
          const project = this.database.projects.find(
            (p) => p.id === task.projectId
          )!;

          const status =
            statusEntities.find((status) => status.id === task.statusId);

          const permissions = {
            deleteTask: this.isAdmin(task.id, userId),
          };

          return {
            id: task.id,
            name: task.name,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status,
            project,
            permissions,
          };
        })

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

    const permissions = {
      deleteTask: await this.isAdmin(taskEntity.id, userId),
    };

    const project = this.database.projects.find(
      (p) => p.id === taskEntity.projectId
    );
    if (!project) return null;

    return {
      id: taskEntity.id,
      name: taskEntity.name,
      description: taskEntity.description,
      dueDate: taskEntity.dueDate,
      priority: taskEntity.priority,
      status: statusEntities,
      project,
      permissions,
    };
  }

  async getTask(taskId: number): Promise<TaskResponse | null> {
    const taskEntity = findEntityById<TaskEntity>(this.database.tasks, taskId);
    if (!taskEntity) return null;

    const canView = this.database.projectMembers.some(
      (pm) =>
        pm.projectId === taskEntity.projectId &&
        pm.userId === this.authService.authUser()!.id
    );
    if (!canView) return null;

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

    const canDelete = await this.isAdmin(taskId, this.authService.authUser()!.id);
    if (!canDelete) return null;

    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);
    this.database.taskHistory.splice(
      this.database.taskHistory.findIndex((th) => th.taskId === taskId),
      1
    );

    return task;
  }

  async addTask(task: AddTaskRequest): Promise<TaskResponse | null> {
    console.log('task', task);
    console.log('projectMembers', this.database.projectMembers);
    const userId = this.authService.authUser()!.id;
    console.log('userId', userId);
    const canAdd = this.database.projectMembers.some(
      (pm) =>
        pm.projectId === task.projectId &&
        pm.userId === userId
    );
    console.log('canAdd', canAdd);
    if (!canAdd) return null;

    const doesProjectExist = this.database.projects.some(
      (p) => p.id === task.projectId
    );
    console.log('doesProjectExist', doesProjectExist);
    if (!doesProjectExist) return null;
    const doesAssigneeExist = this.database.users.some(
      (u) => u.id === task.assigneeId
    );
    console.log('doesAssigneeExist', doesAssigneeExist);
    if (!doesAssigneeExist) return null;

    const taskEntity: TaskEntity = {
      id: this.database.tasks.length + 1,
      ...task,
      statusId: 1,
    };

    this.database.tasks.push(taskEntity);
    return taskEntity;
  }

  isAdmin(taskId: number, userId: number): boolean {
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

  async changeAssignee(taskId: number, newAssigneeId: number): Promise<UserResponse | null> {
    const taskEntity = findEntityById<TaskEntity>(this.database.tasks, taskId);
    if (!taskEntity) return null;

    const newAssignee = this.database.users.find((u) => u.id === newAssigneeId);
    if (!newAssignee) return null;

    taskEntity.assigneeId = newAssigneeId;

    return newAssignee;
  }
}
