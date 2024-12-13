import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProjectResponse } from '../../models/Projects/ProjectResponse';
import { ProjectService } from '../../services/data/project.service';
import { PopupComponent } from '../ui/popup.component';
import { ToastService } from '../toast/toast.service';
import { TranslatorPipe } from '../../i18n/translator.pipe';

@Component({
  selector: 'pmt-delete-project-popup',
  imports: [PopupComponent, TranslatorPipe],
  providers: [TranslatorPipe],
  template: `
    @if (project) {
    <ui-popup
      title="{{ 'project.deleteProjectTitle' | translate }} - {{
        project.name
      }}"
      submitLabel="{{ 'project.deleteProject' | translate }}"
      cancelLabel="{{ 'project.cancel' | translate }}"
      submitVariant="danger"
      (onSubmit)="deleteProject()"
      (onClose)="close()"
    >
      <p class="mb-4">
        {{ 'project.confirmDeleteProject' | translate }}
      </p>
    </ui-popup>
    } @else {
    <ui-popup
      title="{{ 'project.deleteProjectTitle' | translate }}"
      [isSubmitDisabled]="true"
    >
      <p>{{ 'project.loading' | translate }}</p>
    </ui-popup>
    }
  `,
})
export class DeleteProjectPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly translator = inject(TranslatorPipe);

  @Input({ required: true }) projectId!: number;
  project: ProjectResponse | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDeleteProject = new EventEmitter<number>();

  async ngOnInit(): Promise<void> {
    this.project = await this.getProject();
    if (!this.project) {
      this.toastService.showToast(
        {
          title: this.translator.transform('project.errorTitle'),
          message: this.translator.transform('project.projectNotFoundMessage'),
          duration: 5000,
          type: 'error',
        },
        'root'
      );
      this.close();
    }
  }

  async getProject(): Promise<ProjectResponse | null> {
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
