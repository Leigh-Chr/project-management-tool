import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GetProjectResponse } from '../../models/Projects/GetProjectResponse';
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
      id="delete-project-popup"
    >
      <p 
        class="delete-project-popup__message"
        role="alert"
        aria-live="polite"
      >
        {{ 'project.confirmDeleteProject' | translate }}
      </p>
    </ui-popup>
    } @else {
    <ui-popup
      title="{{ 'project.deleteProjectTitle' | translate }}"
      [isSubmitDisabled]="true"
      id="delete-project-popup-loading"
    >
      <p 
        class="delete-project-popup__message"
        role="status"
        aria-live="polite"
      >
        {{ 'project.loading' | translate }}
      </p>
    </ui-popup>
    }
  `,
  styles: [`
    .delete-project-popup__message {
      margin-bottom: var(--space-4);
      color: var(--text-color);
      font-size: var(--font-size-base);
    }
  `],
})
export class DeleteProjectPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly translator = inject(TranslatorPipe);

  @Input({ required: true }) projectId!: number;
  project: GetProjectResponse | null = null;

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

  async getProject(): Promise<GetProjectResponse | null> {
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