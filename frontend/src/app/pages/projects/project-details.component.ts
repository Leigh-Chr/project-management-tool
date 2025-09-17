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
import type { ProjectDetails } from '@app/shared/models/project.models';
import { TaskService } from '@app/shared/services/data/task.service';
import { AddProjectMemberPopupComponent } from '../../shared/components/popups/add-project-members-popup.component';
import { AddTaskPopupComponent } from '../../shared/components/popups/add-task-popup.component';
import { DeleteProjectMemberPopupComponent } from '../../shared/components/popups/delete-project-member-popup.component';
import { DeleteProjectPopupComponent } from '../../shared/components/popups/delete-project-popup.component';
import { DeleteTaskPopupComponent } from '../../shared/components/popups/delete-task-popup.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { AuthService } from '../../shared/services/auth.service';
import { ProjectService } from '../../shared/services/data/project.service';
import { RoleUtils } from '../../shared/utils/role.utils';

type PopupType =
  | 'deleteProject'
  | 'addMember'
  | 'deleteProjectMember'
  | 'addTask'
  | 'deleteTask';

@Component({
  imports: [
    DefaultLayoutComponent,
    DatePipe,
    RouterModule,
    DeleteProjectPopupComponent,
    DeleteProjectMemberPopupComponent,
    AddProjectMemberPopupComponent,
    AddTaskPopupComponent,
    DeleteTaskPopupComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <pmt-default-layout
      pageTitle="{{ project() ? project()!.name : 'Loading...' }}"
    >
      @if (project(); as project) {
      <div class="flex flex-col gap-4">
        <header class="flex gap-4 items-center">
          <div>
            <h1>
              {{ project.name }}
            </h1>
            <p>
              {{ project.description || 'No description provided.' }}
            </p>
          </div>
          @if (RoleUtils.canDelete(project.myRole)) {
          <button
            class="btn btn--danger"
            (click)="showPopup('deleteProject', project.id)"
          >
            <i class="fi fi-rr-trash"></i>
          </button>
          }
        </header>
        <div class="flex flex-col gap-4">
          <section class="flex flex-col gap-4">
            <h2>Project Information</h2>
            <div class="flex flex-wrap gap-4">
              <div class="card">
                <h4>Status</h4>
                <p>
                  {{ project.status }}
                </p>
              </div>
              @if (project.startDate) {
              <div class="card">
                <h4>Start Date</h4>
                <p>
                  {{ project.startDate | date : 'longDate' }}
                </p>
              </div>
              } @if (project.endDate) {
              <div class="card">
                <h4>End Date</h4>
                <p>
                  {{ project.endDate | date : 'longDate' }}
                </p>
              </div>
              }
            </div>
          </section>

          <section class="flex flex-col gap-4">
            <header class="flex gap-4">
              <h2>Members</h2>
              @if (RoleUtils.canManageMembers(project.myRole)) {
              <button
                class="btn btn--primary"
                (click)="showPopup('addMember', project.id)"
              >
                <i class="fi fi-rr-user-add"></i>
              </button>
              }
            </header>
            @if (project.projectMembers.length > 0) {
            <div class="flex gap-4 flex-wrap">
              @for (member of project.projectMembers; track member.id) {
              <div class="card flex flex-col gap-2">
                <h4>
                  {{ member.username }}
                  @if (member.username === currentUser()) { (You) }
                </h4>
                <div>
                  <p>
                    <strong class="label"> Role: </strong>
                    <span>
                      {{ member.role }}
                    </span>
                  </p>
                  <p>
                    <strong class="label"> Email: </strong>
                    <span>
                      {{ member.email }}
                    </span>
                  </p>
                </div>
                <footer class="flex gap-2">
                  @if (RoleUtils.canManageMembers(project.myRole)) {
                  <button
                    class="btn btn--danger w-full"
                    (click)="showPopup('deleteProjectMember', member.id)"
                  >
                    <i class="fi fi-rr-trash"></i>
                  </button>
                  }
                </footer>
              </div>
              }
            </div>
            } @else {
            <p>No members found</p>
            }
          </section>

          <section class="flex flex-col gap-4">
            <header class="flex gap-4">
              <h2>Tasks</h2>
              @if (RoleUtils.canCreateTask(project.myRole)) {
              <button
                class="btn btn--primary"
                (click)="showPopup('addTask', project.id)"
              >
                <i class="fi fi-rr-square-plus"></i>
              </button>
              }
            </header>
            @if (project.tasks.length > 0) {
            <div class="grid">
              @for (status of taskStatuses(); track status) {
              <div class="flex flex-col gap-2">
                <h3 class="text-lg font-semibold">{{ status }}</h3>
                <div class="flex flex-col gap-4">
                  @for (task of project.tasks; track task.id) { @if (task.status
                  === status) {
                  <div class="card flex flex-col gap-2">
                    <h4>
                      {{ task.name }}
                    </h4>
                    <div>
                      <p>
                        <strong class="label"> Due Date: </strong>
                        <span>
                          {{
                            (task.dueDate | date : 'longDate') || 'No due date'
                          }}
                        </span>
                      </p>
                      <p>
                        <strong class="label">Assigned To:</strong>
                        @if (task.assignee) {
                        <span>
                          {{ task.assignee.username }}
                        </span>
                        } @else {
                        <span> Unassigned </span>
                        }
                      </p>
                      <p>
                        <strong class="label"> Priority: </strong>
                        <span>
                          {{ task.priority || 'No priority' }}
                        </span>
                      </p>
                    </div>
                    <footer class="flex gap-2">
                      <button
                        class="btn btn--primary w-full"
                        (click)="goToTask(task.id)"
                      >
                        <i class="fi fi-rr-door-open"></i>
                      </button>
                      @if (RoleUtils.canModify(project.myRole)) {
                      <button
                        class="btn btn--danger w-full"
                        (click)="showPopup('deleteTask', task.id)"
                      >
                        <i class="fi fi-rr-trash"></i>
                      </button>
                      }
                    </footer>
                  </div>
                  } }
                </div>
              </div>
              }
            </div>
            } @else {
            <p>No tasks found</p>
            }
          </section>
        </div>
      </div>

      @switch (activePopup()) { @case ('deleteProject') {
      <pmt-delete-project-popup
        [projectId]="activeId()!"
        (onClose)="hidePopup()"
      />
      } @case ('addMember') { @if (activeId(); as projectId) {
      <pmt-add-project-member-popup
        [projectId]="projectId"
        (onClose)="hidePopup()"
      />
      } } @case ('deleteProjectMember') { @if ( activeId(); as projectMemberId)
      {
      <pmt-delete-project-member-popup
        [projectMemberId]="projectMemberId"
        (onClose)="hidePopup()"
      />
      } } @case ('addTask') {
      <pmt-add-task-popup (onClose)="hidePopup()" [projectId]="activeId()!" />
      } @case ('deleteTask') {
      <pmt-delete-task-popup [taskId]="activeId()!" (onClose)="hidePopup()" />
      } } } @else {
      <p>Project Not Found</p>
      }
    </pmt-default-layout>
  `,
})
export class ProjectDetailsComponent {
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly id: number = Number.parseInt(this.route.snapshot.params['id']);
  readonly project = signal<ProjectDetails | null>(null);

  readonly currentUser = computed(() => this.authService.authUser()?.username);
  
  // Expose RoleUtils to template
  readonly RoleUtils = RoleUtils;
  readonly taskStatuses = computed(() => {
    const statuses = new Set(
      this.project()
        ?.tasks.map((t) => t.status)
        .filter(Boolean) ?? []
    );
    return Array.from(statuses);
  });

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeId = signal<number | null>(null);

  constructor() {
    const projectSignal = toSignal(
      this.projectService.getProjectDetails(this.id)
    );
    
    effect(() => {
      const project = projectSignal();
      if (project === undefined) {
        // Still loading
        return;
      }
      if (project === null) {
        // Project not found or no access
        this.router.navigate(['/projects']);
        return;
      }
      this.project.set(project);
    });

    effect(() => {
      const deletedProject = this.projectService.deletedProject();
      untracked(() => {
        const project = this.project();
        if (!project) {
          return;
        }
        if (deletedProject && deletedProject.id === project.id) {
          this.router.navigate(['/projects']);
        }
      });
    });

    // Effect combiné pour toutes les opérations CRUD - plus efficace
    effect(() => {
      const postedProjectMember = this.projectService.postedProjectMember();
      const deletedProjectMember = this.projectService.deletedProjectMember();
      const postedTask = this.taskService.postedTask();
      const deletedTask = this.taskService.deletedTask();
      
      untracked(() => {
        const project = this.project();
        if (!project) return;
        
        const updatedProject = { ...project };
        let shouldNavigate = false;

      // Gestion des membres
      if (postedProjectMember) {
        updatedProject.projectMembers = [...updatedProject.projectMembers, postedProjectMember.member];
      }
      
      if (deletedProjectMember) {
        updatedProject.projectMembers = updatedProject.projectMembers.filter(
          (pm) => pm.id !== deletedProjectMember.member.id
        );
        updatedProject.tasks = updatedProject.tasks.map((t) => ({
          ...t,
          assignee: t.assignee?.id !== deletedProjectMember.member.id ? t.assignee : undefined,
        }));
        
        if (deletedProjectMember.member.username === this.currentUser()) {
          shouldNavigate = true;
        }
      }

      // Gestion des tâches
      if (postedTask) {
        updatedProject.tasks = [...updatedProject.tasks, postedTask.task];
      }
      
      if (deletedTask) {
        updatedProject.tasks = updatedProject.tasks.filter((task) => task.id !== deletedTask.id);
      }

        // Mise à jour une seule fois si nécessaire
        if (postedProjectMember || deletedProjectMember || postedTask || deletedTask) {
          this.project.set(updatedProject);
          
          // Réinitialiser les signaux immédiatement après la mise à jour
          if (postedProjectMember) {
            this.projectService.postedProjectMember.set(null);
          }
          if (deletedProjectMember) {
            this.projectService.deletedProjectMember.set(null);
          }
          if (postedTask) {
            this.taskService.postedTask.set(null);
          }
          if (deletedTask) {
            this.taskService.deletedTask.set(null);
          }
        }
        
        // Navigation après mise à jour
        if (shouldNavigate) {
          this.router.navigate(['/projects']);
        }
      });
    });
  }

  showPopup(popupType: PopupType, id?: number): void {
    if (id === undefined) {
      return;
    }
    this.activePopup.set(popupType);
    this.activeId.set(id);
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeId.set(null);
    this.projectService.deletedProjectMember.set(null);
    this.projectService.postedProjectMember.set(null);
    this.projectService.postedProject.set(null);
    this.projectService.deletedProject.set(null);
  }

  goToTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }
}
