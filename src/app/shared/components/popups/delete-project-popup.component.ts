import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProjectResponse } from '../../models/ProjectResponse';
import { ProjectService } from '../../services/_data/project.service';
import { PopupComponent } from '../ui/popup.component';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'delete-project-popup',
  standalone: true,
  imports: [PopupComponent],
  template: `
    @if (project) {
    <ui-popup
      title="Delete Project - {{ project.name }}"
      submitLabel="Delete"
      submitVariant="danger"
      (onSubmit)="deleteProject()"
      (onClose)="close()"
    >
      <p class="mb-4">
        Are you sure you want to delete this project? This action cannot be
        undone.
      </p>
    </ui-popup>
    } @else {
    <ui-popup title="Delete Project" [isSubmitDisabled]="true">
      <p>Loading...</p>
    </ui-popup>
    }
  `,
})
export class DeleteProjectPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);

  @Input({ required: true }) projectId!: number;
  project: ProjectResponse | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDeleteProject = new EventEmitter<number>();

  async ngOnInit(): Promise<void> {
    this.project = await this.getProjectName();
    if (!this.project) {
      this.toastService.showToast(
        {
          title: 'Error',
          message: 'Project not found.',
          duration: 5000,
          type: 'error',
        },
        'root'
      );
      this.close();
    }
  }

  async getProjectName(): Promise<ProjectResponse | null> {
    return this.projectService.getProject(this.projectId);
  }

  deleteProject(): void {
    this.projectService.deleteProject(this.projectId);
    this.onDeleteProject.emit(this.projectId);
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
