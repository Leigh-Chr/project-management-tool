import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeleteTaskPopupComponent } from "../../shared/components/popups/delete-task-popup.component";
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TaskDetailsResponse, User } from '../../shared/models/Tasks/TaskDetailsResponse';
import { TaskService } from '../../shared/services/data/task.service';
import { ChangeAssigneePopupComponent } from '../../shared/components/popups/change-assignee-popup.component';

type PopupType = 'deleteTask' | 'changeAssignee';

@Component({
  imports: [
    DefaultLayoutComponent,
    DatePipe,
    RouterModule,
    ButtonComponent,
    TranslatorPipe,
    DeleteTaskPopupComponent,
    ChangeAssigneePopupComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <pmt-default-layout
      title="{{ task() ? task()!.name : ('task.loading' | translate) }}"
    >
      @if (task(); as task) {
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
          @if (task.permissions.editTask) {
          <ui-button
            [label]="'task.deleteTask' | translate"
            icon="fi fi-rr-trash"
            variant="danger"
            (click)="showPopup('deleteTask', task.id)"
          />
          }
        </header>
        <div class="grid gap-6">
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                {{ 'task.status' | translate }}
              </p>
              <p class="text-lg text-neutral-900 dark:text-neutral-100">
                {{ task.status.name }}
              </p>
            </div>
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                {{ 'task.dueDate' | translate }}
              </p>
              <p class="text-lg text-neutral-900 dark:text-neutral-100">
                {{ task.dueDate | date : 'longDate' }}
              </p>
            </div>
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                {{ 'task.priority' | translate }}
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
                    {{ 'task.assignee' | translate }}
                  </h2>
                  @if (task.permissions.editTask) {
                  @if (task.assignee) {
                    <ui-button
                      [label]="'task.changeAssignee' | translate"
                      icon="fi fi-rr-user-pen"
                      (click)="showPopup('changeAssignee', task.id)"
                    />
                  }
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
                      {{ 'task.username' | translate }}
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.assignee.username }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {{ 'task.email' | translate }}
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.assignee.email }}
                    </p>
                  </div>
                  } @else {
                  <p class="text-neutral-600 dark:text-neutral-400">
                    {{ 'task.noAssignee' | translate }}
                  </p>
                  }
                </div>
              </section>
              <section class="grid gap-6">
                <header class="flex items-center gap-4">
                  <h2
                    class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    {{ 'task.project' | translate }}
                  </h2>
                  <ui-button
                    [label]="'task.goToProject' | translate"
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
                      {{ 'task.projectName' | translate }}
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.project.name }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {{ 'task.projectDescription' | translate }}
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
                      {{ 'task.startDate' | translate }}
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{ task.project.startDate | date : 'longDate' }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {{ 'task.endDate' | translate }}
                    </p>
                    <p class="text-lg text-neutral-900 dark:text-neutral-100">
                      {{
                        task.project.endDate
                          ? (task.project.endDate | date : 'longDate')
                          : ('task.ongoing' | translate)
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {{ 'task.projectStatus' | translate }}
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
                    {{ 'task.taskHistory' | translate }}
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
                          >{{ 'task.date' | translate }}:</strong
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
                  {{ 'task.noHistory' | translate }}
                </p>
                }
              </section>
            </div>
          </div>
        </div>
      </div>
      } @else {
      <p class="text-neutral-600 dark:text-neutral-400">
        {{ 'task.taskNotFound' | translate }}
      </p>
      }
    </pmt-default-layout>

    @switch (activePopup()) { @case ('deleteTask') {
    <pmt-delete-task-popup [taskId]="activeId()!" (close)="hidePopup()" 
    (onClose)="hidePopup()"
    (onDeleteTask)="redirectToTasks()"
    />
    } @case ('changeAssignee') {
    <pmt-change-assignee-popup [taskId]="activeId()!" (onClose)="hidePopup()" (onChangeAssignee)="changeAssignee($event)" />
    }}
  `,
})
export class TaskDetailsComponent {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  readonly task = signal<TaskDetailsResponse | null>(null); 

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeId = signal<number | null>(null);


  async ngOnInit(): Promise<void> {
    this.task.set(await this.taskService.getTaskDetails(this.id));
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
    if (!this.task()) return; 
      this.taskService.deleteTask(this.task()!.id).then(() => {
        this.router.navigate(['/tasks']);
      }); 
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  redirectToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  changeAssignee(assignee: User | null): void {
    if (!this.task() || !assignee) return;
    this.task.update((task) => {
      task!.assignee = assignee;
      return task;
    });
    console.log(this.task());
  }
}
