import { Injectable, inject } from '@angular/core';
import type { GetStatusesResponse } from '@app/shared/models/status.models';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { DatabaseMockService } from '../database/database.service';

@Injectable({
  providedIn: 'root',
})
export class StatusController {
  private readonly database = inject(DatabaseMockService);

  getStatuses(): Observable<GetStatusesResponse> {
    return of(this.database.statuses);
  }
}
