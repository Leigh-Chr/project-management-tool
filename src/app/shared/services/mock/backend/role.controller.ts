import { Injectable, inject } from '@angular/core';
import { DatabaseMockService } from '../database/database.service';
import type { RoleEntity } from '../../../models/entities';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleController {
  private readonly database = inject(DatabaseMockService);

  getRoles(): Observable<RoleEntity[]> {
    const roleEntities: RoleEntity[] = this.database.roles;
    return of(roleEntities);
  }

  getRole(roleId: number): Observable<RoleEntity | null> {
    const roleEntity = this.database.roles.find((role) => role.id === roleId);
    return of(roleEntity ?? null);
  }
}
