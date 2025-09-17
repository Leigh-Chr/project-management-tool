import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  untracked,
  OnInit,
} from '@angular/core';
import type { Project } from '@app/shared/models/project.models';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pmt-delete-project-popup',
  imports: [PopupComponent],
  template: `
    @if (project(); as project) {
    <ui-popup
      popupTitle="Delete Project - {{ project.name }}"
      submitLabel="Submit"
      cancelLabel="Cancel"
      (onSubmit)="deleteProject()"
      (onClose)="onClose.emit()"
    >
      <p>
        Are you sure you want to delete this project? It will delete all the
        tasks and project members associated with it. This action cannot be
        undone.
      </p>

      <ul class="list">
        <li><b>Name:</b> {{ project.name }}</li>
        <li>
          <b>Description:</b> {{ project.description || 'No description' }}
        </li>
        <li>
          <b>Start Date:</b>
          {{ project.startDate?.toLocaleDateString() || 'No start date' }}
        </li>
        <li><b>Status:</b> {{ project.status }}</li>
        <li><b>My Role:</b> {{ project.myRole || 'No role' }}</li>
      </ul>
    </ui-popup>
    } @else {
    <ui-popup
      popupTitle="Delete Project"
      [isSubmitDisabled]="true"
      submitLabel="Submit"
      cancelLabel="Cancel"
    >
      <p>Loading...</p>
    </ui-popup>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProjectPopupComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);

  projectId = input.required<number>();
  project = signal<Project | undefined>(undefined).asReadonly();

  onClose = output<void>();

  constructor() {
    effect(() => {
      const deletedProject = this.projectService.deletedProject();
      if (!deletedProject) {
        return;
      }
      untracked(() => {
        this.toastService.showToast({
          title: 'Success',
          message: 'Project deleted',
          type: 'success',
        });
        this.onClose.emit();
      });
    });
  }


  async ngOnInit(): Promise<void> {
    this.project = toSignal(this.projectService.getProject(this.projectId()), {
      injector: this.injector,
    });

    const project = this.project();
    if (!project) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Project not found',
        type: 'error',
      });
      this.onClose.emit();
    }

    if (project?.myRole !== 'Admin') {
      this.toastService.showToast({
        title: 'Error',
        message: 'You are not authorized to delete this project',
        type: 'error',
      });
      this.onClose.emit();
    }
  }

  deleteProject(): void {
    const projectId = this.projectId();
    
    // Appel au service et fermeture immédiate du popup
    this.projectService.deleteProject(projectId).subscribe({
      next: (_result) => {
        // Fermer le popup immédiatement - l'UI sera mise à jour par les effects des composants parents
        this.onClose.emit();
      },
      error: (_error) => {
        this.toastService.showToast({
          title: 'Error',
          message: 'Failed to delete project',
          type: 'error',
        });
      }
    });
  }
}
