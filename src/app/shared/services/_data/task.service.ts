import { Injectable, inject } from '@angular/core';
import { TaskResponse } from '../../models/Tasks/TaskResponse';
import { TaskDetailsResponse } from '../../models/Tasks/TaskDetailsResponse';
import { TaskControllerService } from '../mock/backend/task-controller.service';
import { TaskSummaryResponse } from '../../models/Tasks/TaskSummaryResponse';
import { AddTaskRequest } from '../../models/Tasks/AddTaskRequest';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskController = inject(TaskControllerService);

  async getTaskDetails(taskId: number): Promise<TaskDetailsResponse | null> {
    return this.taskController.getTaskDetails(taskId);
  }

  async getTaskSummaries(
    assignedOnly: boolean = false
  ): Promise<TaskSummaryResponse[]> {
    return this.taskController.getTaskSummaries(assignedOnly);
  }

  async getTaskSummary(taskId: number): Promise<TaskSummaryResponse | null> {
    return this.taskController.getTaskSummary(taskId);
  }

  async deleteTask(taskId: number): Promise<TaskResponse | null> {
    return this.taskController.deleteTask(taskId);
  }

  async addTask(task: AddTaskRequest): Promise<TaskResponse> {
    return this.taskController.addTask(task);
  }

  async getTask(taskId: number): Promise<TaskResponse | null> {
    return this.taskController.getTask(taskId);
  }
}
