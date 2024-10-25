import { Injectable, inject, signal } from '@angular/core';
import { backendMockService, Status } from '../backend-mock.service';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private readonly backendMockService = inject(backendMockService);

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
    return this.backendMockService.getStatuses();
  }
}
