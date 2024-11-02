import { Injectable, inject } from '@angular/core';
import { Task } from '../../models/Task';
import { TaskDetails } from '../../models/TaskDetails';
import { TaskControllerService } from '../mock/backend/task-controller.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskController = inject(TaskControllerService);

  async getTaskDetails(taskId: number): Promise<TaskDetails | null> {
    return this.taskController.getTaskDetails(taskId);
  }

  async deleteTask(taskId: number): Promise<Task | null> {
    return this.taskController.deleteTask(taskId);
  }
}
