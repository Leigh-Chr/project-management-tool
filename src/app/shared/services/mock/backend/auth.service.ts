import { inject, Injectable } from '@angular/core';
import { AuthService as AuthServiceFront } from '../../auth.service';
import { DatabaseMockService } from '../database/database.service';
import type { RoleEntity } from '@app/shared/models/entities';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly database = inject(DatabaseMockService);
  private readonly authServiceFront = inject(AuthServiceFront);

  getRole(projectId: number): RoleEntity['name'] | undefined {
    const authUser = this.authServiceFront.authUser();
    if (!authUser) return undefined;

    const project = this.database.projects.find((p) => p.id === projectId);
    if (!project) return undefined;

    const projectMember = this.database.projectMembers.find(
      (pm) => pm.projectId === projectId && pm.userId === authUser.id
    );
    if (!projectMember) return undefined;

    const role = this.database.roles.find((r) => r.id === projectMember.roleId);
    if (!role) return undefined;

    return role.name;
  }

  getUserId(): number | undefined {
    const authUser = this.authServiceFront.authUser();
    if (!authUser) return undefined;
    return authUser.id;
  }
}
