import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { ProjectMemberService } from '../services/project-member.service';
import { ProjectService } from '../services/project.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';
import { ButtonComponent } from './ui/button.component';
import { PopupComponent } from './ui/popup.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [PopupComponent, ButtonComponent, FormsModule],
  selector: 'delete-project-popup',
  template: `
    <ui-popup>
      <h3 class="text-lg font-semibold mb-4">
        Delete Project -
        <span
          class="text-md font-normal text-neutral-500 dark:text-neutral-400"
        >
          {{ projectName() }}
        </span>
      </h3>
      <p class="mb-4">
        Are you sure you want to delete this project? This action cannot be
        undone.
      </p>
      <form (ngSubmit)="onSubmit($event)">
        <div class="flex justify-end mt-4">
          <ui-button
            (click)="closePopup()"
            label="Cancel"
            class="mr-2"
          ></ui-button>
          <ui-button type="submit" label="Delete" variant="danger"></ui-button>
        </div>
      </form>
    </ui-popup>
  `,
})
export class DeleteProjectPopupComponent {
  private readonly projectService = inject(ProjectService);
  readonly projectId = input.required<number>();
  readonly projectName = computed(
    () =>
      this.projectService
        .projectsSignal()
        .find((p) => p.id === this.projectId())?.name
  );

  private readonly projectMembersService = inject(ProjectMemberService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  @Output() close = new EventEmitter<void>();

  onSubmit(event: Event): void {
    event.preventDefault();
    this.projectMembersService.deleteProjectMembers(this.projectId());
    this.projectService.deleteProject(this.projectId());
    this.closePopup();
  }

  closePopup(): void {
    this.close.emit();
  }
}
