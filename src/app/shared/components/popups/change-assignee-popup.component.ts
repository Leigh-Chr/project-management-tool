import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatorPipe } from '../../i18n/translator.pipe';
import { GetUserResponse } from '../../models/GetUserResponse';
import { TaskService } from '../../services/data/task.service';
import { UserService } from '../../services/data/user.service';
import { ToastService } from '../toast/toast.service';
import { SelectOption } from '../ui/select-field.component';

@Component({
    selector: 'pmt-change-assignee-popup',
    standalone: true,
    imports: [ReactiveFormsModule, TranslatorPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
        <pmt-popup [isOpen]="true" (onClose)="close()">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <h3 class="visually-hidden" id="change-assignee-title">Change Task Assignee</h3>
                <div class="popup__content">
                    <div class="popup__header">
                        <h2 class="popup__title">{{ 'change_assignee' | translate }}</h2>
                    </div>
                    <div class="popup__body">
                        <pmt-select-field
                            [label]="'assignee' | translate"
                            [options]="userOptions"
                            [control]="userControl"
                            [error]="getErrorMessage(userControl.errors)"
                            aria-required="true"
                            [attr.aria-invalid]="userControl.invalid"
                            [attr.aria-describedby]="userControl.errors ? 'assignee-error' : null"
                        ></pmt-select-field>
                        <div id="assignee-error" class="visually-hidden" role="alert">
                            {{ getErrorMessage(userControl.errors) }}
                        </div>
                    </div>
                    <div class="popup__footer">
                        <button type="button" class="btn btn-secondary" (click)="close()">
                            {{ 'cancel' | translate }}
                        </button>
                        <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
                            {{ 'save' | translate }}
                        </button>
                    </div>
                </div>
            </form>
        </pmt-popup>
    `,
})
export class ChangeAssigneePopupComponent implements OnInit {
    private readonly toastService = inject(ToastService);
    private readonly taskService = inject(TaskService);
    private readonly userService = inject(UserService);

    @Input() taskId!: number;
    @Output() onClose = new EventEmitter<void>();
    @Output() onChangeAssignee = new EventEmitter<GetUserResponse | null>();

    userOptions: SelectOption<number>[] = [];
    form: FormGroup;
    userControl: FormControl;

    constructor(private fb: FormBuilder) {
        this.userControl = new FormControl(null, [Validators.required]);
        this.form = this.fb.group({
            user: this.userControl,
        });
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    private async loadUsers(): Promise<void> {
        try {
            const users = await this.userService.getUsers();
            this.userOptions = users.map((user: GetUserResponse) => ({
                value: user.id,
                label: user.username,
            }));
        } catch {
            this.toastService.showToast(
                {
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to load users',
                    duration: 3000,
                },
                'root'
            );
        }
    }

    async onSubmit(): Promise<void> {
        if (this.form.valid) {
            try {
                const user = await this.taskService.changeAssignee(
                    this.taskId,
                    this.userControl.value
                );
                this.onChangeAssignee.emit(user || null);
                this.close();
            } catch {
                this.toastService.showToast(
                    {
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to change assignee',
                        duration: 3000,
                    },
                    'root'
                );
            }
        }
    }

    close(): void {
        this.onClose.emit();
    }

    getErrorMessage(errors: ValidationErrors | null): string {
        if (!errors) return '';
        if (errors['required']) return 'Please select an assignee';
        return 'Invalid selection';
    }
}
