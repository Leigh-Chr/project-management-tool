import { inject, Injectable } from '@angular/core';
import { DatabaseMockService } from '../database/database.service';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@app/shared/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthController {
  private readonly database = inject(DatabaseMockService);

  async register(
    registerRequest: RegisterRequest
  ): Promise<RegisterResponse | null> {
    const id = this.database.users.length + 1;

    this.database.users.push({
      id,
      username: registerRequest.username,
      email: registerRequest.email,
      password: registerRequest.password,
    });

    const userEntity = this.database.users.find((user) => user.id === id);
    if (!userEntity) return null;

    return {
      ...userEntity,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      token: await this.hashToken(
        JSON.stringify({
          id: userEntity.id,
          username: userEntity.username,
          email: userEntity.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        })
      ),
    };
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse | null> {
    const userEntity = this.database.users.find(
      (user) =>
        user.email === loginRequest.email &&
        user.password === loginRequest.password
    );

    if (!userEntity) return null;

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

    return {
      ...userEntity,
      exp,
      token: await this.hashToken(
        JSON.stringify({
          id: userEntity.id,
          username: userEntity.username,
          email: userEntity.email,
          exp,
        })
      ),
    };
  }

  private async hashToken(token: string): Promise<string> {
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(token))
      .then((hash) =>
        Array.from(new Uint8Array(hash))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('')
      );
  }
}
