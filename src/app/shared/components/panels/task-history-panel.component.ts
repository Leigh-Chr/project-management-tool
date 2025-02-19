import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { GetTaskEventResponse } from '../../models/Tasks/GetTaskEventResponse';
import { TableColumn, TableComponent } from '../ui/table.component';
import { TranslatorPipe } from '../../i18n/translator.pipe';
import { TaskService } from '../../services/data/task.service';

@Component({
  selector: 'pmt-task-histories-panel',
  imports: [TableComponent, TranslatorPipe],
  host: {
    class:
      'border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]',
  },
  providers: [TranslatorPipe],
  template: `
    <div
      class="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 shadow-sm p-4"
    >
      <h2 class="font-semibold text-lg">
        <a href="/projects" class="hover:underline">{{
          'task.taskHistory' | translate
        }}</a>
      </h2>
    </div>
    <div>
      <ui-table [columns]="columns" [data]="taskHistories()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskHistoryPanelComponent {
  private readonly taskService = inject(TaskService);
  private readonly translator = inject(TranslatorPipe);
  readonly typeName = 'Task History';

  readonly columns: TableColumn<GetTaskEventResponse>[] = [
    { name: this.translator.transform('task.id'), key: 'id', type: 'number' },
    { name: this.translator.transform('task.name'), key: 'name', type: 'text' },
    {
      name: this.translator.transform('task.description'),
      key: 'description',
      type: 'text',
    },
    { name: this.translator.transform('task.date'), key: 'date', type: 'date' },
  ];

  readonly taskHistories = signal<GetTaskEventResponse[]>([]);

  async ngOnInit(): Promise<void> {
    this.taskHistories.set(await this.taskService.getTaskHistory());
  }
}
