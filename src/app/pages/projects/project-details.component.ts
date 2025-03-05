import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddProjectMemberPopupComponent } from '../../shared/components/popups/add-project-members-popup.component';
import { AddTaskPopupComponent } from "../../shared/components/popups/add-task-popup.component";
import { DeleteProjectMemberPopupComponent } from '../../shared/components/popups/delete-project-member-popup.component';
import { DeleteProjectPopupComponent } from '../../shared/components/popups/delete-project-popup.component';
import { DeleteTaskPopupComponent } from "../../shared/components/popups/delete-task-popup.component";
import { ToastService } from '../../shared/components/toast/toast.service';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { PopupComponent } from '../../shared/components/ui/popup.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { GetProjectDetailsResponse } from '../../shared/models/Projects/GetProjectDetailsResponse';
import { GetProjectMemberResponse } from '../../shared/models/Projects/GetProjectMemberResponse';
import { GetTaskResponse } from '../../shared/models/Tasks/GetTaskResponse';
import { ProjectService } from '../../shared/services/data/project.service';
import { RoleService } from '../../shared/services/data/role.service';
import { UserService } from '../../shared/services/data/user.service';

type PopupType =
  | 'deleteProject'
  | 'addMember'
  | 'deleteMember'
  | 'assignTask'
  | 'addTask'
  | 'deleteTask'
  | 'assignMember';

