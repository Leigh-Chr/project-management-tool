import { inject, Injectable, signal } from '@angular/core';
import { DataMockService, Project } from './data-mock.service';
import { AuthService } from './auth.service';
import { ProjectMemberService } from './project-member.service';
import { RoleService } from './role.service';

export type AddProjectDto = Pick<Project, 'name' | 'description' | 'startDate'>;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly dataMockService = inject(DataMockService);
  private readonly authService = inject(AuthService);
  private readonly projectMemberService = inject(ProjectMemberService);
  private readonly roleService = inject(RoleService);

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

  addProject(project: AddProjectDto): void {
    const user = this.authService.userSignal();
    if (!user) throw new Error('User not found');

    const newProject = this.dataMockService.addProject(project);
    this.projectsSignal.update((projects) => [...projects, newProject]);

    const adminRoleId = this.roleService
      .rolesSignal()
      .find((role) => role.name === 'Admin')?.id;
    if (!adminRoleId) throw new Error('Admin role not found');

    this.projectMemberService.addProjectMember(
      newProject.id,
      user.id,
      adminRoleId
    );
  }
}
