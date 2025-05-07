import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { GetStatusesResponse } from '@app/shared/models/status.models';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private readonly apiService = inject(ApiService);

  getStatuses(): Observable<GetStatusesResponse> {
    return this.apiService.get<GetStatusesResponse>('/statuses');
  }
}
