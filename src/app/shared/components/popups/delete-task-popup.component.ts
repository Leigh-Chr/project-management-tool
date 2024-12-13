import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskResponse } from '../../models/Tasks/TaskResponse';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { TranslatorPipe } from '../../i18n/translator.pipe';

@Component({
  selector: 'delete-task-popup',
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
    >
      <p class="mb-4">
        {{ 'task.confirmDeleteTask' | translate }}
      </p>
    </ui-popup>
    } @else {
    <ui-popup
      title="{{ 'task.deleteTaskTitle' | translate }}"
      [isSubmitDisabled]="true"
    >
      <p>{{ 'task.loading' | translate }}</p>
    </ui-popup>
    }
  `,
})
export class DeleteTaskPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly taskService = inject(TaskService);
  private readonly translator = inject(TranslatorPipe);

  @Input({ required: true }) taskId!: number;
  task: TaskResponse | null = null;

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

  async getTask(): Promise<TaskResponse | null> {
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
