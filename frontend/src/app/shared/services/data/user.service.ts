import { inject, Injectable } from '@angular/core';
import type { GetUsersResponse } from '../../models/user.models';
import type { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  getUsers(): Observable<GetUsersResponse> {
    return this.apiService.get<GetUsersResponse>('/users');
  }
}
