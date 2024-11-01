import { inject, Injectable } from '@angular/core';
import { BackendMockService } from '../mock/backend.service';
import { ProjectDetails } from '../../models/ProjectDetails';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly backend = inject(BackendMockService);

  async getProjectDetails(projectId: number): Promise<ProjectDetails> {
    return this.backend.getProjectDetails(projectId);
  }
}
