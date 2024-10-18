import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
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
import { SelectFieldComponent } from './ui/select-field.component';
import { PopupComponent } from './ui/popup.component';

@Component({
  selector: 'add-project-member-popup',
  standalone: true,
  imports: [ReactiveFormsModule, SelectFieldComponent, PopupComponent],
  template: `
    <ui-popup
      title="Add Project Member - {{ projectName() }}"
      [isSubmitDisabled]="memberForm.invalid"
      submitLabel="Add Member"
      (submit)="onSubmit()"
      (close)="closePopup()"
    >
      <form [formGroup]="memberForm" novalidate>
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
      </form>
    </ui-popup>
  `,
})
export class AddProjectMemberPopupComponent {
  private readonly projectService = inject(ProjectService);
  private readonly projectMembersService = inject(ProjectMemberService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  @Input() projectId!: number;
  @Output() close = new EventEmitter<void>();

  userOptions = computed(() =>
    this.userService
      .usersSignal()
      .map((user) => ({ value: user.id, label: user.username }))
  );
  roleOptions = computed(() =>
    this.roleService
      .rolesSignal()
      .map((role) => ({ value: role.id, label: role.name }))
  );
  projectName = computed(
    () =>
      this.projectService.projectsSignal().find((p) => p.id === this.projectId)
        ?.name
  );

  private readonly formBuilder = inject(FormBuilder);
  memberForm: FormGroup = this.formBuilder.group({
    user: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  userControl = this.memberForm.get('user') as FormControl<number>;
  roleControl = this.memberForm.get('role') as FormControl<number>;

  onSubmit(): void {
    if (this.memberForm.invalid) return;

    const newMember: ProjectMember = {
      projectId: this.projectId,
      userId: this.userControl.value,
      roleId: this.roleControl.value,
    };

    this.projectMembersService.addProjectMember(
      newMember.projectId,
      newMember.userId,
      newMember.roleId
    );
    this.closePopup();
  }

  closePopup(): void {
    this.memberForm.reset();
    this.close.emit();
  }
}
