import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models/auth.models';
import { UserEntity } from '../models/entities';
import { ApiService } from './api.service';
import { lastValueFrom } from 'rxjs';

type AuthUser = Omit<UserEntity, 'password'> & { exp: number; token: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  readonly authUser = signal<AuthUser | null>(null);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  constructor() {
    this.loadUserFromCookies();
    this.checkTokenExpiration();
  }

  async register(
    registerRequest: RegisterRequest
  ): Promise<RegisterResponse | null> {
    try {
      const response = await lastValueFrom(
        this.apiService.post<RegisterResponse>('/auth/register', registerRequest)
      );
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      return null;
    }
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse | null> {
    try {
      const loginResponse = await lastValueFrom(
        this.apiService.post<LoginResponse>('/auth/login', loginRequest)
      );
      
      if (!loginResponse) {
        return null;
      }
      
      this.authUser.set(loginResponse);
      this.setUserInCookies(loginResponse);
      this.setTokenExpirationTimeout(loginResponse.exp);
      
      return loginResponse;
    } catch (error) {
      console.error('Error during login:', error);
      return null;
    }
  }

  logout(): void {
    this.apiService.post('/auth/logout', {}).subscribe({
      next: () => {
        this.authUser.set(null);
        this.removeUserFromCookies();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // On effectue tout de même la déconnexion côté client
        this.authUser.set(null);
        this.removeUserFromCookies();
        this.router.navigate(['/login']);
      }
    });
  }

  private setUserInCookies(loginResponse: AuthUser): void {
    this.cookieService.set('user', JSON.stringify(loginResponse));
    this.setTokenExpirationTimeout(loginResponse.exp);
  }

  private loadUserFromCookies(): void {
    const user = this.cookieService.get('user');
    if (!user) {return;}
    const parsedUser = JSON.parse(user);
    this.authUser.set(parsedUser);
    this.setTokenExpirationTimeout(parsedUser.exp);
  }

  private removeUserFromCookies(): void {
    this.cookieService.delete('user');
  }

  private setTokenExpirationTimeout(expiration: number): void {
    const expiresIn = expiration * 1000 - Date.now();
    if (expiresIn > 0) {setTimeout(() => this.logout(), expiresIn);}
    else {this.logout();}
  }

  private checkTokenExpiration(): void {
    const user = this.authUser();
    if (user?.exp) {this.setTokenExpirationTimeout(user.exp);}
  }
}
