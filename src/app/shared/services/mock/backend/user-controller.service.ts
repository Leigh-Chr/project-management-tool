import { inject, Injectable } from '@angular/core';
import { User } from '../../../models/User';
import { DatabaseMockService } from '../database/database.service';

@Injectable({ providedIn: 'root' })
export class UserControllerService {
  private readonly database = inject(DatabaseMockService);

  async getUsers(): Promise<User[]> {
    const userEntities = this.database.users;
    return userEntities.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
  }

  async getUser(userId: number): Promise<User | null> {
    const userEntity = this.database.users.find((user) => user.id === userId);

    if (!userEntity) return null;

    const user: User = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
    };

    return user;
  }
}
