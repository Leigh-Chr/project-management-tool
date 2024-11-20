import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectDetails } from '../../models/ProjectDetails';
import { ProjectControllerService } from '../mock/backend/project-controller.service';
import { ProjectSummary } from '../../models/ProjectSummary';
import { ProjectMember } from '../../models/ProjectMember';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectControllerService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails | null> {
    return this.projectController.getProjectDetails(projectId);
  }

  async getProjectSummaries(): Promise<ProjectSummary[]> {
    return this.projectController.getProjectSummaries();
  }

  async getProjectSummary(projectId: number): Promise<ProjectSummary | null> {
    return this.projectController.getProjectSummary(projectId);
  }

  async getProject(projectId: number): Promise<Project | null> {
    return this.projectController.getProject(projectId);
  }

  async deleteProject(projectId: number): Promise<Project | null> {
    return this.projectController.deleteProject(projectId);
  }

  async addProject(
    project: Omit<Project, 'id' | 'statusId'>
  ): Promise<Project> {
    return this.projectController.addProject(project);
  }

  async addProjectMember(
    projectId: number,
    userId: number,
    roleId: number
  ): Promise<ProjectMember> {
    return this.projectController.addProjectMember(projectId, userId, roleId);
  }

  async isMember(projectId: number, userId: number): Promise<boolean> {
    return this.projectController.isMember(projectId, userId);
  }

  async isAdmin(projectId: number, userId: number): Promise<boolean> {
    return this.projectController.isAdmin(projectId, userId);
  }
}
