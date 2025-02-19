import { UserEntity } from "../../services/mock/database/entities";

export interface LoginResponse {
  id: UserEntity['id'];
  username: UserEntity['username'];
  email: UserEntity['email'];
  exp: number;
  token: string;
}