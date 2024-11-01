import { inject, Injectable } from '@angular/core';
import { ProjectDetails } from '../../models/ProjectDetails';
import { ProjectControllerService } from '../mock/backend/project-controller.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projectController = inject(ProjectControllerService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails> {
    return this.projectController.getProjectDetails(projectId);
  }

  async deleteProject(projectId: number): Promise<void> {
    return this.projectController.deleteProject(projectId);
  }
}
