import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { StatusController } from '../mock/backend/status.controller';
import type { GetStatusesResponse } from '@app/shared/models/status.models';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  readonly statusController = inject(StatusController);

  getStatuses(): Observable<GetStatusesResponse> {
    return this.statusController.getStatuses();
  }
}
