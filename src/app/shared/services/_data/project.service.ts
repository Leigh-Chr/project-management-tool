import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectDetails } from '../../models/ProjectDetails';
import { ProjectControllerService } from '../mock/backend/project-controller.service';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectControllerService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails> {
    const response = await this.projectController.getProjectDetails(projectId);
    if (response instanceof HttpResponse) {
      return response.body as ProjectDetails;
    } else {
      throw new Error('Failed to fetch project details');
    }
  }

  async deleteProject(projectId: number): Promise<Project> {
    const response = await this.projectController.deleteProject(projectId);
    if (response instanceof HttpResponse) {
      return response.body as Project;
    } else {
      throw new Error('Failed to delete project');
    }
  }
}
