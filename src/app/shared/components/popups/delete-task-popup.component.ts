import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskResponse } from '../../models/Tasks/TaskResponse';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';

@Component({
  selector: 'delete-task-popup',
  imports: [PopupComponent],
  template: `
    @if (task) {
    <ui-popup
      title="Delete Task - {{ task.name }}"
      submitLabel="Delete"
      submitVariant="danger"
      (onSubmit)="deleteTask()"
      (onClose)="close()"
    >
      <p class="mb-4">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>
    </ui-popup>
    } @else {
    <ui-popup title="Delete Task" [isSubmitDisabled]="true">
      <p>Loading...</p>
    </ui-popup>
    }
  `,
})
export class DeleteTaskPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly taskService = inject(TaskService);

  @Input({ required: true }) taskId!: number;
  task: TaskResponse | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDeleteTask = new EventEmitter<number>();

  async ngOnInit(): Promise<void> {
    this.task = await this.getTask();
    if (!this.task) {
      this.toastService.showToast(
        {
          title: 'Error',
          message: 'Task not found.',
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
