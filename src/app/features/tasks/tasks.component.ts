import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Project, Task, User } from '../../core/services/data-mock.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { Table } from '../../types';
import { ButtonComponent } from '../../ui/button.component';
import { PaginatorComponent } from '../../ui/paginator.component';
import { TableComponent } from '../../ui/table.component';

@Component({
  standalone: true,
  imports: [
    PaginatorComponent,
    ButtonComponent,
    DatePipe,
    DefaultLayoutComponent,
    TableComponent,
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
          <ui-table
            [headers]="table.headers"
            [columns]="table.items"
            [data]="tasks()"
          />
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
