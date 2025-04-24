import type { UserEntity } from './entities';

export type User = {
  id: UserEntity['id'];
  username: UserEntity['username'];
  email: UserEntity['email'];
};

export type GetUsersResponse = User[];
