import { Injectable, inject } from '@angular/core';
import { DatabaseMockService } from '../database/database.service';
import { RoleEntity } from '../database/entities';
import { RoleResponse } from '../../../models/RoleResponse';

@Injectable({ providedIn: 'root' })
export class RoleControllerService {
  private readonly database = inject(DatabaseMockService);

  async getRoles(): Promise<RoleResponse[]> {
    const roleEntities: RoleEntity[] = this.database.roles;
    return roleEntities.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }
}
