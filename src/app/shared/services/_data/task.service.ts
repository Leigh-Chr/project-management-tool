import { Injectable, inject } from '@angular/core';
import { TaskDetails } from '../../models/TaskDetails';
import { TaskControllerService } from '../mock/backend/task-controller.service';
import { HttpResponse } from '@angular/common/http';
import { Task } from '../../models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskController = inject(TaskControllerService);

  async getTaskDetails(taskId: number): Promise<TaskDetails> {
    const response = await this.taskController.getTaskDetails(taskId);
    if (response instanceof HttpResponse) {
      return response.body as TaskDetails;
    } else {
      throw new Error('Failed to fetch task details');
    }
  }

  async deleteTask(taskId: number): Promise<Task> {
    const response = await this.taskController.deleteTask(taskId);
    if (response instanceof HttpResponse) {
      return response.body as Task;
    } else {
      throw new Error('Failed to delete task');
    }
  }
}
