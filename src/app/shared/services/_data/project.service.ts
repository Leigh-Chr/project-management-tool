import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectDetails } from '../../models/ProjectDetails';
import { ProjectControllerService } from '../mock/backend/project-controller.service';
import { ProjectSummary } from '../../models/ProjectSummary';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectControllerService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails | null> {
    return this.projectController.getProjectDetails(projectId);
  }

  async getProjects(): Promise<ProjectSummary[]> {
    return this.projectController.getProjects();
  }

  async deleteProject(projectId: number): Promise<Project | null> {
    return this.projectController.deleteProject(projectId);
  }

  async addProject(
    project: Omit<Project, 'id' | 'statusId'>
  ): Promise<Project | null> {
    return this.projectController.addProject(project);
  }
}
