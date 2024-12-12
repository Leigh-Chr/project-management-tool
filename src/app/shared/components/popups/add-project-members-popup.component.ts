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

const CURRENT_USER_ID = 1; // This is a mock value for the current user ID.
@Component({
  selector: 'add-project-member-popup',
  imports: [ReactiveFormsModule, SelectFieldComponent, PopupComponent],
  template: `
    @if (project) {
    <ui-popup
      title="Add Project Member - {{ project.name }}"
      [isSubmitDisabled]="memberForm.invalid"
      submitLabel="Add Member"
      (onSubmit)="addMember()"
      (onClose)="close()"
    >
      <form [formGroup]="memberForm" novalidate>
        <ui-select-field
          [options]="userOptions"
          [control]="userControl"
          id="user"
          label="User"
          errorMessage="Please select a user."
        />
        <ui-select-field
          [options]="roleOptions"
          [control]="roleControl"
          id="role"
          label="Role"
          errorMessage="Please select a role."
        />
      </form>
    </ui-popup>
    } @else {
    <ui-popup title="Add Project Member" [isSubmitDisabled]="true">
      <p>Loading...</p>
    </ui-popup>
    }
  `,
})
export class AddProjectMemberPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

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
          title: 'Project not found.',
          message:
            'The project you are trying to add a member to does not exist.',
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
      .filter(({ user }) => user.id !== CURRENT_USER_ID)
      .map(({ user }) => ({
        value: user,
        label: user.username,
      }));

    if (this.userOptions.length === 0) {
      this.toastService.showToast(
        {
          title: 'No users available to add.',
          message: 'All users are already members of this project.',
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
          message: 'No roles available to add.',
          type: 'error',
          title: 'No Roles',
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
