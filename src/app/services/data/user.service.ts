import { Injectable, inject, signal } from '@angular/core';
import { backendMockService, User } from '../backend-mock.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly backendMockService = inject(backendMockService);

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
    return this.backendMockService.getUsers();
  }

  private addUser(user: User): void {
    this.backendMockService.addUser(user);
    this.usersSignal.update((users) => [...users, user]);
  }
}
