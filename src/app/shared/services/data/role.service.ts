import { Injectable, inject } from '@angular/core';
import { RoleController } from '../mock/backend/role.controller';
import { RoleResponse } from '../../models/RoleResponse';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleController = inject(RoleController);

  async getRoles(): Promise<RoleResponse[]> {
    return this.roleController.getRoles();
  }
}
