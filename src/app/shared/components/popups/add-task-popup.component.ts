import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { TaskService } from '../../services/data/task.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { InputFieldComponent } from '../ui/input-field.component';
import { PopupComponent } from '../ui/popup.component';
import {
  SelectFieldComponent,
  type SelectOption,
} from '../ui/select-field.component';
import { StatusService } from '@app/shared/services/data/status.service';

@Component({
  selector: 'pmt-add-task-popup',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PopupComponent,
    SelectFieldComponent,
  ],
  template: `
    <ui-popup
      popupTitle="Add Task"
      [isSubmitDisabled]="taskForm.invalid"
      submitLabel="Submit"
      cancelLabel="Cancel"
      (onSubmit)="submit()"
      (onClose)="this.onClose.emit()"
      id="add-task-popup"
    >
      <form
        [formGroup]="taskForm"
        novalidate
        (keydown.enter)="$event.preventDefault(); submit()"
      >
        <ui-input-field
          [control]="name"
          label="Name"
          type="text"
          [errorMessage]="'Name is required'"
          [required]="true"
        />
        <ui-input-field
          [control]="description"
          label="Description"
          type="text"
        />
        <ui-input-field [control]="dueDate" label="Due Date" type="date" />
        <ui-input-field [control]="priority" label="Priority" type="number" />
        <ui-select-field
          [control]="assigneeId"
          label="Assignee"
          [options]="userOptions()"
        />
        <ui-select-field
          [control]="statusId"
          label="Status"
          [options]="statusOptions()"
          [errorMessage]="'Status is required'"
        />
      </form>
    </ui-popup>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskPopupComponent {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly statusService = inject(StatusService);

  readonly taskForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    dueDate: new FormControl<Date>(new Date()),
    priority: new FormControl<number | undefined>(undefined),
    assigneeId: new FormControl<number | undefined>(undefined),
    statusId: new FormControl<number>(1),
  });

  readonly name = this.taskForm.get('name') as FormControl<string>;
  readonly description = this.taskForm.get(
    'description'
  ) as FormControl<string>;
  readonly dueDate = this.taskForm.get('dueDate') as FormControl<Date>;
  readonly priority = this.taskForm.get('priority') as FormControl<number>;
  readonly assigneeId = this.taskForm.get('assigneeId') as FormControl<number>;
  readonly statusId = this.taskForm.get('statusId') as FormControl<number>;

  projectId = input.required<number>();
  onClose = output<void>();

  userOptions = signal<SelectOption<number>[]>([]);
  statusOptions = toSignal(
    this.statusService
      .getStatuses()
      .pipe(
        map((statuses) =>
          statuses.map((status) => ({ value: status.id, label: status.name }))
        )
      ),
    {
      initialValue: [],
    }
  );

  constructor() {
    effect(() => {
      const projectId = this.projectId();
      if (projectId) {
        this.taskService
          .getProjectMembers(projectId)
          .pipe(
            map((members) =>
              members.map((member) => ({
                value: member.id,
                label: member.username,
              }))
            )
          )
          .subscribe((options) => {
            this.userOptions.set(options);
          });
      }
    });

    effect(() => {
      const postedTask = this.taskService.postedTask();
      if (!postedTask) {
        return;
      }
      this.onClose.emit();
    });
  }

  async submit(): Promise<void> {
    if (this.taskForm.invalid) {
      return;
    }

    const newTask = {
      name: this.name.value,
      description: this.description.value,
      dueDate: new Date(this.dueDate.value),
      priority: this.priority.value,
      assigneeId: +this.assigneeId.value,
      projectId: this.projectId(),
      statusId: +this.statusId.value,
    };

    const res = this.taskService.addTask(newTask);
    if (!res) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Failed to add task',
        type: 'error',
      });
    }
  }
}
