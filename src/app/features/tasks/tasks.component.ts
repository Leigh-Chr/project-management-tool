import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Task, Project, User } from '../../core/services/data-mock.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Table } from '../../types';
import { ButtonComponent } from '../../ui/button.component';
import { PaginatorComponent } from '../../ui/paginator.component';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { UserService } from '../../core/services/user.service';

@Component({
  standalone: true,
  imports: [
    PaginatorComponent,
    ButtonComponent,
    DatePipe,
    DefaultLayoutComponent,
  ],
  template: `
    <default-layout>
      <div
        class="border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 shadow-sm border rounded-lg overflow-hidden grid grid-rows-[auto,1fr]"
      >
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
                  @if (task[column.key] === undefined) {-} @else if (column.type
                  === 'date') {
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
      </div>
      <ui-paginator
        [pageSize]="1"
        [totalItems]="0"
        (pageChange)="onPageChange($event)"
      />
    </default-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
  private readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);

  readonly table: Table<
    Task & {
      project: Project['name'];
    } & {
      assignee: User['username'];
    }
  > = {
    headers: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Project', key: 'project' },
      { name: 'Description', key: 'description' },
      { name: 'Due Date', key: 'dueDate' },
      { name: 'Assignee', key: 'assignee' },
      { name: 'Priority', key: 'priority' },
    ],
    items: [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'text' },
      { key: 'project', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'dueDate', type: 'date' },
      { key: 'assignee', type: 'text' },
      { key: 'priority', type: 'number' },
    ],
  };

  readonly tasks = computed<
    (Task & { project: Project['name'] } & { assignee: User['username'] })[]
  >(() => {
    const currentUserId = this.authService.userSignal()?.id;
    if (!currentUserId) return [];

    return this.taskService
      .tasksSignal()
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .map((task) => {
        return {
          ...task,
          project:
            this.projectService
              .projectsSignal()
              .find((project) => project.id === task.projectId)?.name ?? '',
          assignee:
            this.userService
              .usersSignal()
              .find((user) => user.id === task.assigneeId)?.username ?? '',
        };
      });
  });

  onPageChange(page: number) {
    console.log(page);
  }
}
