import { inject, Injectable, signal } from '@angular/core';
import { AuthController } from './mock/backend/auth.controller';
import { RegisterRequest } from '../models/Auth/RegisterRequest';
import { RegisterResponse } from '../models/Auth/RegisterResponse';
import { LoginRequest } from '../models/Auth/LoginRequest';
import { LoginResponse } from '../models/Auth/LoginResponse';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly authController = inject(AuthController);
  readonly authUser = signal<LoginResponse | null>(null);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  constructor() {
    this.loadUserFromCookies();
  }

  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return this.authController.register(registerRequest);
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse | null> {
    const loginResponse = await this.authController.login(loginRequest);
    this.authUser.set(loginResponse);

    if (!loginResponse) return null;

    this.setUserInCookies(loginResponse);
    return loginResponse;
  }

  logout(): void {
    this.authUser.set(null);
    this.removeUserFromCookies();
    this.router.navigate(['/login']);
  }

  private setUserInCookies(loginResponse: LoginResponse): void {
    this.cookieService.set('user', JSON.stringify(loginResponse));
  }

  private loadUserFromCookies(): void {
    const user = this.cookieService.get('user');
    if (!user) return;
    this.authUser.set(JSON.parse(user));
  }

  private removeUserFromCookies(): void {
    this.cookieService.delete('user');
  }
}
