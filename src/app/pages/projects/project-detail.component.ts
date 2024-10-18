import { DatePipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultLayoutComponent } from '../../layouts/default-layout.component';
import { Project, Role, Status, User } from '../../services/data-mock.service';
import { ProjectMemberService } from '../../services/project-member.service';
import { ProjectService } from '../../services/project.service';
import { RoleService } from '../../services/role.service';
import { StatusService } from '../../services/status.service';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  imports: [DefaultLayoutComponent, JsonPipe, DatePipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <default-layout>
      @if (project) {
      <div class="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
        <h2
          class="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100"
        >
          {{ project.name }}
        </h2>
        <p class="text-neutral-700 dark:text-neutral-300 mb-4">
          {{ project.description || 'No description provided.' }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p
              class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
            >
              Status
            </p>
            <p class="text-lg text-neutral-900 dark:text-neutral-100">
              {{ projectStatus?.name }}
            </p>
          </div>
          <div>
            <p
              class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
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
              class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
            >
              End Date
            </p>
            <p class="text-lg text-neutral-900 dark:text-neutral-100">
              {{ project.endDate | date : 'longDate' }}
            </p>
          </div>
          }
        </div>

        <div class="mt-6">
          <h3
            class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3"
          >
            Project Members
          </h3>
          @if (projectMembers().length > 0) {
          <ul class="space-y-2">
            @for (member of projectMembers(); track member.userId) {
            <li
              class="px-4 py-2 bg-neutral-50 dark:bg-neutral-950 rounded-md shadow-sm"
            >
              <span class="font-medium text-neutral-900 dark:text-neutral-100">
                {{ member.user.username }}
              </span>
              <span class="text-neutral-600 dark:text-neutral-400">
                ({{ memberRole(member.roleId)?.name }})
              </span>
            </li>
            }
          </ul>
          } @else {
          <p class="text-neutral-500 dark:text-neutral-400">
            No members assigned to this project.
          </p>
          }
        </div>

        <div class="mt-6">
          <h3
            class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3"
          >
            Tasks
          </h3>
          @if (projectTasks().length > 0) {
          <ul class="space-y-4">
            @for (task of projectTasks(); track task.id) {
            <li
              class="px-4 py-3 border dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-lg shadow-sm"
            >
              <h4
                class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ task.name }}
              </h4>
              <p class="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                {{ task.description || 'No description provided.' }}
              </p>
              <p class="text-sm">
                <strong class="text-neutral-900 dark:text-neutral-100"
                  >Due Date:</strong
                >
                <span class="text-neutral-700 dark:text-neutral-300">
                  {{ task.dueDate | date : 'longDate' }}
                </span>
              </p>
              <p class="text-sm">
                <strong class="text-neutral-900 dark:text-neutral-100"
                  >Assigned to:</strong
                >
                <span class="text-neutral-700 dark:text-neutral-300">
                  {{ taskAssignee(task.assigneeId)?.username }}
                </span>
              </p>
              <p class="text-sm">
                <strong class="text-neutral-900 dark:text-neutral-100"
                  >Priority:</strong
                >
                <span class="text-neutral-700 dark:text-neutral-300">{{
                  task.priority
                }}</span>
              </p>
              <p class="text-sm">
                <strong class="text-neutral-900 dark:text-neutral-100"
                  >Status:</strong
                >
                <span class="text-neutral-700 dark:text-neutral-300">
                  {{ taskStatus(task.statusId)?.name }}
                </span>
              </p>
            </li>
            }
          </ul>
          } @else {
          <p class="text-neutral-500 dark:text-neutral-400">
            No tasks assigned to this project.
          </p>
          }
        </div>
      </div>
      } @else {
      <p class="text-neutral-500 dark:text-neutral-400">
        Project not found. Redirecting...
      </p>
      }
    </default-layout>
  `,
})
export class ProjectComponent {
  private readonly projectService = inject(ProjectService);
  private readonly projectMemberService = inject(ProjectMemberService);
  private readonly roleService = inject(RoleService);
  private readonly statusService = inject(StatusService);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id: number = +this.route.snapshot.params['id'];
  readonly project = this.projectService
    .projectsSignal()
    .find((p) => p.id === this.id);
  readonly projectStatus = this.statusService
    .statusesSignal()
    .find((s) => s.id === this.project?.statusId);
  readonly projectMembers = computed(() => this.getProjectMembers());
  readonly projectTasks = computed(() =>
    this.taskService.tasksSignal().filter((task) => task.projectId === this.id)
  );

  constructor() {
    if (!this.project) {
      this.router.navigate(['/projects']);
    }
  }

  private getProjectMembers(): {
    user: Omit<User, 'password'>;
    projectId: Project['id'];
    userId: User['id'];
    roleId: Role['id'];
  }[] {
    const members = this.projectMemberService
      .projectMembersSignal()
      .filter((pm) => pm.projectId === this.id);
    return members.map((member) => ({
      ...member,
      user: this.userService
        .usersSignal()
        .find((user) => user.id === member.userId)!,
    }));
  }

  memberRole(roleId: number): Role | undefined {
    return this.roleService.rolesSignal().find((role) => role.id === roleId);
  }

  taskAssignee(userId: number): Omit<User, 'password'> | undefined {
    return this.userService.usersSignal().find((user) => user.id === userId);
  }

  taskStatus(statusId: number): Status | undefined {
    return this.statusService
      .statusesSignal()
      .find((status) => status.id === statusId);
  }
}
