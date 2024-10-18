import { inject, Injectable, signal } from '@angular/core';
import { DataMockService, ProjectMember } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly dataMockService = inject(DataMockService);

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
    return this.dataMockService.getProjectMembers();
  }

  addProjectMember(projectId: number, userId: number, roleId: number): void {
    const newProjectMember = this.dataMockService.addProjectMember({
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
    this.dataMockService.deleteProjectMembers(projectId);
    this.projectMembersSignal.update((projectMembers) =>
      projectMembers.filter((pm) => pm.projectId !== projectId)
    );
  }
}
