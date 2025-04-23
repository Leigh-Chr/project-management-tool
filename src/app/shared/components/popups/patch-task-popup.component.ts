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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { TaskService } from '../../services/data/task.service';
import { ProjectService } from '../../services/data/project.service';
import { ToastService } from '../toast/toast.service';
import { InputFieldComponent } from '../ui/input-field.component';
import { PopupComponent } from '../ui/popup.component';
import { SelectFieldComponent } from '../ui/select-field.component';
import { StatusService } from '@app/shared/services/data/status.service';
import type { Task } from '../../models/task.models';
import type { GetProjectDetailsResponse } from '../../models/project.models';
import type { GetStatusesResponse } from '../../models/status.models';

@Component({
  selector: 'pmt-patch-task-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PopupComponent,
    SelectFieldComponent,
  ],
  template: `
    <ui-popup
      popupTitle="Edit Task"
      [isSubmitDisabled]="taskForm.invalid"
      submitLabel="Save"
      cancelLabel="Cancel"
      (onSubmit)="submit()"
      (onClose)="this.onClose.emit()"
      id="patch-task-popup"
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
          [options]="projectMemberOptions()"
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
export class PatchTaskPopupComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly toastService = inject(ToastService);
  private readonly statusService = inject(StatusService);

  readonly taskForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    dueDate: new FormControl<string>(''),
    priority: new FormControl<number | undefined>(undefined),
    assigneeId: new FormControl<number | undefined>(undefined),
    statusId: new FormControl<number>(1),
  });

  readonly name = this.taskForm.get('name') as FormControl<string>;
  readonly description = this.taskForm.get(
    'description'
  ) as FormControl<string>;
  readonly dueDate = this.taskForm.get('dueDate') as FormControl<string>;
  readonly priority = this.taskForm.get('priority') as FormControl<number>;
  readonly assigneeId = this.taskForm.get('assigneeId') as FormControl<number>;
  readonly statusId = this.taskForm.get('statusId') as FormControl<number>;

  task = input.required<Task>();
  onClose = output<void>();

  projectMemberOptions = signal<Array<{ value: number; label: string }>>([]);
  project = signal<GetProjectDetailsResponse | undefined>(
    undefined
  ).asReadonly();
  statuses = signal<GetStatusesResponse | undefined>(undefined).asReadonly();

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
      const task = this.task();
      if (!task) {return;}

      const project = this.project();
      if (project) {
        this.projectMemberOptions.set(
          project.projectMembers.map((member) => ({
            value: member.id,
            label: member.username,
          }))
        );
      }

      this.name.setValue(task.name);
      this.description.setValue(task.description ?? '');
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.dueDate.setValue(`${year}-${month}-${day}`);
      }
      this.priority.setValue(task.priority ?? 0);
      if (task.assignee?.id) {
        this.assigneeId.setValue(task.assignee.id);
      }

      const statuses = this.statuses();
      if (statuses) {
        const status = statuses.find((s) => s.name === task.status);
        if (status) {
          this.statusId.setValue(status.id);
        }
      }
    });

    effect(() => {
      const patchedTask = this.taskService.patchedTask();
      if (!patchedTask) {return;}
      this.onClose.emit();
    });
  }

  async ngOnInit(): Promise<void> {
    const task = this.task();
    if (!task) {return;}

    this.project = toSignal(
      this.projectService.getProjectDetails(task.project.id),
      {
        injector: this.injector,
      }
    );

    this.statuses = toSignal(this.statusService.getStatuses(), {
      injector: this.injector,
    });
  }

  async submit(): Promise<void> {
    if (this.taskForm.invalid) {return;}

    const updatedTask = {
      name: this.name.value,
      description: this.description.value,
      dueDate: this.dueDate.value ? new Date(this.dueDate.value) : undefined,
      priority: this.priority.value,
      assigneeId: +this.assigneeId.value,
      statusId: +this.statusId.value,
    };

    const resSignal = toSignal(this.taskService.patchTask(this.task().id, updatedTask), {
      injector: this.injector,
    });
    if (!resSignal()) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Failed to update task',
        type: 'error',
      });
    }
  }
}
