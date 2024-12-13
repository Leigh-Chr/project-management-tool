import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../../../models/Auth/LoginRequest';
import { RegisterRequest } from '../../../models/Auth/RegisterRequest';
import { DatabaseMockService } from '../database/database.service';
import { RegisterResponse } from '../../../models/Auth/RegisterResponse';
import { LoginResponse } from '../../../models/Auth/LoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthController {
  private readonly database = inject(DatabaseMockService);

  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const id = this.database.users.length + 1;

    this.database.users.push({
      id,
      username: registerRequest.username,
      email: registerRequest.email,
      password: registerRequest.password,
    });

    return {
      id,
      username: registerRequest.username,
      email: registerRequest.email,
    };
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse | null> {
    const userEntity = this.database.users.find(
      (user) =>
        user.email === loginRequest.email &&
        user.password === loginRequest.password
    );

    if (!userEntity) return null;

    const token = JSON.stringify({
      userId: userEntity.id,
      email: userEntity.email,
    });

    return {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      token,
    };
  }
}
