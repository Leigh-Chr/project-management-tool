import { inject, Injectable } from '@angular/core';
import { ProjectResponse } from '../../models/ProjectResponse';
import { ProjectDetailsResponse } from '../../models/ProjectDetailsResponse';
import { ProjectControllerService } from '../mock/backend/project-controller.service';
import { ProjectSummaryResponse } from '../../models/ProjectSummaryResponse';
import { ProjectMemberResponse } from '../../models/ProjectMemberResponse';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectControllerService);

  async getProjectDetails(
    projectId: number
  ): Promise<ProjectDetailsResponse | null> {
    return this.projectController.getProjectDetails(projectId);
  }

  async getProjectSummaries(): Promise<ProjectSummaryResponse[]> {
    return this.projectController.getProjectSummaries();
  }

  async getProjectSummary(
    projectId: number
  ): Promise<ProjectSummaryResponse | null> {
    return this.projectController.getProjectSummary(projectId);
  }

  async getProject(projectId: number): Promise<ProjectResponse | null> {
    return this.projectController.getProject(projectId);
  }

  async deleteProject(projectId: number): Promise<ProjectResponse | null> {
    return this.projectController.deleteProject(projectId);
  }

  async addProject(
    project: Omit<ProjectResponse, 'id' | 'statusId'>
  ): Promise<ProjectResponse> {
    return this.projectController.addProject(project);
  }

  async addProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Promise<ProjectMemberResponse> {
    return this.projectController.addProjectMember(projectId, userId, roleId);
  }

  async isMember(projectId: number, userId: number): Promise<boolean> {
    return this.projectController.isMember(projectId, userId);
  }

  async isAdmin(projectId: number, userId: number): Promise<boolean> {
    return this.projectController.isAdmin(projectId, userId);
  }
}
