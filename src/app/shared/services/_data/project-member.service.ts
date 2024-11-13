import { Injectable, inject } from '@angular/core';
import { ProjectMemberControllerService } from '../mock/backend/project-member-controller.service';
import { ProjectMember } from '../../models/ProjectMember';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly projectMemberController = inject(
    ProjectMemberControllerService
  );

  async getProjectMember(
    projectId: number,
    userId: number
  ): Promise<ProjectMember | null> {
    return this.projectMemberController.getProjectMember(projectId, userId);
  }

  async deleteProjectMember(
    projectId: number,
    userId: number
  ): Promise<ProjectMember | null> {
    return this.projectMemberController.deleteProjectMember(projectId, userId);
  }
}
