import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserResponse } from '../../models/UserResponse';
import { ProjectMemberService } from '../../services/data/project-member.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { ProjectMemberResponse } from '../../models/Projects/ProjectMemberResponse';
import { TranslatorPipe } from '../../i18n/translator.pipe';

@Component({
  selector: 'pmt-delete-project-member-popup',
  imports: [PopupComponent, TranslatorPipe],
  providers: [TranslatorPipe],
  template: `
    @if (user) {
    <ui-popup
      title="{{ 'project.deleteMemberTitle' | translate }} - {{
        user.username
      }}"
      submitLabel="{{ 'project.deleteMember' | translate }}"
      cancelLabel="{{ 'project.cancel' | translate }}"
      submitVariant="danger"
      (onSubmit)="deleteMember()"
      (onClose)="close()"
    >
      <p class="mb-4">
        {{ 'project.confirmDeleteMember' | translate }}
      </p>
    </ui-popup>
    } @else {
    <ui-popup
      title="{{ 'project.deleteMemberTitle' | translate }}"
      [isSubmitDisabled]="true"
    >
      <p>{{ 'project.loading' | translate }}</p>
    </ui-popup>
    }
  `,
})
export class DeleteProjectMemberPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectMemberService = inject(ProjectMemberService);
  private readonly userService = inject(UserService);
  private readonly translator = inject(TranslatorPipe);

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
          title: this.translator.transform('project.errorTitle'),
          message: this.translator.transform('project.memberNotFoundMessage'),
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
