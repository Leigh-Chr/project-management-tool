import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TaskService } from '../../shared/services/_data/task.service';
import { TaskDetails } from '../../shared/models/TaskDetails';

@Component({
  imports: [DefaultLayoutComponent, JsonPipe, DatePipe, RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <default-layout>
      @if (task) {
      <div
        class="p-6 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-100 dark:border-neutral-900"
      >
        <h2
          class="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100"
        >
          {{ task.name }}
        </h2>
        <p class="text-neutral-700 dark:text-neutral-300 mb-4">
          {{ task.description || 'No description provided.' }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
            >
              Status
            </p>
            <p class="text-lg text-neutral-900 dark:text-neutral-100">
              {{ task.status.name }}
            </p>
          </div>
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
            >
              Due Date
            </p>
            <p class="text-lg text-neutral-900 dark:text-neutral-100">
              {{ task.dueDate | date : 'longDate' }}
            </p>
          </div>
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
            >
              Priority
            </p>
            <p class="text-lg text-neutral-900 dark:text-neutral-100">
              {{ task.priority }}
            </p>
          </div>
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
            >
              Assigned to
            </p>
            <p class="text-lg text-neutral-900 dark:text-neutral-100">
              @if (task.assignee) {
              {{ task.assignee.username }}
              } @else { Not assigned }
            </p>
          </div>
        </div>

        @if (task.project) {
        <div class="mt-6">
          <a
            [routerLink]="['/projects', task.project.id]"
            class="
          inline-block px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white 
          dark:text-white font-semibold text-center rounded-lg shadow-sm 
          hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
          >
            View Project: {{ task.project.name }}
          </a>
        </div>
        }

        <div class="mt-6">
          <h3
            class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3"
          >
            Task History
          </h3>
          @if (task.taskHistory.length > 0) {
          <ul class="space-y-4">
            @for (history of task.taskHistory; track history.id) {
            <li
              class="px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
            >
              <h4
                class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ history.name }}
              </h4>
              <p class="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                {{ history.description || 'No description provided.' }}
              </p>
              <p class="text-sm">
                <strong class="text-neutral-900 dark:text-neutral-100"
                  >Date:</strong
                >
                <span class="text-neutral-700 dark:text-neutral-400">
                  {{ history.date | date : 'longDate' }}
                </span>
              </p>
            </li>
            }
          </ul>
          } @else {
          <p class="text-neutral-600 dark:text-neutral-400">
            No history available for this task.
          </p>
          }
        </div>
      </div>
      } @else {
      <p class="text-neutral-600 dark:text-neutral-400">
        Task not found. Redirecting...
      </p>
      }
    </default-layout>
  `,
})
export class TaskComponent {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  task!: TaskDetails;

  async ngOnInit(): Promise<void> {
    try {
      this.task = await this.taskService.getTaskDetails(this.id);
    } catch {
      this.router.navigate(['/tasks']);
    }
  }
}
