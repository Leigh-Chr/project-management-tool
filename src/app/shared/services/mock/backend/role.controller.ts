import { Injectable, inject } from '@angular/core';
import { DatabaseMockService } from '../database/database.service';
import { RoleEntity } from '../database/entities';
import { GetRoleResponse } from '../../../models/GetRoleResponse';

@Injectable({ providedIn: 'root' })
export class RoleController {
  private readonly database = inject(DatabaseMockService);

  async getRoles(): Promise<GetRoleResponse[]> {
    const roleEntities: RoleEntity[] = this.database.roles;
    return roleEntities.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  async getRole(roleId: number): Promise<GetRoleResponse | null> {
    const roleEntity = this.database.roles.find((role) => role.id === roleId);
    if (!roleEntity) return null;
    return {
      id: roleEntity.id,
      name: roleEntity.name,
    };
  }
}
