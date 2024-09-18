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

  refreshProjects(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsSignal.set(this.getProjects());
    this.projectMembersSignal.set(this.getProjectMembers());
  }

  private getProjectMembers(): ProjectMember[] {
    return this.dataMockService.getProjectMembers();
  }

  private getProjects(): Project[] {
    return this.dataMockService.getProjects();
  }

  private addProject(project: Project): void {
    this.dataMockService.addProject(project);
    this.projectsSignal.update((projects) => [...projects, project]);
  }
}
