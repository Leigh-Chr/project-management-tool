import { Injectable, inject } from '@angular/core';
import { GetTaskResponse } from '../../models/Tasks/GetTaskResponse';
import { GetTaskDetailsResponse } from '../../models/Tasks/GetTaskDetailsResponse';
import { TaskController } from '../mock/backend/task.controller';
import { GetTaskSummaryResponse } from '../../models/Tasks/GetTaskSummaryResponse';
import { AddTaskRequest } from '../../models/Tasks/AddTaskRequest';
import { GetTaskEventResponse } from '../../models/Tasks/GetTaskEventResponse';
import { GetUserResponse } from '../../models/GetUserResponse';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskController = inject(TaskController);

  async getTaskDetails(taskId: number): Promise<GetTaskDetailsResponse | null> {
    return this.taskController.getTaskDetails(taskId);
  }

  async getTaskSummaries(
    assignedOnly: boolean = false
  ): Promise<GetTaskSummaryResponse[]> {
    return this.taskController.getTaskSummaries(assignedOnly);
  }

  async getTaskSummary(taskId: number): Promise<GetTaskSummaryResponse | null> {
    return this.taskController.getTaskSummary(taskId);
  }

  async deleteTask(taskId: number): Promise<GetTaskResponse | null> {
    return this.taskController.deleteTask(taskId);
  }

  async addTask(task: AddTaskRequest): Promise<GetTaskResponse | null> {
    return this.taskController.addTask(task);
  }

  async getTask(taskId: number): Promise<GetTaskResponse | null> {
    return this.taskController.getTask(taskId);
  }

  async getTaskHistory(
  ): Promise<GetTaskEventResponse[]> {
    return this.taskController.getTaskHistory();
  }

  async changeAssignee(
    taskId: number,
    newAssigneeId: number
  ): Promise<GetUserResponse | null> {
    return this.taskController.changeAssignee(taskId, newAssigneeId);
  }
}
