import { inject, Injectable } from '@angular/core';
import { UserControllerService } from '../mock/backend/user-controller.service';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userController = inject(UserControllerService);

  async getUsers(): Promise<User[]> {
    return this.userController.getUsers();
  }

  async getUser(userId: number): Promise<User | null> {
    return this.userController.getUser(userId);
  }
}
