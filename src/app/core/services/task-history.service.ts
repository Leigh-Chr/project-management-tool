import { inject, Injectable, signal } from '@angular/core';
import { DataMockService, TaskHistory } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class TaskHistoryService {
  private readonly dataMockService = inject(DataMockService);

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
    return this.dataMockService.getTaskHistories();
  }
}
