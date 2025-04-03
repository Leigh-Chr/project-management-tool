import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskDetails } from '@app/shared/models/task.models';
import { AuthService } from '@app/shared/services/auth.service';
import { ProjectService } from '@app/shared/services/data/project.service';
import { map } from 'rxjs';
import { DeleteTaskPopupComponent } from '../../shared/components/popups/delete-task-popup.component';
import { PatchTaskPopupComponent } from '../../shared/components/popups/patch-task-popup.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { TaskService } from '../../shared/services/data/task.service';
type PopupType = 'deleteTask' | 'patchTask';

@Component({
  imports: [
    DefaultLayoutComponent,
    DatePipe,
    RouterModule,
    DeleteTaskPopupComponent,
    PatchTaskPopupComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <pmt-default-layout pageTitle="{{ task() ? task()!.name : 'Loading...' }}">
      @if (task(); as task) {
      <div class="flex flex-col gap-4">
        <header class="flex gap-4 items-center">
          <div>
            <h1>
              {{ task.name }}
            </h1>
            <p>
              {{ task.description || 'No description provided.' }}
            </p>
          </div>
          @if (!isObserver()) {
          <button
            class="btn btn--danger"
            (click)="showPopup('deleteTask', task.id)"
          >
            <i class="fi fi-rr-trash"></i>
          </button>
          <button
            class="btn btn--primary"
            (click)="showPopup('patchTask', task.id)"
          >
            <i class="fi fi-rr-pencil"></i>
          </button>
          }
        </header>
        <div class="flex flex-col gap-4">
          <section class="flex flex-col gap-4">
            <h2>Task Information</h2>
            <div class="flex flex-wrap gap-4">
              <div class="card">
                <h4>Status</h4>
                <p>
                  {{ task.status }}
                </p>
              </div>
              <div class="card">
                <h4>Due Date</h4>
                <p>
                  {{ (task.dueDate | date : 'longDate') || 'No due date' }}
                </p>
              </div>
              <div class="card">
                <h4>Priority</h4>
                <p>
                  {{ task.priority || 'No priority' }}
                </p>
              </div>
            </div>
          </section>
          <div class="flex flex-col gap-4">
            <section class="flex flex-col gap-4">
              <header class="flex gap-4">
                <h2>Assignee</h2>
              </header>
              <div class="flex flex-wrap gap-4">
                @if (task.assignee; as assignee) {
                <div class="card">
                  <h4>Username</h4>
                  <p>
                    {{ assignee.username }}
                  </p>
                </div>
                <div class="card">
                  <h4>Email</h4>
                  <p>
                    {{ assignee.email }}
                  </p>
                </div>
                <div class="card">
                  <h4>Role</h4>
                  <p>
                    {{ assignee.role }}
                  </p>
                </div>
                } @else {
                <p>No Assignee</p>
                }
              </div>
            </section>
            <section class="flex flex-col gap-4">
              <header class="flex gap-4">
                <h2>Project</h2>
                <button
                  class="btn btn--primary"
                  (click)="goToProject(task.project.id)"
                >
                  <i class="fi fi-rr-door-open"></i>
                </button>
              </header>
              <div class="flex flex-wrap gap-4">
                <div class="card">
                  <h4>Project Name</h4>
                  <p>
                    {{ task.project.name }}
                  </p>
                </div>
                @if (task.project.description) {
                <div class="card">
                  <h4>Project Description</h4>
                  <p>
                    {{ task.project.description }}
                  </p>
                </div>
                } @if (task.project.startDate) {
                <div class="card">
                  <h4>Start Date</h4>
                  <p>
                    {{ task.project.startDate }}
                  </p>
                </div>
                } @if (task.project.endDate) {
                <div class="card">
                  <h4>End Date</h4>
                  <p>
                    {{ task.project.endDate }}
                  </p>
                </div>
                }
                <div class="card">
                  <h4>Project Status</h4>
                  <p>
                    {{ task.project.status }}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      } @else {
      <p>Task Not Found</p>
      }
    </pmt-default-layout>

    @switch (activePopup()) { @case ('deleteTask') {
    <pmt-delete-task-popup [taskId]="activeId()!" (onClose)="hidePopup()" />
    } @case ('patchTask') {
    <pmt-patch-task-popup [task]="task()!" (onClose)="hidePopup()" />
    } }
  `,
})
export class TaskDetailsComponent {
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly id: number = Number.parseInt(this.route.snapshot.params['id']);
  readonly task = signal<TaskDetails | null>(null);
  readonly isObserver = computed(() => this.task()?.myRole === 'Observer');
  readonly currentUser = computed(() => this.authService.authUser()?.username);

  readonly activeId = signal<number | null>(null);
  readonly activePopup = signal<PopupType | null>(null);

  constructor() {
    const task = toSignal(
      this.taskService.getTaskDetails(this.id).pipe(map((task) => task ?? null))
    );
    effect(() => {
      this.task.set(task() ?? null);
    });

    effect(() => {
      const patchedTask = this.taskService.patchedTask();
      if (!patchedTask) {return;}
      this.task.set(patchedTask);
    });

    effect(() => {
      const deletedTask = this.taskService.deletedTask();
      if (!deletedTask) {return;}

      untracked(() => {
        if (deletedTask === this.id) {
          this.router.navigate(['/projects', this.task()?.project.id]);
        }
      });
    });

    effect(() => {
      const deletedProject = this.projectService.deletedProject();
      if (!deletedProject) {return;}

      untracked(() => {
        const task = this.task();
        if (!task) {return;}
        if (deletedProject === task.project.id) {
          this.router.navigate(['/projects']);
        }
      });
    });
  }

  showPopup(popupType: PopupType, id?: number): void {
    this.activePopup.set(popupType);
    if (id) {this.activeId.set(id);}
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeId.set(null);
    this.taskService.patchedTask.set(null);
    this.taskService.deletedTask.set(null);
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  redirectToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
