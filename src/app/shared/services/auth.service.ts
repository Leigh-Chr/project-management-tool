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
    this.checkTokenExpiration();
  }

  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return this.authController.register(registerRequest);
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse | null> {
    const loginResponse = await this.authController.login(loginRequest);
    this.authUser.set(loginResponse);

    if (!loginResponse) return null;

    this.setUserInCookies(loginResponse);
    this.setTokenExpirationTimeout(loginResponse.exp);
    return loginResponse;
  }

  logout(): void {
    this.authUser.set(null);
    this.removeUserFromCookies();
    this.router.navigate(['/login']);
  }

  private setUserInCookies(loginResponse: LoginResponse): void {
    this.cookieService.set('user', JSON.stringify(loginResponse));
    this.setTokenExpirationTimeout(loginResponse.exp);
  }

  private loadUserFromCookies(): void {
    const user = this.cookieService.get('user');
    if (!user) return;
    const parsedUser = JSON.parse(user);
    this.authUser.set(parsedUser);
    this.setTokenExpirationTimeout(parsedUser.exp);
  }

  private removeUserFromCookies(): void {
    this.cookieService.delete('user');
  }

  private setTokenExpirationTimeout(expiration: number): void {
    const expiresIn = expiration * 1000 - Date.now();
    if (expiresIn > 0) setTimeout(() => this.logout(), expiresIn);
    else this.logout();
  }

  private checkTokenExpiration(): void {
    const user = this.authUser();
    if (user && user.exp) this.setTokenExpirationTimeout(user.exp);
  }
}
