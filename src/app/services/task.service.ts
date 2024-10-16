import { inject, Injectable, signal } from '@angular/core';
import { DataMockService, Task } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly dataMockService = inject(DataMockService);

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
    return this.dataMockService.getTasks();
  }
}
