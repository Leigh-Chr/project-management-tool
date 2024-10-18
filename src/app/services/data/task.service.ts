import { inject, Injectable, signal } from '@angular/core';
import { backendMockService, Task } from '../backend-mock.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly backendMockService = inject(backendMockService);

  readonly tasksSignal = signal<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  refreshTasks() {
    this.loadTasks();
  }

  private loadTasks() {
    this.tasksSignal.set(this.getTasks());
  }

  private getTasks(): Task[] {
    return this.backendMockService.getTasks();
  }
}
