import { inject, Injectable, signal } from '@angular/core';
import { backendMockService, Project } from '../backend-mock.service';
import { AuthService } from '../auth.service';
import { ProjectMemberService } from './project-member.service';
import { RoleService } from './role.service';

export type AddProjectDto = Pick<Project, 'name' | 'description' | 'startDate'>;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly backendMockService = inject(backendMockService);
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
    return this.backendMockService.getProjects();
  }

  addProject(project: AddProjectDto): void {
    const user = this.authService.userSignal();
    if (!user) throw new Error('User not found');

    const newProject = this.backendMockService.addProject(project);
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

  deleteProject(projectId: number): void {
    this.backendMockService.deleteProject(projectId);
    this.projectsSignal.update((projects) =>
      projects.filter((project) => project.id !== projectId)
    );
  }
}
