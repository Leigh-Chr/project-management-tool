import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Project, Task } from '../../../services/backend-mock.service';
import { ProjectService } from '../../../services/data/project.service';
import { TaskService } from '../../../services/data/task.service';
import { Table } from '../../../types';
import { ButtonComponent } from '../../../components/ui/button.component';
import { PaginatorComponent } from '../../../components/ui/paginator.component';
import { TableComponent } from '../../../components/ui/table.component';

@Component({
  selector: 'tasks-panel',
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
      <h2 class="font-semibold text-lg">Tasks</h2>
    </div>
    <div>
      <ui-table
        [headers]="table.headers"
        [columns]="table.items"
        [data]="tasks()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPanelComponent {
  private readonly authService = inject(AuthService);
  readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);

  readonly table: Table<
    Task & {
      project: Project['name'];
    }
  > = {
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

  readonly tasks = computed<(Task & { project: Project['name'] })[]>(() => {
    const currentUserId = this.authService.userSignal()?.id;
    if (!currentUserId) return [];

    return this.taskService
      .tasksSignal()
      .filter((task) => task.assigneeId === currentUserId)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .map((task) => {
        return {
          ...task,
          project:
            this.projectService
              .projectsSignal()
              .find((project) => project.id === task.projectId)?.name ?? '',
        };
      });
  });

  onPageChange(page: number) {
    console.log(page);
  }
}
