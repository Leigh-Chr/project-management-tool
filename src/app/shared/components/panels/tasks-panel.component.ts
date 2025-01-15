import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TaskResponse } from '../../models/Tasks/TaskResponse';
import { TaskSummaryResponse } from '../../models/Tasks/TaskSummaryResponse';
import { TaskService } from '../../services/data/task.service';
import { AddTaskPopupComponent } from '../popups/add-task-popup.component';
import { DeleteTaskPopupComponent } from '../popups/delete-task-popup.component';
import { ButtonComponent } from '../ui/button.component';
import { TableColumn, TableComponent } from '../ui/table.component';
import { TranslatorPipe } from '../../i18n/translator.pipe';

type PopupType = 'addTask' | 'deleteTask';

@Component({
  selector: 'pmt-tasks-panel',
  imports: [
    TableComponent,
    ButtonComponent,
    AddTaskPopupComponent,
    DeleteTaskPopupComponent,
    TranslatorPipe,
  ],
  host: {
    class:
      'border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]',
  },
  providers: [TranslatorPipe],
  template: `
    <div
      class="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 shadow-sm p-4"
    >
      <h2 class="font-semibold text-lg">{{ 'tasks' | translate }}</h2>
      <ui-button
        [disabled]="false"
        icon="fi fi-rr-square-plus"
        [label]="'task.addTask' | translate"
        (click)="showPopup('addTask')"
      />
    </div>
    <div>
      <ui-table [columns]="columns" [data]="tasks()">
        <ng-template #actionTemplate let-taskSummary>
          @if (toTaskSummary(taskSummary); as taskSummary) {
          <div class="flex gap-2">
            <ui-button
              [label]="'task.goToTask' | translate"
              [iconOnly]="true"
              icon="fi fi-rr-door-open"
              (click)="goTotask(taskSummary.id)"
            />

            @if (taskSummary.permissions.deleteTask) {
            <ui-button
              [label]="'task.deleteTask' | translate"
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
    <pmt-add-task-popup (onClose)="hidePopup()" (onAddTask)="addTask($event)" />
    } @case ('deleteTask') {
    <pmt-delete-task-popup
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
  private readonly translator = inject(TranslatorPipe);

  readonly assignedOnly = input<boolean>(false);

  readonly columns: TableColumn<TaskSummaryResponse>[] = [
    { name: this.translator.transform('task.id'), key: 'id', type: 'number' },
    { name: this.translator.transform('task.name'), key: 'name', type: 'text' },
    {
      name: this.translator.transform('task.project'),
      key: 'project',
      type: 'text',
    },
    {
      name: this.translator.transform('task.description'),
      key: 'description',
      type: 'text',
    },
    {
      name: this.translator.transform('task.dueDate'),
      key: 'dueDate',
      type: 'date',
    },
    {
      name: this.translator.transform('task.priority'),
      key: 'priority',
      type: 'number',
    },
  ];

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

  toTaskSummary(taskSummary: unknown): TaskSummaryResponse {
    return taskSummary as TaskSummaryResponse;
  }

  deleteTask(taskId: number): void {
    this.tasks.set(this.tasks().filter((task) => task.id !== taskId));
  }

  async addTask(task: TaskResponse | null): Promise<void> {
    if (!task) return;
    const taskSummary = await this.taskService.getTaskSummary(task.id);
    if (!taskSummary) return;
    this.tasks.set([...this.tasks(), taskSummary]);
  }
}
