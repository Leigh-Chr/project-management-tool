import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AddProjectPopupComponent } from '../../shared/components/popups/add-project-popup.component';
import { DeleteProjectPopupComponent } from '../../shared/components/popups/delete-project-popup.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { TableComponent } from '../../shared/components/ui/table.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { ProjectSummary } from '../../shared/models/ProjectSummary';
import { ProjectService } from '../../shared/services/_data/project.service';
import { Table } from '../../types';

type PopupType = 'addProject' | 'deleteProject';
@Component({
  imports: [
    ButtonComponent,
    AddProjectPopupComponent,
    DeleteProjectPopupComponent,
    DefaultLayoutComponent,
    TableComponent,
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
            <ng-template #actionTemplate let-projectSummary>
              @if (toProjectSummary(projectSummary); as projectSummary) {
              <div class="flex gap-2">
                <ui-button
                  label="Go to project"
                  [iconOnly]="true"
                  icon="fi fi-rr-door-open"
                  (click)="goToProject(projectSummary.id)"
                />
                @if (projectSummary.permissions.deleteProject) {
                <ui-button
                  label="Delete project"
                  [iconOnly]="true"
                  variant="danger"
                  icon="fi fi-rr-trash"
                  (click)="showPopup('deleteProject', projectSummary.id)"
                />
                }
              </div>
              }
            </ng-template>
          </ui-table>
        </div>
      </div>
    </default-layout>

    @switch (activePopup()) { @case ('addProject') {
    <add-project-popup (close)="hidePopup()" />
    } @case ('deleteProject') {
    <delete-project-popup
      [projectId]="activeProjectId()!"
      (onClose)="hidePopup()"
      (onDeleteProject)="deleteProject($event)"
    />
    } }
  `,
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  readonly table: Table<ProjectSummary> = {
    headers: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Description', key: 'description' },
      { name: 'Start Date', key: 'startDate' },
      { name: 'End Date', key: 'endDate' },
      { name: 'Status', key: 'status' },
      { name: 'Members', key: 'memberCount' },
    ],
    items: [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'startDate', type: 'date' },
      { key: 'endDate', type: 'date' },
      { key: 'status', type: 'text' },
      { key: 'memberCount', type: 'number' },
    ],
  };

  readonly projects = signal<ProjectSummary[]>([]);
  readonly activePopup = signal<PopupType | null>(null);
  readonly activeProjectId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.projects.set(await this.projectService.getProjectSummaries());
  }

  showPopup(popupType: PopupType, projectId?: number): void {
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

  onPageChange(page: number) {
    console.log(page);
  }

  toProjectSummary(projectSummary: unknown): ProjectSummary {
    return projectSummary as ProjectSummary;
  }

  deleteProject(projectId: number): void {
    this.projects.set(
      this.projects().filter((project) => project.id !== projectId)
    );
  }
}
