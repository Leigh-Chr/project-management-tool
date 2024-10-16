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
import { ButtonComponent } from '../../components/ui/button.component';
import { PaginatorComponent } from '../../components/ui/paginator.component';
import { TableComponent } from '../../components/ui/table.component';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { Project, Status } from '../../services/data-mock.service';
import { ProjectMemberService } from '../../services/project-member.service';
import { ProjectService } from '../../services/project.service';
import { StatusService } from '../../services/status.service';
import { Table } from '../../types';

@Component({
  imports: [
    PaginatorComponent,
    ButtonComponent,
    DatePipe,
    AddProjectPopupComponent,
    AddProjectMemberPopupComponent,
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
          <h2 class="font-semibold text-lg">
            <a href="/projects" class="hover:underline">Projects</a>
          </h2>
          <ui-button
            [disabled]="false"
            icon="fi fi-rr-square-plus"
            label="Add Project"
            (click)="showAddProjectPopup()"
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
                  label="View project"
                  [iconOnly]="true"
                  icon="fi fi-rr-arrow-up-from-square"
                  (click)="goToProject(project)"
                />
                <ui-button
                  label="Add members"
                  [iconOnly]="true"
                  icon="fi fi-rr-user-add"
                  (click)="showAddMembersPopup(project.id)"
                />
                <ui-button
                  label="Delete project"
                  [iconOnly]="true"
                  variant="danger"
                  icon="fi fi-rr-trash"
                  (click)="deleteItem(project)"
                />
              </div>
              }
            </ng-template>
          </ui-table>
        </div>
        @if ( isAddProjectPopupVisible() ) {
        <add-project-popup (close)="hideAddProjectPopup()"></add-project-popup>
        } @if ( isAddMemberPopupVisible() ) {
        <add-project-member-popup
          [projectId]="addMemberProjectId()!"
          (close)="hideAddMemberPopup()"
        ></add-project-member-popup>
        }
      </div>
      {{ projectMembers() | json }}
    </default-layout>
  `,
})
export class ProjectsComponent {
  readonly projectService = inject(ProjectService);
  readonly projectMembersService = inject(ProjectMemberService);
  readonly statusService = inject(StatusService);
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

  readonly addMemberProjectId = signal<null | number>(null);
  readonly isAddMemberPopupVisible = computed(
    () => this.addMemberProjectId() !== null
  );
  readonly isAddProjectPopupVisible = signal(false);

  showAddProjectPopup(): void {
    this.isAddProjectPopupVisible.set(true);
  }

  hideAddProjectPopup(): void {
    this.isAddProjectPopupVisible.set(false);
  }

  showAddMembersPopup(projectId: number): void {
    this.addMemberProjectId.set(projectId);
  }

  hideAddMemberPopup(): void {
    this.addMemberProjectId.set(null);
  }

  deleteItem(item: Project): void {
    console.log('Delete project', item);
  }

  goToProject(item: Project): void {
    console.log('View project details', item);
  }

  onPageChange(page: number) {
    console.log(page);
  }

  toProject(project: unknown): Project {
    return project as Project;
  }
}
