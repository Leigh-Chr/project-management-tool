import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslatorPipe } from '../../i18n/translator.pipe';
import { GetTaskResponse } from '../../models/Tasks/GetTaskResponse';
import { GetUserResponse } from '../../models/GetUserResponse';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/data/task.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import {
    SelectFieldComponent,
    SelectOption,
} from '../ui/select-field.component';

@Component({
    selector: 'pmt-change-assignee-popup',
    imports: [
        ReactiveFormsModule,
        SelectFieldComponent,
        PopupComponent,
        TranslatorPipe,
    ],
    providers: [TranslatorPipe],
    template: `
    @if (task) {
    <ui-popup
      title="{{ 'task.changeAssigneeTitle' | translate }} - {{ task.name }}"
      [isSubmitDisabled]="assigneeForm.invalid"
      [submitLabel]="'task.changeAssignee' | translate"
      [cancelLabel]="'task.cancel' | translate"
      (onSubmit)="changeAssignee()"
      (onClose)="close()"
    >
      <form [formGroup]="assigneeForm" novalidate>
        <ui-select-field
          [options]="userOptions"
          [control]="userControl"
          id="user"
          [label]="'task.user' | translate"
          [errorMessage]="'task.selectUserError' | translate"
        />
      </form>
    </ui-popup>
    } @else {
    <ui-popup
      [title]="'task.changeAssignee' | translate"
      [isSubmitDisabled]="true"
    >
      <p>{{ 'task.loading' | translate }}</p>
    </ui-popup>
    }
  `,
})
export class ChangeAssigneePopupComponent {
    private readonly toastService = inject(ToastService);
    private readonly taskService = inject(TaskService);
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly translator = inject(TranslatorPipe);

    @Input() taskId!: number;
    @Output() onClose = new EventEmitter<void>();
    @Output() onChangeAssignee = new EventEmitter<GetUserResponse | null>();

    userOptions: SelectOption<number>[] = [];

    task: GetTaskResponse | null = null;

    private readonly formBuilder = inject(FormBuilder);
    assigneeForm: FormGroup = this.formBuilder.group({
        user: ['', [Validators.required]],
    });

    userControl = this.assigneeForm.get('user') as FormControl<GetUserResponse>;

    async ngOnInit(): Promise<void> {
        this.task = await this.taskService.getTask(this.taskId);
        if (!this.task) {
            this.toastService.showToast(
                {
                    title: this.translator.transform('task.notFoundTitle'),
                    message: this.translator.transform('task.notFoundMessage'),
                    type: 'error',
                    duration: 5000,
                },
                'root'
            );
            this.close();
        }

        const users = await this.userService.getUsers();
        this.userOptions = users
            .filter((user) => user.id !== this.authService.authUser()?.id)
            .map((user) => ({
                value: user.id,
                label: user.username,
            }));

        if (this.userOptions.length === 0) {
            this.toastService.showToast(
                {
                    title: this.translator.transform('task.noUsersTitle'),
                    message: this.translator.transform('task.noUsersMessage'),
                    type: 'error',
                    duration: 5000,
                },
                'root'
            );
            this.close();
        }
    }

    async changeAssignee(): Promise<void> {
        if (this.assigneeForm.invalid) return;
        const newAssigneeId = +this.userControl.value;
        const updatedUser = await this.taskService.changeAssignee(this.taskId, newAssigneeId);
        this.onChangeAssignee.emit(updatedUser);
        this.close();
    }

    close(): void {
        this.onClose.emit();
    }
}
