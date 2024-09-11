import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TaskHistory } from '../../../core/services/data-mock.service';
import { TaskHistoryService } from '../../../core/services/task-history.service';
import { ButtonComponent } from '../../../ui/button.component';
import { PaginatorComponent } from '../../../ui/paginator.component';
import { Table } from '../../../types';

@Component({
  selector: 'task-histories-panel',
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
      <h2 class="font-semibold text-lg">
        <a href="/projects" class="hover:underline">Task History</a>
      </h2>
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
          @for (taskHistory of taskHistories(); track taskHistory.id) {
          <tr class="hover:bg-neutral-100 dark:hover:bg-neutral-800">
            @for (column of table.items; track column.key) {
            <td
              class="px-4 py-2 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200 overflow-hidden text-ellipsis max-w-xs"
            >
              @if (taskHistory[column.key] === undefined) {-} @else if
              (column.type === 'date') {
              {{ taskHistory[column.key] | date : 'mediumDate' }}
              } @else {
              {{ taskHistory[column.key] }}
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
export class TaskHistoriesPanelComponent {
  protected readonly taskHistoryService = inject(TaskHistoryService);
  readonly typeName = 'Task History';

  protected readonly table: Table<TaskHistory> = {
    headers: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Description', key: 'description' },
      { name: 'Date', key: 'date' },
    ],
    items: [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'date', type: 'date' },
    ],
  };

  readonly taskHistories = computed(() =>
    this.taskHistoryService
      .taskHistoriesSignal()
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  );

  onPageChange(page: number) {
    console.log(page);
  }
}
