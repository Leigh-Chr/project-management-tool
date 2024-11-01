import { Injectable, inject } from '@angular/core';
import { TaskDetails } from '../../models/TaskDetails';
import { TaskControllerService } from '../mock/backend/task-controller.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskController = inject(TaskControllerService);

  async getTaskDetails(taskId: number): Promise<TaskDetails> {
    return this.taskController.getTaskDetails(taskId);
  }

  async deleteTask(taskId: number): Promise<void> {
    return this.taskController.deleteTask(taskId);
  }
}
