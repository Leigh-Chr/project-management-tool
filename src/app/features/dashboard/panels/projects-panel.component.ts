import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Project, Status } from '../../../core/services/data-mock.service';
import { ProjectService } from '../../../core/services/project.service';
import { StatusService } from '../../../core/services/status.service';
import { AddProjectPopupComponent } from '../../../shared/add-project-popup.component';
import { Table } from '../../../types';
import { ButtonComponent } from '../../../ui/button.component';
import { PaginatorComponent } from '../../../ui/paginator.component';

@Component({
  selector: 'projects-panel',
  standalone: true,
  imports: [
    PaginatorComponent,
    ButtonComponent,
    DatePipe,
    AddProjectPopupComponent,
  ],
  host: {
    class:
      'border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]',
  },
  template: `
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
        (click)="showPopup()"
      />
    </div>
    <div>
      <table
        class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800"
      >
        <thead class="bg-neutral-50 dark:bg-neutral-950">
          @for (header of table.headers; track header.key) {
          <th
            class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
          >
            {{ header.name }}
          </th>
          }
        </thead>
        <tbody
          class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800"
        >
          @for (project of projects(); track project.id) {
          <tr class="hover:bg-neutral-100 dark:hover:bg-neutral-800">
            @for (column of table.items; track column.key) {
            <td
              class="px-4 py-2 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200 overflow-hidden text-ellipsis max-w-xs"
            >
              @if (project[column.key] === undefined) {-} @else if (column.type
              === 'date') {
              {{ project[column.key] | date : 'mediumDate' }}
              } @else {
              {{ project[column.key] }}
              }
            </td>
            }
          </tr>
          }
        </tbody>
      </table>
    </div>
    <ui-paginator
      [pageSize]="1"
      [totalItems]="0"
      (pageChange)="onPageChange($event)"
    />
    @if (isPopupVisible()) {
    <add-project-popup (close)="hidePopup()"></add-project-popup>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPanelComponent {
  private readonly authService = inject(AuthService);
  readonly projectService = inject(ProjectService);
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
    const currentUserId = this.authService.userSignal()?.id;
    if (!currentUserId) return [];

    const projects = this.projectService.projectsSignal();
    const projectMembers = this.projectService.projectMembersSignal();
    const statuses = this.statusService.statusesSignal();

    return projects
      .filter((project) =>
        projectMembers.some(
          (projectMember) =>
            projectMember.projectId === project.id &&
            projectMember.userId === currentUserId
        )
      )
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

  readonly isPopupVisible = signal(false);

  showPopup(): void {
    this.isPopupVisible.set(true);
  }

  hidePopup(): void {
    this.isPopupVisible.set(false);
  }

  onPageChange(page: number) {
    console.log(page);
  }
}
