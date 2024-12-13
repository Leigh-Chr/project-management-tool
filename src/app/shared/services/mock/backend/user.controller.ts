import { inject, Injectable } from '@angular/core';
import { UserResponse } from '../../../models/UserResponse';
import { DatabaseMockService } from '../database/database.service';

@Injectable({ providedIn: 'root' })
export class UserController {
  private readonly database = inject(DatabaseMockService);

  async getUsers(): Promise<UserResponse[]> {
    const userEntities = this.database.users;
    return userEntities.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
  }

  async getUser(userId: number): Promise<UserResponse | null> {
    const userEntity = this.database.users.find((user) => user.id === userId);

    if (!userEntity) return null;

    const user: UserResponse = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
    };

    return user;
  }
}
