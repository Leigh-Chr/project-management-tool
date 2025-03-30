import { Injectable, inject } from '@angular/core';
import { RoleController } from '../mock/backend/role.controller';
import type { RoleEntity } from '../../models/entities';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleController = inject(RoleController);

  getRoles(): Observable<RoleEntity[]> {
    return this.roleController.getRoles();
  }

  getRole(roleId: number): Observable<RoleEntity | null> {
    return this.roleController.getRole(roleId);
  }
}
