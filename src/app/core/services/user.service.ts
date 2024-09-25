import { Injectable, inject, signal } from '@angular/core';
import { DataMockService, User } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly dataMockService = inject(DataMockService);

  readonly usersSignal = signal<Omit<User, 'password'>[]>([]);

  constructor() {
    this.loadUsers();
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersSignal.set(this.getUsers());
  }

  private getUsers(): Omit<User, 'password'>[] {
    return this.dataMockService.getUsers();
  }

  private addUser(user: User): void {
    this.dataMockService.addUser(user);
    this.usersSignal.update((users) => [...users, user]);
  }
}
