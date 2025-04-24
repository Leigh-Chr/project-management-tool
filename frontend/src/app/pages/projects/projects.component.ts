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
import { Router } from '@angular/router';
import type { Project } from '@app/shared/models/project.models';
import { AddProjectPopupComponent } from '../../shared/components/popups/add-project-popup.component';
import { DeleteProjectPopupComponent } from '../../shared/components/popups/delete-project-popup.component';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout.component';
import { ProjectService } from '../../shared/services/data/project.service';

type PopupType = 'addProject' | 'deleteProject';

@Component({
  selector: 'pmt-projects',
  imports: [
    DefaultLayoutComponent,
    AddProjectPopupComponent,
    DeleteProjectPopupComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pmt-default-layout pageTitle="Projects">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <h2>Projects</h2>
          <button class="btn btn--primary" (click)="showPopup('addProject')">
            <i class="fi fi-rr-square-plus"></i>
            <span>Add Project</span>
          </button>
        </div>

        <div class="grid">
          @for (status of projectStatuses(); track status) {
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold">{{ status }}</h3>
            <div class="flex flex-col gap-4">
              @let _projects = projects(); @if (_projects?.length === 0) {
              <div class="text-center p-4" role="alert">
                No projects available
              </div>
              } @else { @for (project of _projects; track project.id) { @if
              (project.status === status) {
              <div class="card flex flex-col gap-2">
                <h4 class="text-lg font-semibold">{{ project.name }}</h4>
                <p class="text-gray-600 text-sm line-clamp-2">
                  {{ project.description || 'No description provided' }}
                </p>
                <div class="flex flex-col gap-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Start Date:</span>
                    <span>{{
                      project.startDate
                        ? project.startDate.toLocaleDateString()
                        : '-'
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">End Date:</span>
                    <span>{{
                      project.endDate
                        ? project.endDate.toLocaleDateString()
                        : '-'
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Your Role:</span>
                    <span>{{ project.myRole || '-' }}</span>
                  </div>
                </div>
                <div class="flex gap-2 mt-auto pt-2">
                  @if (project.myRole === 'Admin') {
                  <button
                    class="btn btn--danger w-full"
                    (click)="showPopup('deleteProject', project.id)"
                  >
                    <i class="fi fi-rr-trash"></i>
                  </button>
                  }
                  <button
                    class="btn btn--primary w-full"
                    (click)="goToProject(project.id)"
                  >
                    <i class="fi fi-rr-door-open"></i>
                  </button>
                </div>
              </div>
              } } }
            </div>
          </div>
          }
        </div>

        @switch (activePopup()) { @case ('addProject') {
        <pmt-add-project-popup (onClose)="hidePopup()" />
        } @case ('deleteProject') {
        <pmt-delete-project-popup
          [projectId]="activeProjectId()!"
          (onClose)="hidePopup()"
        />
        } }
      </div>
    </pmt-default-layout>
  `,
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  readonly projects = signal<Project[]>([]);
  readonly projectStatuses = computed(() => {
    const statuses = new Set(
      this.projects()
        ?.map((p) => p.status)
        .filter(Boolean) ?? []
    );
    return Array.from(statuses);
  });

  readonly activePopup = signal<PopupType | null>(null);
  readonly activeProjectId = signal<number | null>(null);

  constructor() {
    const projects = toSignal(this.projectService.getProjects());
    effect(() => {
      this.projects.set(projects() ?? []);
    });

    effect(() => {
      const deletedProject = this.projectService.deletedProject();
      if (deletedProject !== null) {
        untracked(() => {
          this.projects.set(
            this.projects()?.filter((p) => p.id !== deletedProject) ?? []
          );
        });
      }
    });

    effect(() => {
      const postedProject = this.projectService.postedProject();
      untracked(() => {
        if (postedProject !== null) {
          this.projects.set([...this.projects(), postedProject]);
        }
      });
    });
  }

  showPopup(type: PopupType, projectId?: number): void {
    this.activePopup.set(type);
    if (projectId === undefined) {
      return;
    }
    this.activeProjectId.set(projectId);
  }

  hidePopup(): void {
    this.activePopup.set(null);
    this.activeProjectId.set(null);
    this.projectService.deletedProjectMember.set(null);
    this.projectService.postedProjectMember.set(null);
    this.projectService.postedProject.set(null);
    this.projectService.deletedProject.set(null);
  }

  goToProject(id: number): void {
    this.router.navigate(['/projects', id]);
  }
}
