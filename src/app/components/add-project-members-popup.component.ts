import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectMember } from '../services/data-mock.service';
import { ProjectMemberService } from '../services/project-member.service';
import { ProjectService } from '../services/project.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';
import { ButtonComponent } from './ui/button.component';
import { SelectFieldComponent } from './ui/select-field.component';

@Component({
  selector: 'add-project-member-popup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SelectFieldComponent,
  ],
  host: {
    class:
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center',
  },
  template: `
    <div
      class="rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-lg w-full max-w-md"
    >
      <h3 class="text-lg font-semibold mb-4">
        Add Project Member -
        <span
          class="text-md font-normal text-neutral-500 dark:text-neutral-400"
        >
          {{ projectName() }}
        </span>
      </h3>
      <form (ngSubmit)="onSubmit()" [formGroup]="memberForm" novalidate>
        <ui-select-field
          [options]="userOptions()"
          [control]="userControl"
          id="user"
          label="User"
          errorMessage="Please select a user."
        />
        <ui-select-field
          [options]="roleOptions()"
          [control]="roleControl"
          id="role"
          label="Role"
          errorMessage="Please select a role."
        />
        <div class="flex justify-end mt-4">
          <ui-button
            type="button"
            (click)="closePopup()"
            label="Cancel"
            class="mr-2"
          ></ui-button>
          <ui-button
            type="submit"
            [disabled]="memberForm.invalid"
            label="Add Member"
          ></ui-button>
        </div>
      </form>
    </div>
  `,
})
export class AddProjectMemberPopupComponent {
  private readonly projectService = inject(ProjectService);
  readonly projectId = input.required<number>();
  readonly projectName = computed(
    () =>
      this.projectService
        .projectsSignal()
        .find((p) => p.id === this.projectId())?.name
  );

  private readonly projectMembersService = inject(ProjectMemberService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  @Output() close = new EventEmitter<void>();

  users = computed(() => this.userService.usersSignal());
  userOptions = computed(() =>
    this.users().map((user) => ({
      value: user.id,
      label: user.username,
    }))
  );

  roles = computed(() => this.roleService.rolesSignal());
  roleOptions = computed(() =>
    this.roles().map((role) => ({
      value: role.id,
      label: role.name,
    }))
  );

  private readonly formBuilder = inject(FormBuilder);

  memberForm: FormGroup = this.formBuilder.group({
    user: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  userControl = this.memberForm.get('user') as FormControl<number>;
  roleControl = this.memberForm.get('role') as FormControl<number>;

  closePopup(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.memberForm.valid) return;

    const selectedUser = this.userControl.value;
    const selectedRole = this.roleControl.value;

    const newMember: ProjectMember = {
      projectId: this.projectId(),
      userId: selectedUser,
      roleId: selectedRole,
    };

    this.projectMembersService.addProjectMember(
      newMember.projectId,
      newMember.userId,
      newMember.roleId
    );

    this.closePopup();
  }
}
