import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Role } from '../../models/Role';
import { User } from '../../models/User';
import { ProjectService } from '../../services/_data/project.service';
import { RoleService } from '../../services/_data/role.service';
import { UserService } from '../../services/_data/user.service';
import { Project, ProjectMember } from '../../services/backend-mock.service';
import { PopupComponent } from '../ui/popup.component';
import {
  SelectFieldComponent,
  SelectOption,
} from '../ui/select-field.component';

@Component({
  selector: 'add-project-member-popup',
  standalone: true,
  imports: [ReactiveFormsModule, SelectFieldComponent, PopupComponent],
  template: `
    @if (project) {
    <ui-popup
      title="Add Project Member - {{ project.name }}"
      [isSubmitDisabled]="memberForm.invalid"
      submitLabel="Add Member"
      (submit)="onSubmit()"
      (close)="closePopup()"
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
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  @Input() projectId!: number;
  @Output() close = new EventEmitter<void>();

  userOptions: SelectOption<User>[] = [];
  roleOptions: SelectOption<Role>[] = [];

  project: Project | null = null;

  private readonly formBuilder = inject(FormBuilder);
  memberForm: FormGroup = this.formBuilder.group({
    user: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  userControl = this.memberForm.get('user') as FormControl<User>;
  roleControl = this.memberForm.get('role') as FormControl<Role>;

  async ngOnInit(): Promise<void> {
    this.project = await this.projectService.getProject(this.projectId);
    if (!this.project) this.closePopup();
    this.userOptions = (await this.userService.getUsers())
      .filter((user) => !this.projectService.isMember(this.projectId, user.id))
      .map((user) => ({
        value: user,
        label: user.username,
      }));
    if (this.userOptions.length === 0) this.closePopup();
    this.roleOptions = (await this.roleService.getRoles()).map((role) => ({
      value: role,
      label: role.name,
    }));
    if (this.roleOptions.length === 0) this.closePopup();
  }

  onSubmit(): void {
    if (this.memberForm.invalid) return;

    const newMember: ProjectMember = {
      projectId: this.projectId,
      userId: +this.userControl.value.id,
      roleId: +this.roleControl.value,
    };

    this.projectService.addProjectMember(
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
