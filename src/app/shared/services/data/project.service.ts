import { inject, Injectable } from '@angular/core';
import { GetProjectResponse } from '../../models/Projects/GetProjectResponse';
import { GetProjectDetailsResponse } from '../../models/Projects/GetProjectDetailsResponse';
import { ProjectController } from '../mock/backend/project.controller';
import { GetProjectSummaryResponse } from '../../models/Projects/GetProjectSummaryResponse';
import { GetProjectMemberResponse } from '../../models/Projects/GetProjectMemberResponse';
import { AddProjectRequest } from '../../models/Projects/AddProjectRequest';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectController);

  async getProjectDetails(
    projectId: number
  ): Promise<GetProjectDetailsResponse | null> {
    return this.projectController.getProjectDetails(projectId);
  }

  async getProjectSummaries(
    assignedOnly: boolean = false
  ): Promise<GetProjectSummaryResponse[]> {
    return this.projectController.getProjectSummaries(assignedOnly);
  }

  async getProjectSummary(
    projectId: number
  ): Promise<GetProjectSummaryResponse | null> {
    return this.projectController.getProjectSummary(projectId);
  }

  async getProject(projectId: number): Promise<GetProjectResponse | null> {
    return this.projectController.getProject(projectId);
  }

  async deleteProject(projectId: number): Promise<GetProjectResponse | null> {
    return this.projectController.deleteProject(projectId);
  }

  async addProject(
    project: AddProjectRequest
  ): Promise<GetProjectResponse | null> {
    return this.projectController.addProject(project);
  }

  async addProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Promise<GetProjectMemberResponse | null> {
    return this.projectController.addProjectMember(projectId, userId, roleId);
  }

  async isMember(projectId: number, userId: number): Promise<boolean> {
    return this.projectController.isMember(projectId, userId);
  }

  async isAdmin(projectId: number, userId: number): Promise<boolean> {
    return this.projectController.isAdmin(projectId, userId);
  }
}
