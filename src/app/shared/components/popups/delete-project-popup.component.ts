import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ProjectMemberService } from '../../services/data/project-member.service';
import { ProjectService } from '../../services/data/project.service';
import { PopupComponent } from '../ui/popup.component';

@Component({
  selector: 'delete-project-popup',
  standalone: true,
  imports: [PopupComponent],
  template: `
    <ui-popup
      title="Delete Project - {{ projectName() }}"
      submitLabel="Delete"
      submitVariant="danger"
      (submit)="onSubmit()"
      (close)="closePopup()"
    >
      <p class="mb-4">
        Are you sure you want to delete this project? This action cannot be
        undone.
      </p>
    </ui-popup>
  `,
})
export class DeleteProjectPopupComponent {
  private readonly projectService = inject(ProjectService);
  private readonly projectMemberService = inject(ProjectMemberService);

  @Input() projectId!: number;
  projectName = computed(
    () =>
      this.projectService.projectsSignal().find((p) => p.id === this.projectId)
        ?.name
  );

  @Output() close = new EventEmitter<void>();

  onSubmit(): void {
    this.projectMemberService.deleteProjectMembers(this.projectId);
    this.projectService.deleteProject(this.projectId);
    this.closePopup();
  }

  closePopup(): void {
    this.close.emit();
  }
}
