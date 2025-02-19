import { UserEntity } from "../services/mock/database/entities";

export interface UserResponse {
  id: UserEntity['id'];
  username: UserEntity['username'];
  email: UserEntity['email'];
}