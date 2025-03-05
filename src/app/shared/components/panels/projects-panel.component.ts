import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../ui/button.component';
import { AddProjectPopupComponent } from '../popups/add-project-popup.component';
import { DeleteProjectPopupComponent } from '../popups/delete-project-popup.component';
import { TableComponent } from '../ui/table.component';
import { TranslatorPipe } from '../../i18n/translator.pipe';
import { ProjectService } from '../../services/data/project.service';
import { GetProjectResponse } from '../../models/Projects/GetProjectResponse';
import { TableColumn } from '../ui/table.component';
import { ToastService } from '../../components/toast/toast.service';

type PopupType = 'addProject' | 'deleteProject';

interface ProjectSummary extends GetProjectResponse {
  permissions: {
    deleteProject: boolean;
  };
}

interface DisplayedProject extends ProjectSummary, Record<string, unknown> {
  status: string;
}

@Component({
  selector: 'pmt-projects-panel',
  providers: [TranslatorPipe],
  imports: [
    ButtonComponent,
    AddProjectPopupComponent,
    DeleteProjectPopupComponent,
    TableComponent,
    TranslatorPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'projects-panel',
  },
  template: `
    <div class="projects-panel__header">
      <h2 class="projects-panel__title">{{ 'projects' | translate }}</h2>
      <ui-button
        [disabled]="false"
        icon="fi fi-rr-square-plus"
        [label]="'project.addProject' | translate"
        (click)="showPopup('addProject')"
        [attr.aria-label]="'project.addProject' | translate"
      />
    </div>
    <div class="projects-panel__content">
      <ui-table [columns]="columns" [data]="displayProjects()">
        <ng-template #actionTemplate let-projectSummary>
          @if (toProjectSummary(projectSummary); as projectSummary) {
          <div class="projects-panel__actions">
            <ui-button
              [label]="'project.goToProject' | translate"
              [iconOnly]="true"
              icon="fi fi-rr-door-open"
              (click)="goToProject(projectSummary.id)"
              [attr.aria-label]="getProjectActionLabel('project.goToProject', projectSummary.name)"
            />
            @if (projectSummary.permissions.deleteProject) {
            <ui-button
              [label]="'project.deleteProject' | translate"
              [iconOnly]="true"
              variant="danger"
              icon="fi fi-rr-trash"
              (click)="showPopup('deleteProject', projectSummary.id)"
              [attr.aria-label]="getProjectActionLabel('project.deleteProject', projectSummary.name)"
            />
            }
          </div>
          }
        </ng-template>
      </ui-table>
    </div>

    @switch (activePopup()) { @case ('addProject') {
    <pmt-add-project-popup
      (onClose)="hidePopup()"
      (onSubmit)="addProject($event)"
      id="add-project-popup"
    />
    } @case ('deleteProject') {
    <pmt-delete-project-popup
      [projectId]="activeProjectId()!"
      (onClose)="hidePopup()"
      (onDeleteProject)="deleteProject($event)"
      id="delete-project-popup"
    />
    } }
  `,
  styles: [`
    .projects-panel {
      border: var(--border-width) solid var(--border-color);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .projects-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--surface-2);
      box-shadow: var(--shadow-sm);
      padding: var(--space-4);
    }

    .projects-panel__title {
      font-weight: 600;
      font-size: var(--font-size-lg);
      color: var(--text-color);
    }

    .projects-panel__content {
      padding: var(--space-4);
    }

    .projects-panel__actions {
      display: flex;
      gap: var(--space-2);
    }
  `],
})
export class ProjectsPanelComponent {
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly translator = inject(TranslatorPipe);
  private readonly toastService = inject(ToastService);

  readonly assignedOnly = input<boolean>(false);

  readonly columns: TableColumn<DisplayedProject>[] = [
    {
      name: this.translator.transform('project.id'),
      key: 'id',
      type: 'number',
    },
    {
      name: this.translator.transform('project.name'),
      key: 'name',
      type: 'text',
    },
    {
      name: this.translator.transform('project.description'),
      key: 'description',
      type: 'text',
    },
    {
      name: this.translator.transform('project.startDate'),
      key: 'startDate',
      type: 'date',
    },
    {
      name: this.translator.transform('project.endDate'),
      key: 'endDate',
      type: 'date',
    },
    {
      name: this.translator.transform('project.status'),
      key: 'status',
      type: 'text',
    },
  ];

  readonly projects = signal<ProjectSummary[]>([]);
  readonly displayProjects = computed(() =>
    this.projects().map(this.toProjectSummary)
  );
  readonly activePopup = signal<PopupType | null>(null);
  readonly activeProjectId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    const projectSummaries = await this.projectService.getProjectSummaries(this.assignedOnly());
    this.projects.set(projectSummaries as ProjectSummary[]);
  }

  showPopup(type: PopupType, projectId?: number): void {
    this.activePopup.set(type);
    if (projectId) {
      this.activeProjectId.set(projectId);
    }
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeProjectId.set(null);
  }

  goToProject(id: number): void {
    this.router.navigate(['/projects', id]);
  }

  async addProject(project: GetProjectResponse | null): Promise<void> {
    if (project) {
      const projectSummary = await this.projectService.getProjectSummary(project.id);
      if (projectSummary) {
        this.projects.update((projects) => [...projects, projectSummary as ProjectSummary]);
        this.toastService.showToast(
          {
            type: 'success',
            title: this.translator.transform('project.projectAdded'),
            message: this.translator.transform('project.projectAddedMessage'),
            duration: 3000,
          },
          'root'
        );
      }
    }
    this.hidePopup();
  }

  async deleteProject(projectId: number): Promise<void> {
    this.projects.update((projects) =>
      projects.filter((project) => project.id !== projectId)
    );
    this.toastService.showToast(
      {
        type: 'success',
        title: this.translator.transform('project.projectDeleted'),
        message: this.translator.transform('project.projectDeletedMessage'),
        duration: 3000,
      },
      'root'
    );
    this.hidePopup();
  }

  toProjectSummary(projectSummary: ProjectSummary): DisplayedProject {
    return {
      ...projectSummary,
      status: projectSummary.statusId?.toString() ?? ''
    };
  }

  getProjectActionLabel(key: string, projectName: string): string {
    return `${this.translator.transform(key)} - ${projectName}`;
  }
}
