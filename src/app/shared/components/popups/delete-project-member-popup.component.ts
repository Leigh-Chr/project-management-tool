import {
  Component,
  Injector,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { ProjectMember } from '@app/shared/models/project.models';
import { ProjectService } from '@app/shared/services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';

@Component({
  selector: 'pmt-delete-project-member-popup',
  imports: [PopupComponent],
  template: `
    @if (projectMember(); as projectMember) {
    <ui-popup
      popupTitle="Delete Member - {{ projectMember.user }}"
      (onSubmit)="deleteProjectMember()"
      (onClose)="onClose.emit()"
    >
      <p>
        Are you sure you want to delete this member? This action cannot be
        undone.
      </p>

      <ul class="list">
        <li><b>Name:</b> {{ projectMember.user }}</li>
        <li><b>Role:</b> {{ projectMember.role }}</li>
        <li><b>Project:</b> {{ projectMember.project }}</li>
      </ul>
    </ui-popup>
    } @else {
    <ui-popup
      popupTitle="Delete Member"
      [isSubmitDisabled]="true"
      submitLabel="Submit"
      cancelLabel="Cancel"
    >
      <p
        class="delete-project-member-popup__message"
        role="status"
        aria-live="polite"
      >
        Loading...
      </p>
    </ui-popup>
    }
  `,
})
export class DeleteProjectMemberPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly injector = inject(Injector);

  readonly projectMemberId = input.required<number>();
  projectMember = signal<ProjectMember | undefined>(undefined).asReadonly();

  onClose = output<void>();

  constructor() {
    effect(() => {
      const projectMember = this.projectMember();
      if (!projectMember) {
        this.toastService.showToast({
          title: 'Error',
          message: 'Project member not found',
          type: 'error',
        });
        this.onClose.emit();
        return;
      }
    });

    effect(() => {
      const deleteProjectMember = this.projectService.deletedProjectMember();
      if (!deleteProjectMember) return;

      untracked(() => {
        this.toastService.showToast({
          title: 'Success',
          message: 'Project member deleted',
          type: 'success',
        });
        this.onClose.emit();
      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.projectMember = toSignal(
      this.projectService.getProjectMember(this.projectMemberId()),
      { injector: this.injector }
    );

    if (!this.projectMemberId()) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Project member not found',
        type: 'error',
      });
      this.onClose.emit();
    }
  }

  deleteProjectMember(): void {
    this.projectService.deleteProjectMember(this.projectMemberId());
  }
}
