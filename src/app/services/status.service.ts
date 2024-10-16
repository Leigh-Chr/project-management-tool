import { Injectable, inject, signal } from '@angular/core';
import { DataMockService, Status } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private readonly dataMockService = inject(DataMockService);

  readonly statusesSignal = signal<Status[]>([]);

  constructor() {
    this.loadStatuses();
  }

  refreshStatuses(): void {
    this.loadStatuses();
  }

  private loadStatuses(): void {
    this.statusesSignal.set(this.getStatuses());
  }

  private getStatuses(): Status[] {
    return this.dataMockService.getStatuses();
  }
}
