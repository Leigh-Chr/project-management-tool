import {
  Component,
  Injector,
  effect,
  inject,
  input,
  output,
  signal,
  untracked, OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { ProjectMember } from '@app/shared/models/project.models';
import { ProjectService } from '@app/shared/services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pmt-delete-project-member-popup',
  imports: [PopupComponent],
  template: `
    @if (projectMember(); as projectMember) {
    <ui-popup
      popupTitle="Delete Member - {{ projectMember.username }}"
      (onSubmit)="deleteProjectMember()"
      (onClose)="onClose.emit()"
    >
      <p>
        Are you sure you want to delete this member? This action cannot be
        undone.
      </p>

      <ul class="list">
        <li><b>Name:</b> {{ projectMember.username }}</li>
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
export class DeleteProjectMemberPopupComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly injector = inject(Injector);
  private readonly activatedRoute = inject(ActivatedRoute);

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
      if (!deleteProjectMember) {return;}

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
    const projectId = this.activatedRoute.snapshot.params['id'];
    this.projectMember = toSignal(
      this.projectService.getProjectMember(this.projectMemberId(), projectId),
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
    const projectId = this.activatedRoute.snapshot.params['id'];
    this.projectService.deleteProjectMember(this.projectMemberId(), projectId);
  }
}
