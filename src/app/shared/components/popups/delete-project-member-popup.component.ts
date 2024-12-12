import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserResponse } from '../../models/UserResponse';
import { ProjectMemberService } from '../../services/data/project-member.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { ProjectMemberResponse } from '../../models/Projects/ProjectMemberResponse';

@Component({
  selector: 'delete-project-member-popup',
  imports: [PopupComponent],
  template: `
    @if (user) {
    <ui-popup
      title="Delete Project Member - {{ user.username }}"
      submitLabel="Delete"
      submitVariant="danger"
      (onSubmit)="deleteMember()"
      (onClose)="close()"
    >
      <p class="mb-4">
        Are you sure you want to delete this project member? This action cannot
        be undone.
      </p>
    </ui-popup>
    } @else {
    <ui-popup title="Delete Project Member" [isSubmitDisabled]="true">
      <p>Loading...</p>
    </ui-popup>
    }
  `,
})
export class DeleteProjectMemberPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectMemberService = inject(ProjectMemberService);
  private readonly userService = inject(UserService);

  @Input({ required: true }) projectMemberIds!: {
    projectId: number;
    userId: number;
  };
  projectMember: ProjectMemberResponse | null = null;
  user: UserResponse | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDeleteMember = new EventEmitter<ProjectMemberResponse | null>();

  async ngOnInit(): Promise<void> {
    this.projectMember = await this.getProjectMember();
    this.user = await this.getUser();
    if (!this.projectMember || !this.user) {
      this.toastService.showToast(
        {
          title: 'Error',
          message: 'Project member not found.',
          duration: 5000,
          type: 'error',
        },
        'root'
      );
      this.close();
    }
  }

  async getProjectMember(): Promise<ProjectMemberResponse | null> {
    return this.projectMemberService.getProjectMember(
      this.projectMemberIds.projectId,
      this.projectMemberIds.userId
    );
  }

  async getUser(): Promise<UserResponse | null> {
    return this.userService.getUser(this.projectMemberIds.userId);
  }

  deleteMember(): void {
    this.projectMemberService.deleteProjectMember(
      this.projectMemberIds.projectId,
      this.projectMemberIds.userId
    );
    this.onDeleteMember.emit(this.projectMember);
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
