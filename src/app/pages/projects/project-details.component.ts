import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddProjectMemberPopupComponent } from '../../shared/components/popups/add-project-members-popup.component';
import { DeleteProjectMemberPopupComponent } from '../../shared/components/popups/delete-project-member-popup.component';
import { DeleteProjectPopupComponent } from '../../shared/components/popups/delete-project-popup.component';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { PopupComponent } from '../../shared/components/ui/popup.component';
import { TranslatorPipe } from '../../shared/i18n/translator.pipe';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { ProjectDetailsResponse } from '../../shared/models/Projects/ProjectDetailsResponse';
import { ProjectMemberResponse } from '../../shared/models/Projects/ProjectMemberResponse';
import { ProjectService } from '../../shared/services/data/project.service';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pmt-default-layout
      title="
      {{ project ? project.name : ('project.loading' | translate) }}
    "
    >
      @if (project) {
      <div
        class="p-6 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-100 dark:border-neutral-900 shadow-sm grid gap-6"
      >
        <header class="flex justify-between items-center gap-6">
          <div>
            <h1
              class="text-3xl font-bold  text-neutral-900 dark:text-neutral-100"
            >
              {{ project.name }}
            </h1>
            <p class="text-neutral-700 dark:text-neutral-300">
              {{ project.description || ('project.noDescription' | translate) }}
            </p>
          </div>
          @if (project.permissions.deleteProject) {
          <ui-button
            [label]="'project.deleteProject' | translate"
            icon="fi fi-rr-trash"
            variant="danger"
            (click)="showPopup('deleteProject', project.id)"
          />
          }
        </header>
        <div
          class="
        grid gap-6
        "
        >
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                {{ 'project.status' | translate }}
              </p>
              <p class="text-lg text-neutral-900 dark:text-neutral-100">
                {{ project.status.name }}
              </p>
            </div>
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                {{ 'project.startDate' | translate }}
              </p>
              <p class="text-lg text-neutral-900 dark:text-neutral-100">
                {{ project.startDate | date : 'longDate' }}
              </p>
            </div>
            @if (project.endDate) {
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                {{ 'project.endDate' | translate }}
              </p>
              <p class="text-lg text-neutral-900 dark:text-neutral-100">
                {{ project.endDate | date : 'longDate' }}
              </p>
            </div>
            }
          </section>

          <section
            class="
          grid gap-6
          "
          >
            <header class="flex items-center gap-4">
              <h2
                class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ 'project.members' | translate }}
              </h2>
              @if (project.permissions.addMember) {
              <ui-button
                [label]="'project.addMember' | translate"
                icon="fi fi-rr-user-add"
                (click)="showPopup('addMember', project.id)"
              />
              }
            </header>
            @if (project.projectMembers.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (member of project.projectMembers; track member.user.id) {
              <div
                class="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm grid gap-4"
              >
                <header class="truncate">
                  <h4
                    class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    {{ member.user.username }}
                  </h4>
                </header>
                <div>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100">
                      {{ 'project.email' | translate }}:
                    </strong>

                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ member.user.email }}
                    </span>
                  </p>
                  <p class="text-sm ">
                    <strong class="text-neutral-900 dark:text-neutral-100">
                      {{ 'project.role' | translate }}:
                    </strong>
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ member.role.name }}
                    </span>
                  </p>
                </div>
                <footer class="flex gap-1 text-[.75rem]">
                  @if (project.permissions.assignTask) {
                  <ui-button
                    [label]="'project.assignTask' | translate"
                    [iconOnly]="true"
                    icon="fi fi-rr-link-horizontal"
                    (click)="showPopup('assignTask', member.user.id)"
                  />
                  } @if (project.permissions.deleteMember && member.role.id !==
                  1) {
                  <ui-button
                    [label]="'project.removeMember' | translate"
                    [iconOnly]="true"
                    variant="danger"
                    icon="fi fi-rr-trash"
                    (click)="showPopup('deleteMember', member.user.id)"
                  />
                  }
                </footer>
              </div>
              }
            </div>
            } @else {
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ 'project.noMembers' | translate }}
            </p>
            }
          </section>

          <section
            class="
          grid gap-6
          "
          >
            <header class="flex items-center gap-4">
              <h2
                class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ 'project.tasks' | translate }}
              </h2>
              @if (project.permissions.addTask) {
              <ui-button
                [label]="'project.addTask' | translate"
                icon="fi fi-rr-square-plus"
                (click)="showPopup('addTask', project.id)"
              />
              }
            </header>
            @if (project.tasks.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (task of project.tasks; track task.id) {
              <div
                class="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm grid gap-4"
              >
                <header class="truncate">
                  <h4
                    class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    {{ task.name }}
                  </h4>
                  <p
                    class="text-sm text-neutral-700 dark:text-neutral-300 truncate"
                  >
                    {{
                      task.description || ('project.noDescription' | translate)
                    }}
                  </p>
                </header>
                <div>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >{{ 'project.dueDate' | translate }}:</strong
                    >
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.dueDate | date : 'longDate' }}
                    </span>
                  </p>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >{{ 'project.assignedTo' | translate }}:</strong
                    >
                    @if (task.assignee) {
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.assignee.username }}
                    </span>
                    } @else {
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ 'project.unassigned' | translate }}
                    </span>
                    }
                  </p>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >{{ 'project.priority' | translate }}:</strong
                    >
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.priority }}
                    </span>
                  </p>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >{{ 'project.status' | translate }}:</strong
                    >
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.status.name }}
                    </span>
                  </p>
                </div>
                <footer class="flex gap-1 text-[.75rem]">
                  <ui-button
                    [label]="'project.goToTask' | translate"
                    [iconOnly]="true"
                    icon="fi fi-rr-door-open"
                    (click)="goToTask(task.id)"
                  />
                  @if (project.permissions.assignMember) {
                  <ui-button
                    [label]="'project.assignMember' | translate"
                    [iconOnly]="true"
                    icon="fi fi-rr-link-horizontal"
                    (click)="showPopup('assignMember', task.id)"
                  />
                  } @if (project.permissions.deleteTask) {
                  <ui-button
                    [label]="'project.deleteTask' | translate"
                    [iconOnly]="true"
                    variant="danger"
                    icon="fi fi-rr-trash"
                    (click)="showPopup('deleteTask', task.id)"
                  />
                  }
                </footer>
              </div>
              }
            </div>
            } @else {
            <p class="text-neutral-600 dark:text-neutral-400">
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
      <ui-popup [title]="'project.addTask' | translate" (onClose)="hidePopup()">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
      </ui-popup>
      } @case ('assignMember') {
      <ui-popup
        [title]="'project.assignMember' | translate"
        (onClose)="hidePopup()"
      >
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
      </ui-popup>
      } @case ('deleteTask') {
      <ui-popup
        [title]="'project.deleteTask' | translate"
        (onClose)="hidePopup()"
      >
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
      </ui-popup>
      } } } @else {
      <p class="text-neutral-600 dark:text-neutral-400">
        {{ 'project.notFound' | translate }}
      </p>
      }
    </pmt-default-layout>
  `,
})
export class ProjectDetailsComponent {
  private readonly toastService = inject(ToastService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  project: ProjectDetailsResponse | null = null;

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.project = await this.projectService.getProjectDetails(this.id);
    if (!this.project) {
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

  deleteMember(projectMember: ProjectMemberResponse | null): void {
    if (!projectMember) return;
    this.project?.projectMembers.splice(
      this.project.projectMembers.findIndex(
        (member) => member.user.id === projectMember.userId
      ),
      1
    );
  }
}
