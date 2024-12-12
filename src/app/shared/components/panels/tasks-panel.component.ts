import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Table } from '../../../types';
import { TaskResponse } from '../../models/Tasks/TaskResponse';
import { TaskSummaryResponse } from '../../models/Tasks/TaskSummaryResponse';
import { TaskService } from '../../services/_data/task.service';
import { ButtonComponent } from '../ui/button.component';
import { TableComponent } from '../ui/table.component';
import { AddTaskPopupComponent } from '../popups/add-task-popup.component';
import { DeleteTaskPopupComponent } from '../popups/delete-task-popup.component';

type PopupType = 'addTask' | 'deleteTask';

@Component({
  selector: 'tasks-panel',
  imports: [
    TableComponent,
    ButtonComponent,
    AddTaskPopupComponent,
    DeleteTaskPopupComponent,
  ],
  host: {
    class:
      'border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]',
  },
  template: `
    <div
      class="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 shadow-sm p-4"
    >
      <h2 class="font-semibold text-lg">Tasks</h2>
      <ui-button
        [disabled]="false"
        icon="fi fi-rr-square-plus"
        label="Add Task"
        (click)="showPopup('addTask')"
      />
    </div>
    <div>
      <ui-table
        [headers]="table.headers"
        [columns]="table.items"
        [data]="tasks()"
      >
        <ng-template #actionTemplate let-taskSummary>
          @if (toTaskSummary(taskSummary); as taskSummary) {
          <div class="flex gap-2">
            <ui-button
              label="Go to task"
              [iconOnly]="true"
              icon="fi fi-rr-door-open"
              (click)="goTotask(taskSummary.id)"
            />

            @if (taskSummary.permissions.deleteTask) {
            <ui-button
              label="Delete Task"
              [iconOnly]="true"
              variant="danger"
              icon="fi fi-rr-trash"
              (click)="showPopup('deleteTask', taskSummary.id)"
            />
            }
          </div>
          }
        </ng-template>
      </ui-table>
    </div>

    @switch (activePopup()) { @case ('addTask') {
    <add-task-popup (onClose)="hidePopup()" (onSubmit)="addTask($event)" />
    } @case ('deleteTask') {
    <delete-task-popup
      [taskId]="activeTaskId()!"
      (onClose)="hidePopup()"
      (onDeleteTask)="deleteTask($event)"
    />
    } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPanelComponent {
  private readonly router = inject(Router);
  readonly taskService = inject(TaskService);

  readonly assignedOnly = input<boolean>(false);

  readonly table: Table<TaskSummaryResponse> = {
    headers: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Project', key: 'project' },
      { name: 'Description', key: 'description' },
      { name: 'Due Date', key: 'dueDate' },
      { name: 'Priority', key: 'priority' },
    ],
    items: [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'text' },
      { key: 'project', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'dueDate', type: 'date' },
      { key: 'priority', type: 'number' },
    ],
  };

  readonly tasks = signal<TaskSummaryResponse[]>([]);
  readonly activePopup = signal<PopupType | null>(null);
  readonly activeTaskId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.tasks.set(
      await this.taskService.getTaskSummaries(this.assignedOnly())
    );
  }

  showPopup(popupType: PopupType, taskId?: number): void {
    this.activePopup.set(popupType);
    if (taskId) this.activeTaskId.set(taskId);
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeTaskId.set(null);
  }

  goTotask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  onPageChange(page: number) {
    console.log(page);
  }

  toTaskSummary(taskSummary: unknown): TaskSummaryResponse {
    return taskSummary as TaskSummaryResponse;
  }

  deleteTask(taskId: number): void {
    this.tasks.set(this.tasks().filter((task) => task.id !== taskId));
  }

  async addTask(task: TaskResponse): Promise<void> {
    const taskSummary = await this.taskService.getTaskSummary(task.id);
    if (!taskSummary) return;
    this.tasks.set([...this.tasks(), taskSummary]);
  }
}
