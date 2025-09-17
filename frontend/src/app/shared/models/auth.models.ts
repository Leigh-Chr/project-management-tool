import type { UserEntity } from './entities';

export type RegisterRequest = Omit<UserEntity, 'id'>;
export type LoginRequest = Pick<UserEntity, 'email' | 'password'>;

export type AuthUser = Omit<UserEntity, 'password'> & { exp: number };

export type LoginResponse = AuthUser & { token: string };
export type RegisterResponse = AuthUser & { token: string };
