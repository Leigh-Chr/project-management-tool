import { computed, Injectable, signal } from '@angular/core';
import { backendMockService, User } from './backend-mock.service';

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

  constructor(private backendMockService: backendMockService) {
    this.userSignal.set(backendMockService.users[0]);
  }

  register(registerParams: RegisterParams): RegisterResponse {
    return this.backendMockService.addUser(registerParams);
  }

  login(loginParams: LoginParams): LoginResponse {
    this.userSignal.set(this.backendMockService.getUser(loginParams) ?? null);
    return this.userSignal();
  }

  logout(): void {
    this.userSignal.set(null);
  }
}
