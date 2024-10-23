import { DatePipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AddProjectMemberPopupComponent } from '../../components/add-project-members-popup.component';
import { AddProjectPopupComponent } from '../../components/add-project-popup.component';
import { DeleteProjectPopupComponent } from '../../components/delete-project-popup.component';
import { ButtonComponent } from '../../components/ui/button.component';
import { PaginatorComponent } from '../../components/ui/paginator.component';
import { TableComponent } from '../../components/ui/table.component';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { Project, Status } from '../../services/backend-mock.service';
import { ProjectMemberService } from '../../services/data/project-member.service';
import { ProjectService } from '../../services/data/project.service';
import { StatusService } from '../../services/data/status.service';
import { Table } from '../../types';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [
    PaginatorComponent,
    ButtonComponent,
    DatePipe,
    AddProjectPopupComponent,
    AddProjectMemberPopupComponent,
    DeleteProjectPopupComponent,
    JsonPipe,
    DefaultLayoutComponent,
    TableComponent,
    TooltipDirective,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <default-layout>
      <div
        class="border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]"
      >
        <div
          class="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 shadow-sm p-4"
        >
          <h2 class="font-semibold text-lg">Projects</h2>
          <ui-button
            [disabled]="false"
            icon="fi fi-rr-square-plus"
            label="Add Project"
            (click)="showPopup('addProject')"
          />
        </div>
        <div>
          <ui-table
            [headers]="table.headers"
            [columns]="table.items"
            [data]="projects()"
            [pageSizeOptions]="[1, 2]"
          >
            <ng-template #actionTemplate let-project>
              @if (toProject(project); as project) {
              <div class="flex gap-2">
                <ui-button
                  label="Go to project"
                  [iconOnly]="true"
                  icon="fi fi-rr-door-open"
                  (click)="goToProject(project.id)"
                />
                @if (isAdmin(project.id)) {
                <ui-button
                  label="Add members"
                  [iconOnly]="true"
                  icon="fi fi-rr-user-add"
                  (click)="showPopup('addMembers', project.id)"
                />
                <ui-button
                  label="Delete project"
                  [iconOnly]="true"
                  variant="danger"
                  icon="fi fi-rr-trash"
                  (click)="showPopup('deleteProject', project.id)"
                />
                }
              </div>
              }
            </ng-template>
          </ui-table>
        </div>
      </div>
      {{ projectMembers() | json }}
    </default-layout>

    @switch (activePopup()) { @case ('addProject') {
    <add-project-popup (close)="hidePopup()" />
    } @case ('addMembers') {
    <add-project-member-popup
      [projectId]="activeProjectId()!"
      (close)="hidePopup()"
    />
    } @case ('deleteProject') {
    <delete-project-popup
      [projectId]="activeProjectId()!"
      (close)="hidePopup()"
    />
    } }
  `,
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly projectMembersService = inject(ProjectMemberService);
  private readonly statusService = inject(StatusService);

  readonly table: Table<Project & { status: Status['name'] }> = {
    headers: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Description', key: 'description' },
      { name: 'Start Date', key: 'startDate' },
      { name: 'End Date', key: 'endDate' },
      { name: 'Status', key: 'status' },
    ],
    items: [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'startDate', type: 'date' },
      { key: 'endDate', type: 'date' },
      { key: 'status', type: 'text' },
    ],
  };

  readonly projects = computed<(Project & { status: Status['name'] })[]>(() => {
    const statuses = this.statusService.statusesSignal();
    return this.projectService
      .projectsSignal()
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .map((project) => {
        return {
          ...project,
          status:
            statuses.find((status) => status.id === project.statusId)?.name ??
            statuses[0].name,
        };
      });
  });

  readonly projectMembers = computed(() => {
    return this.projectMembersService.projectMembersSignal();
  });

  readonly activePopup = signal<
    'addProject' | 'addMembers' | 'deleteProject' | null
  >(null);
  readonly activeProjectId = signal<number | null>(null);

  showPopup(
    popupType: 'addProject' | 'addMembers' | 'deleteProject',
    projectId?: number
  ): void {
    this.activePopup.set(popupType);
    if (projectId) this.activeProjectId.set(projectId);
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeProjectId.set(null);
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  isAdmin(projectId: number): boolean {
    const user = this.authService.userSignal();
    if (!user) return false;

    const userMember = this.projectMembersService
      .projectMembersSignal()
      .find((pm) => pm.projectId === projectId && pm.userId === user.id);
    if (!userMember) return false;

    const isAdmin = userMember.roleId === 1;
    return isAdmin;
  }

  onPageChange(page: number) {
    console.log(page);
  }

  toProject(project: unknown): Project {
    return project as Project;
  }
}
