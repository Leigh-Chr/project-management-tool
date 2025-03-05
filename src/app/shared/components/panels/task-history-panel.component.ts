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
  selector: 'pmt-task-history-panel',
  standalone: true,
  imports: [TableComponent, TranslatorPipe],
  providers: [TranslatorPipe],
  template: `
    <div class="task-history-panel">
      <header class="task-history-panel__header">
        <h2 class="task-history-panel__title" id="task-history-title">
          <a 
            href="/projects" 
            class="task-history-panel__link"
            aria-labelledby="task-history-title"
          >
            {{ 'task.taskHistory' | translate }}
          </a>
        </h2>
      </header>
      <div 
        class="task-history-panel__content" 
        role="region" 
        aria-labelledby="task-history-title"
      >
        <ui-table [columns]="columns" [data]="taskHistories()" />
      </div>
    </div>
  `,
  styles: [`
    .task-history-panel {
      display: grid;
      grid-template-rows: auto 1fr;
      background-color: var(--surface-1);
      border: var(--border-width) solid var(--border-color);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .task-history-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--surface-2);
      box-shadow: var(--shadow-sm);
      padding: var(--space-4);
    }

    .task-history-panel__title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-color);
    }

    .task-history-panel__link {
      color: var(--text-color);
      text-decoration: none;
      transition: text-decoration 0.2s ease;

      &:hover {
        text-decoration: underline;
      }
    }

    .task-history-panel__content {
      padding: var(--space-4);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskHistoryPanelComponent {
  private readonly taskService = inject(TaskService);
  private readonly translator = inject(TranslatorPipe);
  readonly typeName = 'Task History';

  readonly columns: TableColumn<GetTaskEventResponse>[] = [
    { name: 'task.name', key: 'name', type: 'text' },
    { name: 'task.description', key: 'description', type: 'text' },
    { name: 'task.date', key: 'date', type: 'date' },
  ];

  readonly taskHistories = signal<GetTaskEventResponse[]>([]);

  async ngOnInit(): Promise<void> {
    this.taskHistories.set(await this.taskService.getTaskHistory());
  }
}
