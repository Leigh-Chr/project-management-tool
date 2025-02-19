import { UserEntity } from "../../services/mock/database/entities";

export interface RegisterResponse {
  id: UserEntity['id'];
  username: UserEntity['username'];
  email: UserEntity['email'];
}