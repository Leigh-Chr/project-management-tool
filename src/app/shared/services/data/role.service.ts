import { Injectable, inject } from '@angular/core';
import { RoleController } from '../mock/backend/role.controller';
import { GetRoleResponse } from '../../models/GetRoleResponse';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleController = inject(RoleController);

  async getRoles(): Promise<GetRoleResponse[]> {
    return this.roleController.getRoles();
  }

  async getRole(roleId: number): Promise<GetRoleResponse | null> {
    return this.roleController.getRole(roleId);
  }
}
