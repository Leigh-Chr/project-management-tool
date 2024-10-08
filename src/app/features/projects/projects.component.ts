import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Project, Status } from '../../core/services/data-mock.service';
import { ProjectService } from '../../core/services/project.service';
import { StatusService } from '../../core/services/status.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { AddProjectPopupComponent } from '../../shared/add-project-popup.component';
import { Table } from '../../types';
import { ButtonComponent } from '../../ui/button.component';
import { PaginatorComponent } from '../../ui/paginator.component';
import { TableComponent } from '../../ui/table.component';
import { TooltipDirective } from '../../ui/tooltip.directive';

@Component({
  imports: [
    PaginatorComponent,
    ButtonComponent,
    DatePipe,
    AddProjectPopupComponent,
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
            (click)="showPopup()"
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
              <div class="flex gap-2">
                <ui-button
                  label="View project"
                  [iconOnly]="true"
                  icon="fi fi-rr-arrow-up-from-square"
                  (click)="goToProject(project)"
                />
                <ui-button
                  label="Delete project"
                  [iconOnly]="true"
                  variant="danger"
                  icon="fi fi-rr-trash"
                  (click)="deleteItem(project)"
                />
              </div>
            </ng-template>
          </ui-table>
        </div>
        @if ( isPopupVisible() ) {
        <add-project-popup (close)="hidePopup()"></add-project-popup>
        }
      </div>
    </default-layout>
  `,
})
export class ProjectsComponent {
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

  readonly isPopupVisible = signal(false);

  showPopup(): void {
    this.isPopupVisible.set(true);
  }

  hidePopup(): void {
    this.isPopupVisible.set(false);
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
}
