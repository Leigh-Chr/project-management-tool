import { inject, Injectable, signal } from '@angular/core';
import { DataMockService, Project } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly dataMockService = inject(DataMockService);

  readonly projectsSignal = signal<Project[]>([]);

  constructor() {
    this.loadProjects();
  }

  refreshProjects(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsSignal.set(this.getProjects());
  }

  private getProjects(): Project[] {
    return this.dataMockService.getProjects();
  }

  private addProject(project: Project): void {
    this.dataMockService.addProject(project);
    this.projectsSignal.update((projects) => [...projects, project]);
  }
}
