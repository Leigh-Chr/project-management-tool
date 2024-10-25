import { inject, Injectable, signal } from '@angular/core';
import { backendMockService, ProjectMember } from '../backend-mock.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly backendMockService = inject(backendMockService);

  readonly projectMembersSignal = signal<ProjectMember[]>([]);

  constructor() {
    this.loadProjectMembers();
  }

  refreshProjectMembers(): void {
    this.loadProjectMembers();
  }

  private loadProjectMembers(): void {
    this.projectMembersSignal.set(this.getProjectMembers());
  }

  private getProjectMembers(): ProjectMember[] {
    return this.backendMockService.getProjectMembers();
  }

  addProjectMember(projectId: number, userId: number, roleId: number): void {
    const newProjectMember = this.backendMockService.addProjectMember({
      projectId,
      userId,
      roleId,
    });
    this.projectMembersSignal.update((projectMembers) => [
      ...projectMembers,
      newProjectMember,
    ]);
  }

  deleteProjectMembers(projectId: number): void {
    this.backendMockService.deleteProjectMembers(projectId);
    this.projectMembersSignal.update((projectMembers) =>
      projectMembers.filter((pm) => pm.projectId !== projectId)
    );
  }

  isMember(projectId: number, userId: number): boolean {
    return this.projectMembersSignal().some(
      (pm) => pm.projectId === projectId && pm.userId === userId
    );
  }
}
