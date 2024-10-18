import { inject, Injectable, signal } from '@angular/core';
import { backendMockService, TaskHistory } from '../backend-mock.service';

@Injectable({
  providedIn: 'root',
})
export class TaskHistoryService {
  private readonly backendMockService = inject(backendMockService);

  readonly taskHistoriesSignal = signal<TaskHistory[]>([]);

  constructor() {
    this.loadTaskHistories();
  }

  refreshTaskHistories() {
    this.loadTaskHistories();
  }

  private loadTaskHistories() {
    this.taskHistoriesSignal.set(this.getTaskHistories());
  }

  private getTaskHistories(): TaskHistory[] {
    return this.backendMockService.getTaskHistories();
  }
}
