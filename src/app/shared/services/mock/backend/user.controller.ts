import { inject, Injectable } from '@angular/core';
import { GetUserResponse } from '../../../models/GetUserResponse';
import { DatabaseMockService } from '../database/database.service';

@Injectable({ providedIn: 'root' })
export class UserController {
  private readonly database = inject(DatabaseMockService);

  async getUsers(): Promise<GetUserResponse[]> {
    const userEntities = this.database.users;
    return userEntities.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
  }

  async getUser(userId: number): Promise<GetUserResponse | null> {
    const userEntity = this.database.users.find((user) => user.id === userId);

    if (!userEntity) return null;

    const user: GetUserResponse = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
    };

    return user;
  }
}
