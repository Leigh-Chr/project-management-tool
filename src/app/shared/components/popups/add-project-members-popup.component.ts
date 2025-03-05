import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatorPipe } from '../../i18n/translator.pipe';
import { GetProjectMemberResponse } from '../../models/Projects/GetProjectMemberResponse';
import { GetProjectResponse } from '../../models/Projects/GetProjectResponse';
import { GetRoleResponse } from '../../models/GetRoleResponse';
import { GetUserResponse } from '../../models/GetUserResponse';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/data/project.service';
import { RoleService } from '../../services/data/role.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import {
  SelectFieldComponent,
  SelectOption,
} from '../ui/select-field.component';

@Component({
  selector: 'pmt-add-project-member-popup',
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
      id="add-project-member-popup"
    >
      <form 
        [formGroup]="memberForm" 
        class="add-project-members-popup__form" 
        novalidate
        (keydown.enter)="$event.preventDefault(); addMember()"
        aria-labelledby="add-member-title"
      >
        <h3 id="add-member-title" class="visually-hidden">
          {{ 'project.addMemberTitle' | translate }} - {{ project.name }}
        </h3>
        <ui-select-field
          [options]="userOptions"
          [control]="userControl"
          id="user"
          [label]="'project.user' | translate"
          [errorMessage]="'project.selectUserError' | translate"
          [required]="true"
          aria-required="true"
          [attr.aria-invalid]="userControl.invalid && userControl.touched"
          [attr.aria-describedby]="userControl.invalid && userControl.touched ? 'user-error' : null"
        />
        <ui-select-field
          [options]="roleOptions"
          [control]="roleControl"
          id="role"
          [label]="'project.role' | translate"
          [errorMessage]="'project.selectRoleError' | translate"
          [required]="true"
          aria-required="true"
          [attr.aria-invalid]="roleControl.invalid && roleControl.touched"
          [attr.aria-describedby]="roleControl.invalid && roleControl.touched ? 'role-error' : null"
        />
      </form>
    </ui-popup>
    } @else {
    <ui-popup
      [title]="'project.addMember' | translate"
      [isSubmitDisabled]="true"
      id="add-project-member-popup-loading"
    >
      <p 
        class="add-project-members-popup__loading"
        role="status"
        aria-live="polite"
      >
        {{ 'project.loading' | translate }}
      </p>
    </ui-popup>
    }
  `,
  styles: [`
    .add-project-members-popup__form {
      display: grid;
      gap: var(--space-4);
      padding: var(--space-4);
    }

    .add-project-members-popup__loading {
      color: var(--text-color);
      font-size: var(--font-size-base);
      text-align: center;
      padding: var(--space-4);
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `],
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
  @Output() onAddMember = new EventEmitter<GetProjectMemberResponse | null>();

  userOptions: SelectOption<number>[] = [];
  roleOptions: SelectOption<number>[] = [];

  project: GetProjectResponse | null = null;

  private readonly formBuilder = inject(FormBuilder);
  memberForm: FormGroup = this.formBuilder.group({
    user: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  userControl = this.memberForm.get('user') as FormControl<GetUserResponse>;
  roleControl = this.memberForm.get('role') as FormControl<GetRoleResponse>;

  async ngOnInit(): Promise<void> {
    try {
      this.project = await this.projectService.getProject(this.projectId);
      const [users, roles] = await Promise.all([
        this.userService.getUsers(),
        this.roleService.getRoles(),
      ]);

      this.userOptions = users.map((user) => ({
        value: user.id,
        label: user.username,
      }));

      this.roleOptions = roles.map((role) => ({
        value: role.id,
        label: role.name,
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      this.toastService.showToast(
        {
          type: 'error',
          title: this.translator.transform('project.error'),
          message: this.translator.transform('project.loadError'),
          duration: 3000,
        },
        'root'
      );
    }
  }

  async addMember(): Promise<void> {
    if (this.memberForm.invalid) return;

    try {
      const member = await this.projectService.addProjectMember(
        this.projectId,
        this.userControl.value.id,
        this.roleControl.value.id
      );
      this.onAddMember.emit(member || null);
      this.close();
    } catch (error) {
      console.error('Error adding member:', error);
      this.toastService.showToast(
        {
          type: 'error',
          title: this.translator.transform('project.error'),
          message: this.translator.transform('project.addMemberError'),
          duration: 3000,
        },
        'root'
      );
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
