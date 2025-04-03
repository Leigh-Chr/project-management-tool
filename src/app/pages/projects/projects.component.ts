import {
  ChangeDetectionStrategy,
  Component,
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
        <div>
          <table class="table" role="grid">
            <thead class="table__header">
              <tr>
                <th class="table__cell" scope="col">Id</th>
                <th class="table__cell" scope="col">Name</th>
                <th class="table__cell" scope="col">Description</th>
                <th class="table__cell" scope="col">Start Date</th>
                <th class="table__cell" scope="col">End Date</th>
                <th class="table__cell" scope="col">Status</th>
                <th class="table__cell" scope="col">My Role</th>
                <th class="table__cell" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody class="table__body">
              @let _projects = projects(); @if (_projects?.length === 0) {
              <tr>
                <td class="table__cell" colspan="7" role="alert">
                  No data available
                </td>
              </tr>
              } @else { @for (item of _projects; track $index) {
              <tr class="table__row">
                <td class="table__cell table__cell--center">{{ item.id }}</td>
                <td class="table__cell table__cell--center">{{ item.name }}</td>
                <td class="table__cell table__cell--center text-ellipsis">
                  {{ item.description || '-' }}
                </td>
                <td class="table__cell table__cell--center">
                  {{
                    item.startDate ? item.startDate.toLocaleDateString() : '-'
                  }}
                </td>
                <td class="table__cell table__cell--center">
                  {{ item.endDate ? item.endDate.toLocaleDateString() : '-' }}
                </td>
                <td class="table__cell table__cell--center">
                  {{ item.status || '-' }}
                </td>
                <td class="table__cell table__cell--center">
                  {{ item.myRole || '-' }}
                </td>
                <td class="table__cell table__cell--center">
                  <div class="flex gap-2 justify-center">
                    @if (item.myRole === 'Admin') {
                    <button
                      class="btn btn--danger w-full"
                      (click)="showPopup('deleteProject', item.id)"
                    >
                      <i class="fi fi-rr-trash"></i>
                    </button>
                    }
                    <button
                      class="btn btn--primary w-full"
                      (click)="goToProject(item.id)"
                    >
                      <i class="fi fi-rr-door-open"></i>
                    </button>
                  </div>
                </td>
              </tr>
              } }
            </tbody>
          </table>
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
