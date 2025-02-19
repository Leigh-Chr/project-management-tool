import { inject, Injectable } from '@angular/core';
import { GetUserResponse } from '../../../models/GetUserResponse';
import { AddTaskRequest } from '../../../models/Tasks/AddTaskRequest';
import { GetTaskDetailsResponse } from '../../../models/Tasks/GetTaskDetailsResponse';
import { GetTaskEventResponse } from '../../../models/Tasks/GetTaskEventResponse';
import { GetTaskResponse } from '../../../models/Tasks/GetTaskResponse';
import { GetTaskSummaryResponse } from '../../../models/Tasks/GetTaskSummaryResponse';
import { AuthService } from '../../auth.service';
import { DatabaseMockService } from '../database/database.service';
import {
  TaskEntity
} from '../database/entities';

@Injectable({ providedIn: 'root' })
export class TaskController {
  private readonly database = inject(DatabaseMockService);
  private readonly authService = inject(AuthService);

  async getTaskDetails(taskId: number): Promise<GetTaskDetailsResponse | null> {
    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
    if (!taskEntity) return null;

    const assigneeEntity = this.database.users.find(
      (u) => u.id === taskEntity.assigneeId
    )!;

    const defaultStatusEntity = this.database.statuses[0];
    const taskStatusEntity = this.database.statuses.find(
      (s) => s.id === taskEntity.statusId
    ) ?? defaultStatusEntity;

    const projectEntity = this.database.projects.find(
      (p) => p.id === taskEntity.projectId
    );

    if (!projectEntity) return null;

    const projectStatusEntity = this.database.statuses.find(
      (s) => s.id === projectEntity.statusId
    );

    const taskHistoryEntities = this.database.taskHistory.filter(
      (th) => th.taskId === taskId
    );

    const isAdmin = this.isAdmin(taskId, this.authService.authUser()!.id);
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
        status: projectStatusEntity,
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
  ): Promise<GetTaskSummaryResponse[]> {
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

  async getTaskSummary(taskId: number): Promise<GetTaskSummaryResponse | null> {
    const userId = this.authService.authUser()?.id;
    if (!userId) return null;

    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
    if (!taskEntity) return null;

    const statusEntities = this.database.statuses.find(
      (s) => s.id === taskEntity.statusId
    );

    const permissions = {
      deleteTask: this.isAdmin(taskEntity.id, userId),
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

  async getTask(taskId: number): Promise<GetTaskResponse | null> {
    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
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

  async deleteTask(taskId: number): Promise<GetTaskResponse | null> {
    const task: GetTaskResponse | null =
      this.database.tasks.find((t) => t.id === taskId) ?? null;
    if (!task) return null;

    const canDelete = this.isAdmin(taskId, this.authService.authUser()!.id);
    if (!canDelete) return null;

    this.database.tasks.splice(this.database.tasks.indexOf(task), 1);
    this.database.taskHistory.splice(
      this.database.taskHistory.findIndex((th) => th.taskId === taskId),
      1
    );

    return task;
  }

  async addTask(task: AddTaskRequest): Promise<GetTaskResponse | null> {
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

  async getTaskHistory(): Promise<GetTaskEventResponse[]> {
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

  async changeAssignee(taskId: number, newAssigneeId: number): Promise<GetUserResponse | null> {
    const taskEntity = this.database.tasks.find((t) => t.id === taskId);
    if (!taskEntity) return null;

    const newAssignee = this.database.users.find((u) => u.id === newAssigneeId);
    if (!newAssignee) return null;

    taskEntity.assigneeId = newAssigneeId;

    return newAssignee;
  }
}
