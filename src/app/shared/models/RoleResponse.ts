import { RoleEntity } from "../services/mock/database/entities";

export interface RoleResponse {
  id: RoleEntity['id'];
  name: RoleEntity['name'];
}