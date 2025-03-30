import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { TaskService } from '../../services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pmt-delete-task-popup',
  standalone: true,
  imports: [PopupComponent],
  template: `
    @if (task()) {
    <ui-popup
      popupTitle="Delete Task - {{ task()?.name }}"
      submitLabel="Submit"
      cancelLabel="Cancel"
      [isSubmitDisabled]="true"
      (onSubmit)="deleteTask()"
      (onClose)="close()"
    >
      <p>Are you sure you want to delete this task?</p>
    </ui-popup>
    } @else {
    <ui-popup
      popupTitle="Delete Task"
      [isSubmitDisabled]="true"
      submitLabel="Submit"
      cancelLabel="Cancel"
    >
      <p>Loading...</p>
    </ui-popup>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTaskPopupComponent {
  private readonly toastService = inject(ToastService);
  private readonly taskService = inject(TaskService);

  taskId = input.required<number>();
  task = toSignal(this.taskService.getTask(this.taskId()));

  onClose = output<void>();

  async ngOnInit(): Promise<void> {
    if (!this.task()) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Task not found',
        type: 'error',
      });
      this.close();
    }
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.taskId());
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
