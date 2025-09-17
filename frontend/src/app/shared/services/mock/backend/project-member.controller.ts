import { inject, Injectable } from '@angular/core';
import type {
  DeleteProjectMemberResponse,
  GetProjectMemberResponse,
  PostProjectMemberResponse,
} from '@app/shared/models/project.models';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import type { ProjectMemberEntity } from '../../../models/entities';
import { DatabaseMockService } from '../database/database.service';
import { AuthService } from './auth.service';
import { RoleUtils } from '../../../utils/role.utils';

@Injectable({ providedIn: 'root' })
export class ProjectMemberController {
  private readonly authService = inject(AuthService);
  private readonly database = inject(DatabaseMockService);

  getProjectMember(
    projectMemberId: number
  ): Observable<GetProjectMemberResponse | undefined> {
    const projectMemberEntity = this.database.projectMembers.find(
      (pm) => pm.id === projectMemberId
    );
    if (!projectMemberEntity) {
      return of(undefined);
    }

    const project = this.database.projects.find(
      (p) => p.id === projectMemberEntity.projectId
    );
    if (!project) {
      return of(undefined);
    }

    const user = this.database.users.find(
      (u) => u.id === projectMemberEntity.userId
    );
    if (!user) {
      return of(undefined);
    }

    const role = this.database.roles.find(
      (r) => r.id === projectMemberEntity.roleId
    );
    if (!role) {
      return of(undefined);
    }

    return of({
      id: projectMemberEntity.id,
      project: project.name,
      username: user.username,
      email: user.email,
      role: role.name,
    });
  }

  getProjectMembers(projectId?: number): Observable<ProjectMemberEntity[]> {
    if (projectId) {
      const myRole = this.authService.getRole(projectId);
      if (!myRole) {
        return of([]);
      }
      return of(this.database.projectMembers.filter(pm => pm.projectId === projectId));
    }
    return of(this.database.projectMembers);
  }

  deleteProjectMember(
    projectMemberId: number
  ): Observable<DeleteProjectMemberResponse | undefined> {
    const projectMemberEntity = this.database.projectMembers.find(
      (pm) => pm.id === projectMemberId
    );
    if (!projectMemberEntity) {
      return of(undefined);
    }

    const { projectId } = projectMemberEntity;
    const myRole = this.authService.getRole(projectId);
    if (!RoleUtils.canManageMembers(myRole)) {
      return of(undefined);
    }

    this.database.projectMembers.splice(
      this.database.projectMembers.indexOf(projectMemberEntity),
      1
    );

    const project = this.database.projects.find(
      (p) => p.id === projectMemberEntity.projectId
    );
    if (!project) {
      return of(undefined);
    }

    const user = this.database.users.find(
      (u) => u.id === projectMemberEntity.userId
    );
    if (!user) {
      return of(undefined);
    }

    const role = this.database.roles.find(
      (r) => r.id === projectMemberEntity.roleId
    );
    if (!role) {
      return of(undefined);
    }

    return of({
      id: projectMemberEntity.id,
      project: project.name,
      username: user.username,
      email: user.email,
      role: role.name,
    });
  }

  postProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Observable<PostProjectMemberResponse | undefined> {
    const myRole = this.authService.getRole(projectId);
    if (!RoleUtils.canManageMembers(myRole)) {
      return of(undefined);
    }

    const project = this.database.projects.find((p) => p.id === projectId);
    if (!project) {
      return of(undefined);
    }

    const user = this.database.users.find((u) => u.id === userId);
    if (!user) {
      return of(undefined);
    }

    const role = this.database.roles.find((r) => r.id === roleId);
    if (!role) {
      return of(undefined);
    }

    const newIndex = this.database.projectMembers.length + 1;

    this.database.projectMembers.push({
      id: newIndex,
      projectId: project.id,
      userId: user.id,
      roleId: role.id,
    });

    return of({
      id: newIndex,
      project: project.name,
      username: user.username,
      email: user.email,
      role: role.name,
    });
  }
}
