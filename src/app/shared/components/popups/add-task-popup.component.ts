import {
  Component,
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
import { InputFieldComponent } from '../ui/input-field.component';
import { PopupComponent } from '../ui/popup.component';
import { SelectFieldComponent } from '../ui/select-field.component';
import { TranslatorPipe } from '../../i18n/translator.pipe';
import { GetTaskResponse } from '../../models/Tasks/GetTaskResponse';
import { SelectOption } from '../ui/select-field.component';
import { TaskService } from '../../services/data/task.service';
import { UserService } from '../../services/data/user.service';
import { User } from '../../models/Tasks/GetTaskDetailsResponse';

@Component({
  selector: 'pmt-add-task-popup',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PopupComponent,
    SelectFieldComponent,
    TranslatorPipe,
  ],
  providers: [TranslatorPipe],
  template: `
    <ui-popup
      [title]="'task.addTask' | translate"
      [isSubmitDisabled]="taskForm.invalid"
      [submitLabel]="'task.addTask' | translate"
      [cancelLabel]="'task.cancel' | translate"
      (onSubmit)="submit()"
      (onClose)="close()"
      id="add-task-popup"
    >
      <form 
        [formGroup]="taskForm" 
        class="add-task-popup__form" 
        novalidate
        (keydown.enter)="$event.preventDefault(); submit()"
      >
        <ui-input-field
          [control]="name"
          id="name"
          [label]="'task.name' | translate"
          type="text"
          [errorMessage]="'task.nameRequired' | translate"
          [required]="true"
          autocomplete="off"
        />
        <ui-input-field
          [control]="description"
          id="description"
          [label]="'task.description' | translate"
          type="text"
          autocomplete="off"
        />
        <ui-input-field
          [control]="dueDate"
          id="dueDate"
          [label]="'task.dueDate' | translate"
          type="date"
          [errorMessage]="'task.dueDateRequired' | translate"
          [required]="true"
          autocomplete="off"
        />
        <ui-input-field
          [control]="priority"
          id="priority"
          [label]="'task.priority' | translate"
          type="number"
          [errorMessage]="'task.priorityRequired' | translate"
          [required]="true"
          min="1"
          max="5"
          autocomplete="off"
        />
        <ui-select-field
          [control]="assigneeId"
          id="assigneeId"
          [label]="'task.assignee' | translate"
          [options]="userOptions"
          [errorMessage]="'task.assigneeRequired' | translate"
          [required]="true"
        />
      </form>
    </ui-popup>
  `,
  styles: [`
    .add-task-popup__form {
      display: grid;
      gap: var(--space-4);
      padding: var(--space-4);
    }
  `],
})
export class AddTaskPopupComponent {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);

  taskForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    dueDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    priority: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    assigneeId: ['', [Validators.required]],
  });

  name = this.taskForm.get('name') as FormControl<string>;
  description = this.taskForm.get('description') as FormControl<string>;
  dueDate = this.taskForm.get('dueDate') as FormControl<string>;
  priority = this.taskForm.get('priority') as FormControl<number>;
  assigneeId = this.taskForm.get('assigneeId') as FormControl<number>;

  @Input({ required: true }) projectId!: number;
  @Output() onClose = new EventEmitter<void>();
  @Output() onAddTask = new EventEmitter<GetTaskResponse | null>();

  userOptions: SelectOption<number>[] = [];

  async ngOnInit(): Promise<void> {
    const users = await this.userService.getUsers();
    this.userOptions = users.map((user: User) => ({
      value: user.id,
      label: user.username,
    }));
  }

  async submit(): Promise<void> {
    if (this.taskForm.invalid) return;

    try {
      const newTask = {
        name: this.name.value,
        description: this.description.value,
        dueDate: new Date(this.dueDate.value),
        priority: this.priority.value,
        assigneeId: +this.assigneeId.value,
        projectId: this.projectId,
      };
      const task = await this.taskService.addTask(newTask);
      this.onAddTask.emit(task);
      this.close();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
