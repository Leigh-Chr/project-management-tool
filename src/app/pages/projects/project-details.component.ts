import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { PopupComponent } from '../../shared/components/ui/popup.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { ProjectDetails } from '../../shared/models/ProjectDetails';
import { ProjectService } from '../../shared/services/_data/project.service';

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
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <default-layout>
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
              {{ project.description || 'No description provided.' }}
            </p>
          </div>
          <ui-button
            label="Delete Project"
            icon="fi fi-rr-trash"
            variant="danger"
            (click)="showPopup('deleteProject', project.id)"
          />
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
                Status
              </p>
              <p class="text-lg text-neutral-900 dark:text-neutral-100">
                {{ project.status.name }}
              </p>
            </div>
            <div>
              <p
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
              >
                Start Date
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
                End Date
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
                Project Members
              </h2>
              <ui-button
                label="Add Member"
                icon="fi fi-rr-user-add"
                (click)="showPopup('addMember', project.id)"
              />
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
                      Email:
                    </strong>

                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ member.user.email }}
                    </span>
                  </p>
                  <p class="text-sm ">
                    <strong class="text-neutral-900 dark:text-neutral-100">
                      Role:
                    </strong>
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ member.role.name }}
                    </span>
                  </p>
                </div>
                <footer class="flex gap-1 text-[.75rem]">
                  <ui-button
                    label="Assign Task"
                    [iconOnly]="true"
                    icon="fi fi-rr-link-horizontal"
                    (click)="showPopup('assignTask', member.user.id)"
                  />
                  <ui-button
                    label="Remove Member"
                    [iconOnly]="true"
                    variant="danger"
                    icon="fi fi-rr-trash"
                    (click)="showPopup('deleteMember', member.user.id)"
                  />
                </footer>
              </div>
              }
            </div>
            } @else {
            <p class="text-neutral-600 dark:text-neutral-400">
              No members assigned to this project.
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
                Tasks
              </h2>
              <ui-button
                label="Add Task"
                icon="fi fi-rr-square-plus"
                (click)="showPopup('addTask', project.id)"
              />
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
                    {{ task.description || 'No description provided.' }}
                  </p>
                </header>
                <div>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >Due Date:</strong
                    >
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.dueDate | date : 'longDate' }}
                    </span>
                  </p>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >Assigned to:</strong
                    >
                    @if (task.assignee) {
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.assignee.username }}
                    </span>
                    } @else {
                    <span class="text-neutral-700 dark:text-neutral-400">
                      Unassigned
                    </span>
                    }
                  </p>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >Priority:</strong
                    >
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.priority }}
                    </span>
                  </p>
                  <p class="text-sm">
                    <strong class="text-neutral-900 dark:text-neutral-100"
                      >Status:</strong
                    >
                    <span class="text-neutral-700 dark:text-neutral-400">
                      {{ task.status.name }}
                    </span>
                  </p>
                </div>
                <footer class="flex gap-1 text-[.75rem]">
                  <ui-button
                    label="Go to Task"
                    [iconOnly]="true"
                    icon="fi fi-rr-door-open"
                    (click)="goToTask(task.id)"
                  />
                  <ui-button
                    label="Assigned Member"
                    [iconOnly]="true"
                    icon="fi fi-rr-link-horizontal"
                    (click)="showPopup('assignMember', task.id)"
                  />
                  <ui-button
                    label="Delete Task"
                    [iconOnly]="true"
                    variant="danger"
                    icon="fi fi-rr-trash"
                    (click)="showPopup('deleteTask', task.id)"
                  />
                </footer>
              </div>
              }
            </div>
            } @else {
            <p class="text-neutral-600 dark:text-neutral-400">
              No tasks assigned to this project.
            </p>
            }
          </section>
        </div>
      </div>
      } @else {
      <p class="text-neutral-600 dark:text-neutral-400">
        Project not found. Redirecting...
      </p>
      }
    </default-layout>

    @switch (activePopup()) { @case ('deleteProject') {
    <ui-popup title="Delete Project" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, minus
      expedita omnis pariatur nihil voluptatum beatae fugit labore
      necessitatibus. Adipisci blanditiis vitae ut dolore iure, facilis aliquam
      impedit officia quasi.
    </ui-popup>
    } @case ('addMember') {
    <ui-popup title="Add Member" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia soluta,
      voluptas ipsam ipsum expedita quae non natus quam praesentium laborum
      animi vitae odio iusto sunt nesciunt consequuntur vel molestiae numquam.
    </ui-popup>
    } @case ('assignTask') {
    <ui-popup title="Assign Task" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, minus
      expedita omnis pariatur nihil voluptatum beatae fugit labore
      necessitatibus. Adipisci blanditiis vitae ut dolore iure, facilis aliquam
      impedit officia quasi.
    </ui-popup>
    } @case ('deleteMember') {
    <ui-popup title="Delete Member" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, minus
      expedita omnis pariatur nihil voluptatum beatae fugit labore
      necessitatibus. Adipisci blanditiis vitae ut dolore iure, facilis aliquam
      impedit officia quasi.
    </ui-popup>
    } @case ('addTask') {
    <ui-popup title="Add Task" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, minus
      expedita omnis pariatur nihil voluptatum beatae fugit labore
      necessitatibus. Adipisci blanditiis vitae ut dolore iure, facilis aliquam
      impedit officia quasi.
    </ui-popup>
    } @case ('assignMember') {
    <ui-popup title="Asign Member" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, minus
      expedita omnis pariatur nihil voluptatum beatae fugit labore
      necessitatibus. Adipisci blanditiis vitae ut dolore iure, facilis aliquam
      impedit officia quasi.
    </ui-popup>
    } @case ('deleteTask') {
    <ui-popup title="Delete Task" (close)="hidePopup()">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, minus
      expedita omnis pariatur nihil voluptatum beatae fugit labore
      necessitatibus. Adipisci blanditiis vitae ut dolore iure, facilis aliquam
      impedit officia quasi.
    </ui-popup>
    } }
  `,
})
export class ProjectComponent {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  project!: ProjectDetails;

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeId = signal<number | null>(null);

  async ngOnInit(): Promise<void> {
    this.project = await this.projectService.getProjectDetails(this.id);

    if (!this.project) this.router.navigate(['/projects']);
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
}
