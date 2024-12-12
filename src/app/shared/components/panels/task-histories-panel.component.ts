import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Table } from '../../../types';
import { TaskEventResponse } from '../../models/TaskEventResponse';
import { TableComponent } from '../ui/table.component';

@Component({
  selector: 'task-histories-panel',
  imports: [TableComponent],
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
  readonly typeName = 'Task History';

  protected readonly table: Table<TaskEventResponse> = {
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

  readonly taskHistories = signal<TaskEventResponse[]>([]);

  onPageChange(page: number) {
    console.log(page);
  }
}
