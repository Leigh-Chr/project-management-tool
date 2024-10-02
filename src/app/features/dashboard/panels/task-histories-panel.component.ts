import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TaskHistory } from '../../../core/services/data-mock.service';
import { TaskHistoryService } from '../../../core/services/task-history.service';
import { Table } from '../../../types';
import { ButtonComponent } from '../../../ui/button.component';
import { PaginatorComponent } from '../../../ui/paginator.component';
import { TableComponent } from '../../../ui/table.component';

@Component({
  selector: 'task-histories-panel',
  standalone: true,
  imports: [PaginatorComponent, ButtonComponent, DatePipe, TableComponent],
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
      <ui-table
        [headers]="table.headers"
        [columns]="table.items"
        [data]="taskHistories()"
      />
    </div>
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
