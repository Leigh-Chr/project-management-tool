import { computed, Injectable, signal } from '@angular/core';
import { DataMockService, User } from './data-mock.service';

export type RegisterParams = Pick<User, 'email' | 'password' | 'username'>;
export type RegisterResponse = Omit<User, 'password'>;

export type LoginParams = Pick<User, 'email' | 'password'>;
export type LoginResponse = RegisterResponse | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly userSignal = signal<Omit<User, 'password'> | null>(null);
  readonly isLoggedIn = computed(() => !!this.userSignal());

  constructor(private dataMockService: DataMockService) {
    this.userSignal.set(dataMockService.users[0]);
  }

  register(registerParams: RegisterParams): RegisterResponse {
    return this.dataMockService.addUser(registerParams);
  }

  login(loginParams: LoginParams): LoginResponse {
    this.userSignal.set(this.dataMockService.getUser(loginParams) ?? null);
    return this.userSignal();
  }

  logout(): void {
    this.userSignal.set(null);
  }
}
