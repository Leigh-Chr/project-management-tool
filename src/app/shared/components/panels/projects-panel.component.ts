import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AddProjectPopupComponent } from '../popups/add-project-popup.component';
import { DeleteProjectPopupComponent } from '../popups/delete-project-popup.component';
import { ButtonComponent } from '../ui/button.component';
import { TableColumn, TableComponent } from '../ui/table.component';
import { ProjectResponse } from '../../models/Projects/ProjectResponse';
import { ProjectSummaryResponse } from '../../models/Projects/ProjectSummaryResponse';
import { ProjectService } from '../../services/data/project.service';

type PopupType = 'addProject' | 'deleteProject';

@Component({
  selector: 'projects-panel',
  imports: [
    ButtonComponent,
    AddProjectPopupComponent,
    DeleteProjectPopupComponent,
    TableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]',
  },
  template: `
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
      <ui-table [columns]="columns" [data]="projects()">
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

    @switch (activePopup()) { @case ('addProject') {
    <add-project-popup
      (onClose)="hidePopup()"
      (onSubmit)="addProject($event)"
    />
    } @case ('deleteProject') {
    <delete-project-popup
      [projectId]="activeProjectId()!"
      (onClose)="hidePopup()"
      (onDeleteProject)="deleteProject($event)"
    />
    } }
  `,
})
export class ProjectsPanelComponent {
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  readonly assignedOnly = input<boolean>(false);

  readonly columns: TableColumn<ProjectSummaryResponse>[] = [
    { name: 'ID', key: 'id', type: 'number' },
    { name: 'Name', key: 'name', type: 'text' },
    { name: 'Description', key: 'description', type: 'text' },
    { name: 'Start Date', key: 'startDate', type: 'date' },
    { name: 'End Date', key: 'endDate', type: 'date' },
    { name: 'Status', key: 'status', type: 'text' },
    { name: 'Members', key: 'memberCount', type: 'number' },
  ];

  readonly projects = signal<ProjectSummaryResponse[]>([]);
  readonly activePopup = signal<PopupType | null>(null);
  readonly activeProjectId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.projects.set(
      await this.projectService.getProjectSummaries(this.assignedOnly())
    );
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

  toProjectSummary(projectSummary: unknown): ProjectSummaryResponse {
    return projectSummary as ProjectSummaryResponse;
  }

  deleteProject(projectId: number): void {
    this.projects.set(
      this.projects().filter((project) => project.id !== projectId)
    );
  }

  async addProject(project: ProjectResponse): Promise<void> {
    const projectSummary = await this.projectService.getProjectSummary(
      project.id
    );
    if (!projectSummary) return;
    this.projects.set([...this.projects(), projectSummary]);
  }
}
