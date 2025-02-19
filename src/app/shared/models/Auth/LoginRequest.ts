import { UserEntity } from "../../services/mock/database/entities";

export interface LoginRequest {
  email: UserEntity['email'];
  password: UserEntity['password'];
}