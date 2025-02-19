import { RoleEntity } from "../services/mock/database/entities";

export interface GetRoleResponse {
  id: RoleEntity['id'];
  name: RoleEntity['name'];
}