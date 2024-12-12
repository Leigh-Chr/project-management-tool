import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TaskEventResponse } from '../../models/TaskEventResponse';
import { TableColumn, TableComponent } from '../ui/table.component';

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
      <ui-table [columns]="columns" [data]="taskHistories()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskHistoriesPanelComponent {
  readonly typeName = 'Task History';

  protected readonly columns: TableColumn<TaskEventResponse>[] = [
    { name: 'ID', key: 'id', type: 'number' },
    { name: 'Name', key: 'name', type: 'text' },
    { name: 'Description', key: 'description', type: 'text' },
    { name: 'Date', key: 'date', type: 'date' },
  ];

  readonly taskHistories = signal<TaskEventResponse[]>([]);
}
