import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GetTaskResponse } from '../../models/Tasks/GetTaskResponse';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { TranslatorPipe } from '../../i18n/translator.pipe';

@Component({
  selector: 'pmt-delete-task-popup',
  standalone: true,
  imports: [PopupComponent, TranslatorPipe],
  providers: [TranslatorPipe],
  template: `
    @if (task) {
    <ui-popup
      title="{{ 'task.deleteTaskTitle' | translate }} - {{ task.name }}"
      submitLabel="{{ 'task.deleteTask' | translate }}"
      cancelLabel="{{ 'task.cancel' | translate }}"
      submitVariant="danger"
      (onSubmit)="deleteTask()"
      (onClose)="close()"
      id="delete-task-popup"
    >
      <p 
        class="delete-task-popup__message"
        role="alert"
        aria-live="polite"
      >
        {{ 'task.confirmDeleteTask' | translate }}
      </p>
    </ui-popup>
    } @else {
    <ui-popup
      title="{{ 'task.deleteTaskTitle' | translate }}"
      [isSubmitDisabled]="true"
      id="delete-task-popup-loading"
    >
      <p 
        class="delete-task-popup__message"
        role="status"
        aria-live="polite"
      >
        {{ 'task.loading' | translate }}
      </p>
    </ui-popup>
    }
  `,
  styles: [`
    .delete-task-popup__message {
      margin-bottom: var(--space-4);
      color: var(--text-color);
      font-size: var(--font-size-base);
    }
  `]
})
export class DeleteTaskPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly taskService = inject(TaskService);
  private readonly translator = inject(TranslatorPipe);

  @Input({ required: true }) taskId!: number;
  task: GetTaskResponse | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDeleteTask = new EventEmitter<number>();

  async ngOnInit(): Promise<void> {
    this.task = await this.getTask();
    if (!this.task) {
      this.toastService.showToast(
        {
          title: this.translator.transform('task.errorTitle'),
          message: this.translator.transform('task.taskNotFoundMessage'),
          duration: 5000,
          type: 'error',
        },
        'root'
      );
      this.close();
    }
  }

  async getTask(): Promise<GetTaskResponse | null> {
    return this.taskService.getTask(this.taskId);
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.taskId);
    this.onDeleteTask.emit(this.taskId);
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}