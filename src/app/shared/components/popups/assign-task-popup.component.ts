import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ProjectService } from '@app/shared/services/data/project.service';
import { RoleService } from '@app/shared/services/data/role.service';
import { TaskService } from '@app/shared/services/data/task.service';
import { UserService } from '@app/shared/services/data/user.service';
import type {
  ProjectMemberEntity,
  TaskEntity,
  UserEntity,
} from '@app/shared/models/entities';
import { PopupComponent } from '../ui/popup.component';
import { ToastService } from '../toast/toast.service';
import {
  SelectFieldComponent,
  type SelectOption,
} from '../ui/select-field.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pmt-assign-task-popup',
  standalone: true,
  template: `
    <ui-popup
      id="assign-task-popup"
      popupTitle="Assign Task"
      submitLabel="Assign"
      cancelLabel="Cancel"
      [isSubmitDisabled]="assignationForm.invalid"
      (onSubmit)="assignTask()"
      (onClose)="close()"
    >
      <form [formGroup]="assignationForm" class="form">
        <ui-select-field
          [options]="projectMemberOptions()"
          [control]="projectMemberIdControl()"
          id="projectMemberId"
          label="Project Member"
          errorMessage="Please select a project member"
        />
      </form>
    </ui-popup>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopupComponent, SelectFieldComponent, ReactiveFormsModule],
})
export class AssignTaskPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly projectService = inject(ProjectService);
  private readonly roleService = inject(RoleService);

  assignationForm = new FormGroup({
    projectMemberId: new FormControl<number>(0),
  });

  taskId = input.required<number>();
  task = signal<TaskEntity | null>(null);

  projectMemberId = signal<number | null>(null);
  projectMembers = signal<
    (ProjectMemberEntity & { user: Omit<UserEntity, 'password'> | null })[]
  >([]);

  readonly projectMemberIdControl = computed(
    () => this.assignationForm.get('projectMemberId') as FormControl<number>
  );

  readonly projectMemberOptions = computed<SelectOption<number>[]>(() =>
    this.projectMembers().map((pm) => ({
      value: pm.id,
      label: pm.user?.username ?? 'Unknown',
    }))
  );

  onClose = output<void>();

  constructor() {
    this.taskService.getTasks();
    this.projectService.getProjectMembers();
    this.userService.getUsers();
    this.roleService.getRoles();
  }

  assignTask(): void {
    const projectMemberId = this.projectMemberId();
    if (!projectMemberId) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Please select a project member',
        type: 'error',
      });
      return;
    }
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
