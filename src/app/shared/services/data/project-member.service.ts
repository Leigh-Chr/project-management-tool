import { Injectable, inject } from '@angular/core';
import { ProjectMemberController } from '../mock/backend/project-member.controller';
import { GetProjectMemberResponse } from '../../models/Projects/GetProjectMemberResponse';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly projectMemberController = inject(ProjectMemberController);

  async getProjectMember(
    projectId: number,
    userId: number
  ): Promise<GetProjectMemberResponse | null> {
    return this.projectMemberController.getProjectMember(projectId, userId);
  }

  async deleteProjectMember(
    projectId: number,
    userId: number
  ): Promise<GetProjectMemberResponse | null> {
    return this.projectMemberController.deleteProjectMember(projectId, userId);
  }
}
