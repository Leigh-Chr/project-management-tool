import { UserEntity } from "../../services/mock/database/entities";

export interface RegisterRequest {
  email: UserEntity['email'];
  password: UserEntity['password'];
  username: UserEntity['username'];
}