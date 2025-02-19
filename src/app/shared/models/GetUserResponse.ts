import { UserEntity } from "../services/mock/database/entities";

export interface GetUserResponse {
  id: UserEntity['id'];
  username: UserEntity['username'];
  email: UserEntity['email'];
}