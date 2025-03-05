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
import { GetTaskDetailsResponse, User } from '../../shared/models/Tasks/GetTaskDetailsResponse';
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
      <div class="task-details">
        <div class="task-details__card">
          <header class="task-details__header">
            <div class="task-details__title-group">
              <h1 class="task-details__title">
                {{ task.name }}
              </h1>
              <p class="task-details__description">
                {{ task.description || 'No description provided.' }}
              </p>
            </div>
            @if (task.permissions.editTask) {
            <ui-button
              [label]="'task.deleteTask' | translate"
              icon="fi fi-rr-trash"
              variant="danger"
              (click)="showPopup('deleteTask', task.id)"
              aria-label="Delete task"
            />
            }
          </header>
          <div class="task-details__content" role="main">
            <section class="task-details__info-grid" aria-labelledby="task-info-title">
              <h2 id="task-info-title" class="visually-hidden">Task Information</h2>
              <div class="task-details__info-item">
                <p class="task-details__info-label">
                  {{ 'task.status' | translate }}
                </p>
                <p class="task-details__info-value">
                  {{ task.status?.name }}
                </p>
              </div>
              <div class="task-details__info-item">
                <p class="task-details__info-label">
                  {{ 'task.dueDate' | translate }}
                </p>
                <p class="task-details__info-value">
                  {{ task.dueDate | date : 'longDate' }}
                </p>
              </div>
              <div class="task-details__info-item">
                <p class="task-details__info-label">
                  {{ 'task.priority' | translate }}
                </p>
                <p class="task-details__info-value">
                  {{ task.priority }}
                </p>
              </div>
            </section>
            <div class="task-details__main-content">
              <div class="task-details__primary-section">
                <section class="task-details__section">
                  <header class="task-details__section-header">
                    <h2 class="task-details__section-title">
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
                  <div class="task-details__info-card">
                    @if (task.assignee) {
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.username' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.assignee.username }}
                      </p>
                    </div>
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.email' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.assignee.email }}
                      </p>
                    </div>
                    } @else {
                    <p class="task-details__empty-text">
                      {{ 'task.noAssignee' | translate }}
                    </p>
                    }
                  </div>
                </section>
                <section class="task-details__section">
                  <header class="task-details__section-header">
                    <h2 class="task-details__section-title">
                      {{ 'task.project' | translate }}
                    </h2>
                    <ui-button
                      [label]="'task.goToProject' | translate"
                      icon="fi fi-rr-door-open"
                      (click)="goToProject(task.project.id)"
                    />
                  </header>
                  <div class="task-details__info-card">
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.projectName' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.project.name }}
                      </p>
                    </div>
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.projectDescription' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.project.description || 'No description provided.' }}
                      </p>
                    </div>
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.startDate' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.project.startDate | date : 'longDate' }}
                      </p>
                    </div>
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.endDate' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.project.endDate ? (task.project.endDate | date : 'longDate') : ('task.ongoing' | translate) }}
                      </p>
                    </div>
                    <div class="task-details__info-item">
                      <p class="task-details__info-label">
                        {{ 'task.projectStatus' | translate }}
                      </p>
                      <p class="task-details__info-value">
                        {{ task.project.status?.name }}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
              <div class="task-details__secondary-section">
                <section class="task-details__section">
                  <header class="task-details__section-header">
                    <h2 class="task-details__section-title">
                      {{ 'task.taskHistory' | translate }}
                    </h2>
                  </header>
                  @if (task.taskHistory.length > 0) {
                  <div class="task-details__history-list">
                    @for (history of task.taskHistory; track history.id) {
                    <div class="task-details__history-item">
                      <header class="task-details__history-header">
                        <h4 class="task-details__history-title">
                          {{ history.name }}
                        </h4>
                        <p class="task-details__history-description">
                          {{ history.description || 'No description provided.' }}
                        </p>
                      </header>
                      <div class="task-details__history-content">
                        <p class="task-details__history-text">
                          <strong class="task-details__history-label">{{ 'task.date' | translate }}:</strong>
                          <span class="task-details__history-value">
                            {{ history.date | date : 'longDate' }}
                          </span>
                        </p>
                      </div>
                    </div>
                    }
                  </div>
                  } @else {
                  <p class="task-details__empty-text">
                    {{ 'task.noHistory' | translate }}
                  </p>
                  }
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      } @else {
      <p class="task-details__empty-text">
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
  styles: [`
    .task-details {
      padding: var(--space-4);
      background-color: var(--surface-1);
    }

    .task-details__card {
      padding: var(--space-6);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      border: var(--border-width) solid var(--border-color);
      box-shadow: var(--shadow-sm);
      display: grid;
      gap: var(--space-6);
    }

    .task-details__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-4);
    }

    .task-details__title-group {
      flex: 1;
    }

    .task-details__title {
      margin-bottom: var(--space-2);
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-color);
    }

    .task-details__description {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .task-details__content {
      display: grid;
      gap: var(--space-6);
    }

    .task-details__info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
      padding: var(--space-4);
      background-color: var(--surface-3);
      border-radius: var(--border-radius-md);
    }

    .task-details__info-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .task-details__info-label {
      color: var(--text-color-secondary);
      font-size: var(--font-size-base);
      font-weight: 500;
    }
    
    .task-details__info-value {
      color: var(--text-color);
      font-size: var(--font-size-sm);
    }

    .task-details__main-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-6);
    }

    .task-details__primary-section {
      display: grid;
      gap: var(--space-6);
    }

    .task-details__secondary-section {
      display: grid;
      gap: var(--space-6);
    }

    .task-details__section {
      display: grid;
      gap: var(--space-4);
    }

    .task-details__section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .task-details__section-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-color);
    }

    .task-details__info-card {
      padding: var(--space-4);
      background-color: var(--surface-3);
      border-radius: var(--border-radius-md);
      display: grid;
      gap: var(--space-4);
    }

    .task-details__empty-text {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
      text-align: center;
      padding: var(--space-4);
    }

    .task-details__history-list {
      display: grid;
      gap: var(--space-4);
    }

    .task-details__history-item {
      padding: var(--space-4);
      background-color: var(--surface-3);
      border-radius: var(--border-radius-md);
      display: grid;
      gap: var(--space-2);
    }

    .task-details__history-header {
      display: grid;
      gap: var(--space-1);
    }

    .task-details__history-title {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--text-color);
    }

    .task-details__history-description {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .task-details__history-content {
      display: grid;
      gap: var(--space-2);
    }

    .task-details__history-text {
      display: flex;
      gap: var(--space-2);
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .task-details__history-label {
      color: var(--text-color);
      font-weight: 500;
    }

    .task-details__history-value {
      color: var(--text-color);
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `],
})
export class TaskDetailsComponent {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  readonly task = signal<GetTaskDetailsResponse | null>(null);

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
      if (!task) return task;
      task.assignee = assignee;
      return task;
    });
  }
}
