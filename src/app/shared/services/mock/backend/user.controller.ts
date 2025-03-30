import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserEntity } from '../../../models/entities';
import { DatabaseMockService } from '../database/database.service';
import type { GetUsersResponse, User } from '@app/shared/models/user.models';

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
