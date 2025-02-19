import { inject, Injectable } from '@angular/core';
import { DatabaseMockService } from '../database/database.service';
import { GetProjectMemberResponse } from '../../../models/Projects/GetProjectMemberResponse';

@Injectable({ providedIn: 'root' })
export class ProjectMemberController {
  private readonly database = inject(DatabaseMockService);

  async getProjectMember(
    projectId: number,
    userId: number
  ): Promise<GetProjectMemberResponse | null> {
    const projectMemberEntity = this.database.projectMembers.find(
      (pm) => pm.projectId === projectId && pm.userId === userId
    );

    if (!projectMemberEntity) return null;

    const projectMember: GetProjectMemberResponse = {
      projectId: projectMemberEntity.projectId,
      userId: projectMemberEntity.userId,
      roleId: projectMemberEntity.roleId,
    };

    return projectMember;
  }

  async deleteProjectMember(
    projectId: number,
    userId: number
  ): Promise<GetProjectMemberResponse | null> {
    const projectMemberEntity = this.database.projectMembers.find(
      (pm) => pm.projectId === projectId && pm.userId === userId
    );

    if (!projectMemberEntity) return null;

    const projectMember: GetProjectMemberResponse = {
      projectId: projectMemberEntity.projectId,
      userId: projectMemberEntity.userId,
      roleId: projectMemberEntity.roleId,
    };

    this.database.projectMembers.splice(
      this.database.projectMembers.indexOf(projectMemberEntity),
      1
    );

    return projectMember;
  }
}
