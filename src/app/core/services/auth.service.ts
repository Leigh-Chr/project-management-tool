import { Injectable } from '@angular/core';
import { DataMockService, User } from './data-mock.service';

export type RegisterParams = Pick<User, 'email' | 'password' | 'username'>;
export type RegisterResponse = Omit<User, 'password'>;

export type LoginParams = Pick<User, 'email' | 'password'>;
export type LoginResponse = RegisterResponse | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | null;

  constructor(private dataMockService: DataMockService) {
    this.user = dataMockService.users[0];
  }

  register(registerParams: RegisterParams): RegisterResponse {
    return this.dataMockService.addUser(registerParams);
  }

  login(loginParams: LoginParams): LoginResponse {
    this.user = this.dataMockService.getUser(loginParams) ?? null;
    return this.user;
  }

  logout(): void {
    this.user = null;
  }
}
