import { inject, Injectable } from '@angular/core';
import { UserController } from '../mock/backend/user.controller';
import { GetUserResponse } from '../../models/GetUserResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userController = inject(UserController);

  async getUsers(): Promise<GetUserResponse[]> {
    return this.userController.getUsers();
  }

  async getUser(userId: number): Promise<GetUserResponse | null> {
    return this.userController.getUser(userId);
  }
}
