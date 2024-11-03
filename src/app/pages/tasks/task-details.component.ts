import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TaskDetails } from '../../shared/models/TaskDetails';
import { TaskService } from '../../shared/services/_data/task.service';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { PopupComponent } from '../../shared/components/ui/popup.component';

type PopupType = 'deleteTask' | 'addAssignee' | 'deleteAssignee';

@Component({
  imports: [
    DefaultLayoutComponent,
    DatePipe,
    RouterModule,
    ButtonComponent,
    PopupComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <default-layout>
      @if (task) {
      <div
        class="p-6 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-100 dark:border-neutral-900 shadow-sm grid gap-6"
      >
        <header class="flex justify-between items-center gap-6">
          <div>
            <h1
              class="text-3xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {{ task.name }}
            </h1>
            <p class="text-neutral-700 dark:text-neutral-300">
              {{ task.description || 'No description provided.' }}
            </p>
          </div>
          <ui-button
            label="Delete Task"
            icon="fi fi-rr-trash"
            variant="danger"
            (click)="showPopup('deleteTask', task.id)"
          />
        </header>
        <div class="grid gap-6">
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </section>
          <div class="grid gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2 grid gap-6">
              <section class="grid gap-6">
                <header class="flex items-center gap-4">
                  <h2
                    class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    Assignee
                  </h2>
                  <ui-button
                    label="{{
                      task.assignee ? 'Change Assignee' : 'Assign Member'
                    }}"
                    icon="{{
                      task.assignee ? 'fi fi-rr-user-pen' : 'fi fi-rr-user-add'
                    }}"
                    (click)="showPopup('addAssignee', task.id)"
                  />
                  @if (task.assignee) {
                  <ui-button
                    label="Remove Assignee"
                    icon="fi fi-rr-trash"
                    variant="danger"
                    (click)="showPopup('deleteAssignee', task.id)"
                  />
                  }
                </header>
                <div
                  class="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm grid gap-4"
                >
                  @if (task.assignee) {
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      Username
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.assignee.username }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      Email
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.assignee.email }}
                    </p>
                  </div>
                  } @else {
                  <p class="text-neutral-600 dark:text-neutral-400">
                    No assignee assigned to this task.
                  </p>
                  }
                </div>
              </section>
              <section class="grid gap-6">
                <header class="flex items-center gap-4">
                  <h2
                    class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    Project
                  </h2>
                  <ui-button
                    label="Go to Project"
                    icon="fi fi-rr-door-open"
                    (click)="goToProject(task.project.id)"
                  />
                </header>
                <div
                  class="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm grid gap-4"
                >
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      Project Name
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.project.name }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      Project Description
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{
                        task.project.description || 'No description provided.'
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      Start Date
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.project.startDate | date : 'longDate' }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      End Date
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{
                        task.project.endDate
                          ? (task.project.endDate | date : 'longDate')
                          : 'Ongoing'
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      Project Status
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.project.status.name }}
                    </p>
                  </div>
                </div>
              </section>
            </div>
            <div>
              <section class="grid gap-6">
                <header class="flex items-center gap-4">
                  <h2
                    class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    Task History
                  </h2>
                </header>
                @if (task.taskHistory.length > 0) {
                <div class="grid gap-6">
                  @for (history of task.taskHistory; track history.id) {
                  <div
                    class="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm grid gap-4"
                  >
                    <header class="truncate">
                      <h4
                        class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                      >
                        {{ history.name }}
                      </h4>
                      <p
                        class="text-sm text-neutral-700 dark:text-neutral-300 truncate"
                      >
                        {{ history.description || 'No description provided.' }}
                      </p>
                    </header>
                    <div>
                      <p class="text-sm">
                        <strong class="text-neutral-900 dark:text-neutral-100"
                          >Date:</strong
                        >
                        <span class="text-neutral-700 dark:text-neutral-400">
                          {{ history.date | date : 'longDate' }}
                        </span>
                      </p>
                    </div>
                  </div>
                  }
                </div>
                } @else {
                <p class="text-neutral-600 dark:text-neutral-400">
                  No history available for this task.
                </p>
                }
              </section>
            </div>
          </div>
        </div>
      </div>
      } @else {
      <p class="text-neutral-600 dark:text-neutral-400">
        Task not found. Redirecting...
      </p>
      }
    </default-layout>

    @switch (activePopup()) { @case ('deleteTask') {
    <ui-popup title="Delete Task" (close)="hidePopup()">
      Are you sure you want to delete this task?
      <ui-button label="Confirm" (click)="deleteTask()" />
    </ui-popup>
    } @case ('addAssignee') {
    <ui-popup title="Assign Member" (close)="hidePopup()">
      <!-- Assign member form goes here -->
    </ui-popup>
    } }
  `,
})
export class TaskComponent {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  task: TaskDetails | null = null;

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.task = await this.taskService.getTaskDetails(this.id);
    if (!this.task) this.router.navigate(['/tasks']);
  }

  showPopup(popupType: PopupType, id?: number): void {
    this.activePopup.set(popupType);
    if (id) this.activeId.set(id);
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeId.set(null);
  }

  deleteTask(): void {
    if (this.task) {
      this.taskService.deleteTask(this.task.id).then(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }
}
