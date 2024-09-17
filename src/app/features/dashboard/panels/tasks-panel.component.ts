import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Task } from '../../../core/services/data-mock.service';
import { TaskService } from '../../../core/services/task.service';
import { ButtonComponent } from '../../../ui/button.component';
import { PaginatorComponent } from '../../../ui/paginator.component';
import { Table } from '../../../types';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tasks-panel',
  standalone: true,
  imports: [PaginatorComponent, ButtonComponent, DatePipe],
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
        label="Add Project"
      />
    </div>
    <div>
      <table
        class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800"
      >
        <thead class="bg-neutral-50 dark:bg-neutral-950">
          @for (header of table.headers; track header.key) {
          <th
            class="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
          >
            {{ header.name }}
          </th>
          }
        </thead>
        <tbody
          class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800"
        >
          @for (task of tasks(); track task.projectId) {
          <tr class="hover:bg-neutral-100 dark:hover:bg-neutral-800">
            @for (column of table.items; track column.key) {
            <td
              class="px-4 py-2 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200 overflow-hidden text-ellipsis max-w-xs"
            >
              @if (task[column.key] === undefined) {-} @else if (column.type ===
              'date') {
              {{ task[column.key] | date : 'mediumDate' }}
              } @else {
              {{ task[column.key] }}
              }
            </td>
            }
          </tr>
          }
        </tbody>
      </table>
    </div>
    <ui-paginator
      [pageSize]="1"
      [totalItems]="0"
      (pageChange)="onPageChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPanelComponent {
  private readonly authService = inject(AuthService);
  readonly taskService = inject(TaskService);
  readonly table: Table<Task> = {
    headers: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Description', key: 'description' },
      { name: 'Due Date', key: 'dueDate' },
    ],
    items: [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'dueDate', type: 'date' },
    ],
  };

  readonly tasks = computed(() => {
    const currentUserId = this.authService.userSignal()?.id;
    if (!currentUserId) return [];

    return this.taskService
      .tasksSignal()
      .filter((task) => task.assigneeId === currentUserId)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  });

  onPageChange(page: number) {
    console.log(page);
  }
}
