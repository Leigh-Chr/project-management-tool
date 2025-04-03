import { Injectable, inject } from '@angular/core';
import type { GetUsersResponse } from '@app/shared/models/user.models';
import { Observable, of } from 'rxjs';
import { DatabaseMockService } from '../database/database.service';

@Injectable({ providedIn: 'root' })
export class UserController {
  private readonly database = inject(DatabaseMockService);

  getUsers(): Observable<GetUsersResponse> {
    const userEntities = this.database.users;
    return of(
      userEntities.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
      }))
    );
  }
}
