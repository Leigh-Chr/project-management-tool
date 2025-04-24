import { inject, Injectable } from '@angular/core';
import { UserController } from '../mock/backend/user.controller';
import type { GetUsersResponse } from '../../models/user.models';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userController = inject(UserController);

  getUsers(): Observable<GetUsersResponse> {
    return this.userController.getUsers();
  }
}
