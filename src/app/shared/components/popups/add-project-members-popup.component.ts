import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  signal, OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { GetProjectResponse } from '@app/shared/models/project.models';
import { map } from 'rxjs';
import { ProjectService } from '../../services/data/project.service';
import { RoleService } from '../../services/data/role.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { SelectFieldComponent } from '../ui/select-field.component';

@Component({
  selector: 'pmt-add-project-member-popup',
  imports: [ReactiveFormsModule, SelectFieldComponent, PopupComponent],
  template: `
    @if (project(); as project) {
    <ui-popup
      popupTitle="Add Member - {{ project.name }}"
      [isSubmitDisabled]="memberForm.invalid"
      (onSubmit)="addMember()"
      (onClose)="onClose.emit()"
    >
      <form [formGroup]="memberForm" class="form">
        <ui-select-field
          [options]="userOptions()"
          [control]="userControl"
          id="user"
          label="User"
          [errorMessage]="'Select User is required'"
          [required]="true"
        />
        <ui-select-field
          [options]="roleOptions()"
          [control]="roleControl"
          id="role"
          label="Role"
          [errorMessage]="'Select Role is required'"
          [required]="true"
        />
      </form>
    </ui-popup>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectMemberPopupComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  projectId = input.required<number>();
  onClose = output<void>();

  userOptions = toSignal(
    this.userService.getUsers().pipe(
      map((users) =>
        users.map((user) => ({
          value: user.id,
          label: user.username,
        }))
      )
    ),
    {
      initialValue: [],
    }
  );
  roleOptions = toSignal(
    this.roleService.getRoles().pipe(
      map((roles) =>
        roles.map((role) => ({
          value: role.id,
          label: role.name,
        }))
      )
    ),
    {
      initialValue: [],
    }
  );

  project = signal<GetProjectResponse | undefined>(undefined).asReadonly();

  readonly memberForm = this.fb.group({
    user: new FormControl<string | null>(null, Validators.required),
    role: new FormControl<string | null>(null, Validators.required),
  });

  readonly userControl = this.memberForm.get('user') as FormControl<
    string | null
  >;
  readonly roleControl = this.memberForm.get('role') as FormControl<
    string | null
  >;

  constructor() {
    effect(() => {
      if (!this.projectId()) {
        this.toastService.showToast({
          title: 'Error',
          message: 'Project ID is required',
          type: 'error',
        });
        this.onClose.emit();
        return;
      }

      if (this.userOptions()?.length === 0) {
        this.toastService.showToast({
          title: 'Error',
          message: 'No users found',
          type: 'error',
        });
        this.onClose.emit();
        return;
      }

      if (this.roleOptions()?.length === 0) {
        this.toastService.showToast({
          title: 'Error',
          message: 'No roles found',
          type: 'error',
        });

        this.onClose.emit();
        return;
      }
    });

    effect(() => {
      if (!this.projectService.postedProjectMember()) {return;}
      this.toastService.showToast({
        title: 'Success',
        message: 'Member added',
        type: 'success',
      });
      this.projectService.postedProjectMember.set(null);
      this.onClose.emit();
    });
  }

  async ngOnInit(): Promise<void> {
    this.memberForm.reset();
    const projectId = this.projectId();

    if (projectId === undefined) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Project ID is required',
        type: 'error',
      });
      this.onClose.emit();
      return;
    }

    this.project = toSignal(this.projectService.getProject(projectId), {
      injector: this.injector,
    });
  }

  async addMember(): Promise<void> {
    if (this.memberForm.invalid) {return;}
    const projectId = this.projectId();
    if (!projectId) {return;}

    const userId = Number.parseInt(this.userControl.value || '');
    const roleId = Number.parseInt(this.roleControl.value || '');

    if (Number.isNaN(userId) || Number.isNaN(roleId)) {return;}

    this.projectService.postProjectMember(projectId, userId, roleId);
  }
}
