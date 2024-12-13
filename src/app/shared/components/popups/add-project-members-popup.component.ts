import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleResponse } from '../../models/RoleResponse';
import { UserResponse } from '../../models/UserResponse';
import { ProjectService } from '../../services/data/project.service';
import { RoleService } from '../../services/data/role.service';
import { UserService } from '../../services/data/user.service';
import { PopupComponent } from '../ui/popup.component';
import {
  SelectFieldComponent,
  SelectOption,
} from '../ui/select-field.component';
import { ToastService } from '../toast/toast.service';
import { ProjectResponse } from '../../models/Projects/ProjectResponse';
import { ProjectMemberResponse } from '../../models/Projects/ProjectMemberResponse';
import { AuthService } from '../../services/auth.service';
import { TranslatorPipe } from '../../i18n/translator.pipe';

@Component({
  selector: 'add-project-member-popup',
  imports: [
    ReactiveFormsModule,
    SelectFieldComponent,
    PopupComponent,
    TranslatorPipe,
  ],
  providers: [TranslatorPipe],
  template: `
    @if (project) {
    <ui-popup
      title="{{ 'project.addMemberTitle' | translate }} - {{ project.name }}"
      [isSubmitDisabled]="memberForm.invalid"
      [submitLabel]="'project.addMember' | translate"
      [cancelLabel]="'project.cancel' | translate"
      (onSubmit)="addMember()"
      (onClose)="close()"
    >
      <form [formGroup]="memberForm" novalidate>
        <ui-select-field
          [options]="userOptions"
          [control]="userControl"
          id="user"
          [label]="'project.user' | translate"
          [errorMessage]="'project.selectUserError' | translate"
        />
        <ui-select-field
          [options]="roleOptions"
          [control]="roleControl"
          id="role"
          [label]="'project.role' | translate"
          [errorMessage]="'project.selectRoleError' | translate"
        />
      </form>
    </ui-popup>
    } @else {
    <ui-popup
      [title]="'project.addMember' | translate"
      [isSubmitDisabled]="true"
    >
      <p>{{ 'project.loading' | translate }}</p>
    </ui-popup>
    }
  `,
})
export class AddProjectMemberPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly translator = inject(TranslatorPipe);

  @Input() projectId!: number;
  @Output() onClose = new EventEmitter<void>();
  @Output() onAddMember = new EventEmitter<void>();

  userOptions: SelectOption<UserResponse>[] = [];
  roleOptions: SelectOption<RoleResponse>[] = [];

  project: ProjectResponse | null = null;

  private readonly formBuilder = inject(FormBuilder);
  memberForm: FormGroup = this.formBuilder.group({
    user: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  userControl = this.memberForm.get('user') as FormControl<UserResponse>;
  roleControl = this.memberForm.get('role') as FormControl<RoleResponse>;

  async ngOnInit(): Promise<void> {
    this.project = await this.projectService.getProject(this.projectId);
    if (!this.project) {
      this.toastService.showToast(
        {
          title: this.translator.transform('project.notFoundTitle'),
          message: this.translator.transform('project.notFoundMessage'),
          type: 'error',
          duration: 5000,
        },
        'root'
      );
      this.close();
    }

    const users = await this.userService.getUsers();
    const userStatuses = await Promise.all(
      users.map(async (user) => {
        const isNotMember = !(await this.isMember(user.id));
        return { user, isNotMember };
      })
    );
    this.userOptions = userStatuses
      .filter(({ isNotMember }) => isNotMember)
      .filter(({ user }) => user.id !== this.authService.authUser()?.id)
      .map(({ user }) => ({
        value: user,
        label: user.username,
      }));

    if (this.userOptions.length === 0) {
      this.toastService.showToast(
        {
          title: this.translator.transform('project.noUsersTitle'),
          message: this.translator.transform('project.noUsersMessage'),
          type: 'error',
          duration: 5000,
        },
        'root'
      );
      this.close();
    }
    this.roleOptions = (await this.roleService.getRoles()).map((role) => ({
      value: role,
      label: role.name,
    }));
    if (this.roleOptions.length === 0) {
      this.toastService.showToast(
        {
          title: this.translator.transform('project.noRolesTitle'),
          message: this.translator.transform('project.noRolesMessage'),
          type: 'error',
          duration: 5000,
        },
        'root'
      );
      this.close();
    }
  }

  private async isMember(userId: number): Promise<boolean> {
    return this.projectService.isMember(this.projectId, userId);
  }

  addMember(): void {
    if (this.memberForm.invalid) return;

    const newMember: ProjectMemberResponse = {
      projectId: this.projectId,
      userId: +this.userControl.value.id,
      roleId: +this.roleControl.value,
    };

    this.projectService.addProjectMember(
      newMember.projectId,
      newMember.userId,
      newMember.roleId
    );
    this.onAddMember.emit();
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
