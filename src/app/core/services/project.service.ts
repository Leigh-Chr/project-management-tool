import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { DataMockService, Project, ProjectMember } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly dataMockService = inject(DataMockService);
  private readonly authService = inject(AuthService);

  readonly projectsSignal = signal<Project[]>([]);
  readonly projectMembersSignal = signal<ProjectMember[]>([]);

  constructor() {
    this.loadProjects();
  }

  refreshProjects() {
    this.loadProjects();
  }

  private loadProjects() {
    this.projectsSignal.set(this.getProjects());
    this.projectMembersSignal.set(this.getProjectMembers());
  }

  private getProjectMembers(): ProjectMember[] {
    return this.dataMockService.getProjectMembers();
  }

  private getProjects(): Project[] {
    return this.dataMockService.getProjects();
  }
}
