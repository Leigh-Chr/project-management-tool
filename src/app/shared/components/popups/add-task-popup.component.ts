import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputFieldComponent } from '../ui/input-field.component';
import { PopupComponent } from '../ui/popup.component';
import { TaskResponse } from '../../models/Tasks/TaskResponse';
import { TaskService } from '../../services/data/task.service';
import { UserService } from '../../services/data/user.service';
import { UserResponse } from '../../models/UserResponse';
import {
  SelectFieldComponent,
  SelectOption,
} from '../ui/select-field.component';
import { AddTaskRequest } from '../../models/Tasks/AddTaskRequest';
import { TranslatorPipe } from '../../i18n/translator.pipe';

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
    >
      <form [formGroup]="taskForm" novalidate>
        <ui-input-field
          [control]="name"
          id="name"
          [label]="'task.name' | translate"
          type="text"
          [errorMessage]="'task.nameRequired' | translate"
        />
        <ui-input-field
          [control]="description"
          id="description"
          [label]="'task.description' | translate"
          type="text"
        />
        <ui-input-field
          [control]="dueDate"
          id="dueDate"
          [label]="'task.dueDate' | translate"
          type="date"
          [errorMessage]="'task.dueDateRequired' | translate"
        />
        <ui-input-field
          [control]="priority"
          id="priority"
          [label]="'task.priority' | translate"
          type="number"
          [errorMessage]="'task.priorityRequired' | translate"
        />
        <ui-select-field
          [control]="assigneeId"
          id="assigneeId"
          [label]="'task.assignee' | translate"
          [options]="userOptions"
          [errorMessage]="'task.assigneeRequired' | translate"
        />
      </form>
    </ui-popup>
  `,
})
export class AddTaskPopupComponent {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);

  taskForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    dueDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    priority: [1, [Validators.required]],
    assigneeId: ['', [Validators.required]],
  });

  name = this.taskForm.get('name') as FormControl<string>;
  description = this.taskForm.get('description') as FormControl<string>;
  dueDate = this.taskForm.get('dueDate') as FormControl<string>;
  priority = this.taskForm.get('priority') as FormControl<number>;
  assigneeId = this.taskForm.get('assigneeId') as FormControl<number>;

  @Input() projectId!: number;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<TaskResponse | null>();
  
  userOptions: SelectOption<UserResponse>[] = [];

  async ngOnInit(): Promise<void> {
    const users = await this.userService.getUsers();
    this.userOptions = users.map((user) => ({
      value: user,
      label: user.username,
    }));
  }

  async submit(): Promise<void> {
    if (!this.taskForm.valid) return;

    const newTask: AddTaskRequest = {
      name: this.name.value,
      description: this.description.value,
      dueDate: new Date(this.dueDate.value),
      priority: this.priority.value,
      assigneeId: this.assigneeId.value,
      projectId: this.projectId,
    };

    const task = await this.taskService.addTask(newTask);
    this.onSubmit.emit(task);
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
