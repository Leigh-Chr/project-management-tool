import { Injectable, inject } from '@angular/core';
import { ProjectMemberController } from '../mock/backend/project-member.controller';
import { ProjectMemberResponse } from '../../models/Projects/ProjectMemberResponse';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly projectMemberController = inject(ProjectMemberController);

  async getProjectMember(
    projectId: number,
    userId: number
  ): Promise<ProjectMemberResponse | null> {
    return this.projectMemberController.getProjectMember(projectId, userId);
  }

  async deleteProjectMember(
    projectId: number,
    userId: number
  ): Promise<ProjectMemberResponse | null> {
    return this.projectMemberController.deleteProjectMember(projectId, userId);
  }
}
