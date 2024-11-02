import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectDetails } from '../../models/ProjectDetails';
import { ProjectControllerService } from '../mock/backend/project-controller.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectControllerService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails | null> {
    return this.projectController.getProjectDetails(projectId);
  }

  async deleteProject(projectId: number): Promise<Project | null> {
    return this.projectController.deleteProject(projectId);
  }
}