@Component({
  imports: [
    DefaultLayoutComponent,
    DatePipe,
    RouterModule,
    ButtonComponent,
    PopupComponent,
    DeleteProjectPopupComponent,
    DeleteProjectMemberPopupComponent,
    AddProjectMemberPopupComponent,
    TranslatorPipe,
    AddTaskPopupComponent,
    DeleteTaskPopupComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <pmt-default-layout
      title="
      {{ project() ? project()!.name : ('project.loading' | translate) }}
    "
    >
      @if (project(); as project) {
      <div class="project-details">
        <div class="project-details__card">
          <header class="project-details__header">
            <div class="project-details__title-group">
              <h1 class="project-details__title">
                {{ project.name }}
              </h1>
              <p class="project-details__description">
                {{ project.description || ('project.noDescription' | translate) }}
              </p>
            </div>
            @if (project.permissions.deleteProject) {
            <ui-button
              [label]="'project.deleteProject' | translate"
              icon="fi fi-rr-trash"
              variant="danger"
              (click)="showPopup('deleteProject', project.id)"
              aria-label="Delete project"
            />
            }
          </header>
          <div class="project-details__content" role="main">
            <section class="project-details__info-grid" aria-labelledby="project-info-title">
              <h2 id="project-info-title" class="visually-hidden">Project Information</h2>
              <div class="project-details__info-item">
                <p class="project-details__info-label">
                  {{ 'project.status' | translate }}
                </p>
                <p class="project-details__info-value">
                  {{ project.status.name }}
                </p>
              </div>
              <div class="project-details__info-item">
                <p class="project-details__info-label">
                  {{ 'project.startDate' | translate }}
                </p>
                <p class="project-details__info-value">
                  {{ project.startDate | date : 'longDate' }}
                </p>
              </div>
              @if (project.endDate) {
              <div class="project-details__info-item">
                <p class="project-details__info-label">
                  {{ 'project.endDate' | translate }}
                </p>
                <p class="project-details__info-value">
                  {{ project.endDate | date : 'longDate' }}
                </p>
              </div>
              }
            </section>

            <section class="project-details__section">
              <header class="project-details__section-header">
                <h2 class="project-details__section-title">
                  {{ 'project.members' | translate }}
                </h2>
                @if (project.permissions.addMember) {
                <ui-button
                  [label]="'project.addMember' | translate"
                  icon="fi fi-rr-user-add"
                  (click)="showPopup('addMember', project.id)"
                  [attr.aria-label]="'Add new project member'"
                />
                }
              </header>
              @if (project.projectMembers.length > 0) {
              <div class="project-details__members-grid" role="list">
                @for (member of project.projectMembers; track member.user.id) {
                <div class="project-details__member-card" role="listitem">
                  <header class="project-details__member-header">
                    <h4 class="project-details__member-title">
                      {{ member.user.username }}
                    </h4>
                  </header>
                  <div class="project-details__member-info">
                    <p class="project-details__member-text">
                      <strong class="project-details__member-label">
                        {{ 'project.email' | translate }}:
                      </strong>
                      <span class="project-details__member-value">
                        {{ member.user.email }}
                      </span>
                    </p>
                    <p class="project-details__member-text">
                      <strong class="project-details__member-label">
                        {{ 'project.role' | translate }}:
                      </strong>
                      <span class="project-details__member-value">
                        {{ member.role.name }}
                      </span>
                    </p>
                  </div>
                  <footer class="project-details__member-actions">
                    @if (project.permissions.assignTask) {
                    <ui-button
                      [label]="'project.assignTask' | translate"
                      [iconOnly]="true"
                      icon="fi fi-rr-link-horizontal"
                      (click)="showPopup('assignTask', member.user.id)"
                      [attr.aria-label]="'Assign task to ' + member.user.username"
                    />
                    } @if (project.permissions.deleteMember && member.role.id !== 1) {
                    <ui-button
                      [label]="'project.removeMember' | translate"
                      [iconOnly]="true"
                      variant="danger"
                      icon="fi fi-rr-trash"
                      (click)="showPopup('deleteMember', member.user.id)"
                      [attr.aria-label]="'Remove ' + member.user.username + ' from project'"
                    />
                    }
                  </footer>
                </div>
                }
              </div>
              } @else {
              <p class="project-details__empty-text" role="status">
                {{ 'project.noMembers' | translate }}
              </p>
              }
            </section>

            <section class="project-details__section" aria-labelledby="tasks-title">
              <header class="project-details__section-header">
                <h2 id="tasks-title" class="project-details__section-title">
                  {{ 'project.tasks' | translate }}
                </h2>
                @if (project.permissions.addTask) {
                <ui-button
                  [label]="'project.addTask' | translate"
                  icon="fi fi-rr-square-plus"
                  (click)="showPopup('addTask', project.id)"
                  [attr.aria-label]="'Add new task to project'"
                />
                }
              </header>
              @if (project.tasks.length > 0) {
              <div class="project-details__tasks-grid" role="list">
                @for (task of project.tasks; track task.id) {
                <div class="project-details__task-card" role="listitem">
                  <header class="project-details__task-header">
                    <h4 class="project-details__task-title">
                      {{ task.name }}
                    </h4>
                    <p class="project-details__task-description">
                      {{ task.description || ('project.noDescription' | translate) }}
                    </p>
                  </header>
                  <div class="project-details__task-info">
                    <p class="project-details__task-text">
                      <strong class="project-details__task-label">
                        {{ 'project.dueDate' | translate }}:
                      </strong>
                      <span class="project-details__task-value">
                        {{ task.dueDate | date : 'longDate' }}
                      </span>
                    </p>
                    <p class="project-details__task-text">
                      <strong class="project-details__task-label">
                        {{ 'project.assignedTo' | translate }}:
                      </strong>
                      @if (getAssignee(task.assigneeId); as assignee) {
                      <span class="project-details__task-value">
                        {{ assignee.user.username }}
                      </span>
                      } @else {
                      <span class="project-details__task-value">
                        {{ 'project.unassigned' | translate }}
                      </span>
                      }
                    </p>
                    <p class="project-details__task-text">
                      <strong class="project-details__task-label">
                        {{ 'project.priority' | translate }}:
                      </strong>
                      <span class="project-details__task-value">
                        {{ task.priority }}
                      </span>
                    </p>
                    <p class="project-details__task-text">
                      <strong class="project-details__task-label">
                        {{ 'project.status' | translate }}:
                      </strong>
                      <span class="project-details__task-value">
                        {{ task.status.name }}
                      </span>
                    </p>
                  </div>
                  <footer class="project-details__task-actions">
                    <ui-button
                      [label]="'project.goToTask' | translate"
                      [iconOnly]="true"
                      icon="fi fi-rr-door-open"
                      (click)="goToTask(task.id)"
                      [attr.aria-label]="'View details for task ' + task.name"
                    />
                    @if (project.permissions.assignMember) {
                    <ui-button
                      [label]="'project.assignMember' | translate"
                      [iconOnly]="true"
                      icon="fi fi-rr-link-horizontal"
                      (click)="showPopup('assignMember', task.id)"
                      [attr.aria-label]="'Assign member to task ' + task.name"
                    />
                    } @if (project.permissions.deleteTask) {
                    <ui-button
                      [label]="'project.deleteTask' | translate"
                      [iconOnly]="true"
                      variant="danger"
                      icon="fi fi-rr-trash"
                      (click)="showPopup('deleteTask', task.id)"
                      [attr.aria-label]="'Delete task ' + task.name"
                    />
                    }
                  </footer>
                </div>
                }
              </div>
              } @else {
              <p class="project-details__empty-text" role="status">
                {{ 'project.noTasks' | translate }}
              </p>
              }
            </section>
          </div>
        </div>

        @switch (activePopup()) { @case ('deleteProject') {
        <pmt-delete-project-popup
          [projectId]="activeId()!"
          (onClose)="hidePopup()"
          (onDeleteProject)="redirectToProjects()"
        />
        } @case ('addMember') {
        <pmt-add-project-member-popup
          [projectId]="activeId()!"
          (onClose)="hidePopup()"
          (onAddMember)="addMember($event)"
        />
        } @case ('assignTask') {
        <ui-popup
          [title]="'project.assignTask' | translate"
          (onClose)="hidePopup()"
        >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </ui-popup>
        } @case ('deleteMember') {
        <pmt-delete-project-member-popup
          [projectMemberIds]="{ projectId: project.id, userId: activeId()! }"
          (onClose)="hidePopup()"
          (onDeleteMember)="deleteMember($event)"
        />
        } @case ('addTask') {
        <pmt-add-task-popup (onClose)="hidePopup()" (onAddTask)="addTask($event)" [projectId]="activeId()!"/>
        } @case ('assignMember') {
        <ui-popup
          [title]="'project.assignMember' | translate"
          (onClose)="hidePopup()"
        >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </ui-popup>
        } @case ('deleteTask') {
        <pmt-delete-task-popup [taskId]="activeId()!" (onClose)="hidePopup()" (onDeleteTask)="deleteTask($event)"/>
        } }
      </div>
      } @else {
      <p class="project-details__empty-text">
        {{ 'project.notFound' | translate }}
      </p>
      }
    </pmt-default-layout>
  `,
  styles: [`
    .project-details {
      padding: var(--space-4);
      background-color: var(--surface-1);
    }

    .project-details__card {
      padding: var(--space-6);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      border: var(--border-width) solid var(--border-color);
      box-shadow: var(--shadow-sm);
      display: grid;
      gap: var(--space-6);
    }

    .project-details__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-4);
    }

    .project-details__title-group {
      flex: 1;
    }

    .project-details__title {
      margin-bottom: var(--space-2);
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-color);
    }

    .project-details__description {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .project-details__content {
      display: grid;
      gap: var(--space-6);
    }

    .project-details__info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
      padding: var(--space-4);
      background-color: var(--surface-3);
      border-radius: var(--border-radius-md);
    }

    .project-details__info-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .project-details__info-label {
      color: var(--text-color-secondary);
      font-size: var(--font-size-base);
      font-weight: 500;
    }
    
    .project-details__info-value {
      color: var(--text-color);
      font-size: var(--font-size-sm);
    }

    .project-details__section {
      display: grid;
      gap: var(--space-4);
    }

    .project-details__section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .project-details__section-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-color);
    }

    .project-details__members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-4);
    }

    .project-details__member-card {
      padding: var(--space-4);
      background-color: var(--surface-3);
      border-radius: var(--border-radius-md);
      display: grid;
      gap: var(--space-4);
    }

    .project-details__member-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .project-details__member-title {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--text-color);
    }

    .project-details__member-info {
      display: grid;
      gap: var(--space-2);
    }

    .project-details__member-text {
      display: flex;
      gap: var(--space-2);
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .project-details__member-label {
      color: var(--text-color);
      font-weight: 500;
    }

    .project-details__member-value {
      color: var(--text-color);
    }

    .project-details__member-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }

    .project-details__tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-4);
    }

    .project-details__task-card {
      padding: var(--space-4);
      background-color: var(--surface-3);
      border-radius: var(--border-radius-md);
      display: grid;
      gap: var(--space-4);
    }

    .project-details__task-header {
      display: grid;
      gap: var(--space-1);
    }

    .project-details__task-title {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--text-color);
    }

    .project-details__task-description {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .project-details__task-info {
      display: grid;
      gap: var(--space-2);
    }

    .project-details__task-text {
      display: flex;
      gap: var(--space-2);
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
    }

    .project-details__task-label {
      color: var(--text-color);
      font-weight: 500;
    }

    .project-details__task-value {
      color: var(--text-color);
    }

    .project-details__task-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }

    .project-details__empty-text {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
      text-align: center;
      padding: var(--space-4);
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
export class ProjectDetailsComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  readonly project = signal<GetProjectDetailsResponse | null>(null);

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.project.set(await this.projectService.getProjectDetails(this.id));
    if (!this.project()) {
      this.toastService.showToast(
        {
          title: 'Project not found',
          type: 'error',
          message: 'The project you are looking for does not exist.',
          duration: 5000,
        },
        'root'
      );
      this.router.navigate(['/projects']);
    }
  }

  showPopup(popupType: PopupType, id?: number): void {
    this.activePopup.set(popupType);
    if (id) this.activeId.set(id);
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeId.set(null);
  }

  goToTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  redirectToProjects(): void {
    this.router.navigate(['/projects']);
  }

  deleteMember(projectMember: GetProjectMemberResponse | null): void {
    if (!projectMember) return;

    this.project.update((project) => {
      project?.projectMembers.splice(
        project.projectMembers.findIndex(
          (member) => member.user.id === projectMember.userId
        ),
        1
      );
      return project;
    });
  }

  async addMember(member: GetProjectMemberResponse | null): Promise<void> {
    if (!member) return;

    const user = await this.userService.getUser(member.userId);
    if (!user) return;
    const role = await this.roleService.getRole(member.roleId);
    if (!role) return;

    this.project.update((project) => {
      project?.projectMembers.push({
        ...member,
        user,
        role,
        projectId: project.id,
      });
      return project;
    });
  }

  async addTask(task: GetTaskResponse | null): Promise<void> {
    if (!task) return;

    const assignee = await this.userService.getUser(task.assigneeId);
    if (!assignee) return;

    this.project.update((project) => {
      project?.tasks.push({
        ...task,
        assigneeId: assignee.id,
        status: { id: 1, name: 'Non commencé' },
        description: task.description,
      });
      return project;
    });
  }

  async deleteTask(taskId: number): Promise<void> {
    if (!taskId) return;

    this.project.update((project) => {
      project?.tasks.splice(
        project.tasks.findIndex((t) => t.id === taskId),
        1
      );
      return project;
    });
  }

  getAssignee(taskId: number): GetProjectDetailsResponse['projectMembers'][0] | null {
    return this.project()?.projectMembers.find(
      (member) => member.user.id === taskId
    ) ?? null;
  }
}
