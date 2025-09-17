import {
  Component,
  Injector,
  effect,
  inject,
  input,
  output,
  signal,
  untracked, OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Task } from '@app/shared/models/task.models';
import { TaskService } from '@app/shared/services/data/task.service';
import { ToastService } from '../toast/toast.service';
import { PopupComponent } from '../ui/popup.component';

@Component({
  selector: 'pmt-delete-task-popup',
  standalone: true,
  imports: [PopupComponent],
  template: `
    @if (task(); as task) {
    <ui-popup
      popupTitle="Delete Task - {{ task.name }}"
      (onSubmit)="deleteTask()"
      (onClose)="onClose.emit()"
    >
      <p>
        Are you sure you want to delete this task? This action cannot be undone.
      </p>

      <ul class="list">
        <li><b>Name:</b> {{ task.name }}</li>
        <li><b>Status:</b> {{ task.status }}</li>
        <li><b>Project:</b> {{ task.project.name }}</li>
      </ul>
    </ui-popup>
    } @else {
    <ui-popup
      popupTitle="Delete Task"
      [isSubmitDisabled]="true"
      submitLabel="Submit"
      cancelLabel="Cancel"
    >
      <p class="delete-task-popup__message" role="status" aria-live="polite">
        Loading...
      </p>
    </ui-popup>
    }
  `,
})
export class DeleteTaskPopupComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly taskService = inject(TaskService);
  private readonly injector = inject(Injector);

  readonly taskId = input.required<number>();
  task = signal<Task | undefined>(undefined).asReadonly();

  onClose = output<void>();

  constructor() {
    effect(() => {
      const task = this.task();
      if (!task) {
        this.toastService.showToast({
          title: 'Error',
          message: 'Task not found',
          type: 'error',
        });
        this.onClose.emit();
        return;
      }
    });

    effect(() => {
      const deletedTask = this.taskService.deletedTask();
      if (!deletedTask) {return;}

      untracked(() => {
        this.toastService.showToast({
          title: 'Success',
          message: 'Task deleted',
          type: 'success',
        });
        this.onClose.emit();
      });
    });
  }


  async ngOnInit(): Promise<void> {
    this.task = toSignal(this.taskService.getTask(this.taskId()), {
      injector: this.injector,
    });

    if (!this.taskId()) {
      this.toastService.showToast({
        title: 'Error',
        message: 'Task not found',
        type: 'error',
      });
      this.onClose.emit();
    }
  }

  deleteTask(): void {
    // Appel au service et fermeture immédiate du popup
    this.taskService.deleteTask(this.taskId()).subscribe({
      next: (_result) => {
        // Fermer le popup immédiatement - l'UI sera mise à jour par les effects des composants parents
        this.onClose.emit();
      },
      error: (_error) => {
        this.toastService.showToast({
          title: 'Error',
          message: 'Failed to delete task',
          type: 'error',
        });
      }
    });
  }
}
