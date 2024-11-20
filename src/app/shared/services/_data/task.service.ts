import { Injectable, inject } from '@angular/core';
import { TaskResponse } from '../../models/TaskResponse';
import { TaskDetailsResponse } from '../../models/TaskDetailsResponse';
import { TaskControllerService } from '../mock/backend/task-controller.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskController = inject(TaskControllerService);

  async getTaskDetails(taskId: number): Promise<TaskDetailsResponse | null> {
    return this.taskController.getTaskDetails(taskId);
  }

  async deleteTask(taskId: number): Promise<TaskResponse | null> {
    return this.taskController.deleteTask(taskId);
  }
}
