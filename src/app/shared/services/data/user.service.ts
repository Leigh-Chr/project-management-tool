import { inject, Injectable } from '@angular/core';
import { UserControllerService } from '../mock/backend/user-controller.service';
import { UserResponse } from '../../models/UserResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userController = inject(UserControllerService);

  async getUsers(): Promise<UserResponse[]> {
    return this.userController.getUsers();
  }

  async getUser(userId: number): Promise<UserResponse | null> {
    return this.userController.getUser(userId);
  }
}
