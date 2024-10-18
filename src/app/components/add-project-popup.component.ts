import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddProjectDto, ProjectService } from '../services/project.service';
import { StatusService } from '../services/status.service';
import { ButtonComponent } from './ui/button.component';
import { InputFieldComponent } from './ui/input-field.component';
import { SelectFieldComponent } from './ui/select-field.component';
import { PopupComponent } from './ui/popup.component';

@Component({
  selector: 'add-project-popup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFieldComponent,
    SelectFieldComponent,
    PopupComponent,
  ],
  template: `
    <ui-popup>
      <h3 class="text-lg font-semibold mb-4">Add New Project</h3>
      <form (ngSubmit)="onSubmit()" [formGroup]="projectForm" novalidate>
        <ui-input-field
          [control]="name"
          id="name"
          label="Name"
          type="text"
          errorMessage="Name is required."
        />
        <ui-input-field
          [control]="description"
          id="description"
          label="Description"
          type="text"
        />
        <ui-input-field
          [control]="startDate"
          id="startDate"
          label="Start Date"
          type="date"
          errorMessage="Start Date is required."
        />
        <div class="flex justify-end mt-4">
          <ui-button
            type="button"
            (click)="closePopup()"
            label="Cancel"
            class="mr-2"
          ></ui-button>
          <ui-button
            type="submit"
            [disabled]="projectForm.invalid"
            label="Add Project"
          ></ui-button>
        </div>
      </form>
    </ui-popup>
  `,
})
export class AddProjectPopupComponent {
  private readonly statusService = inject(StatusService);
  private readonly projectService = inject(ProjectService);

  @Output() close = new EventEmitter<void>();

  statuses = computed(() => this.statusService.statusesSignal());
  statusOptions = computed(() =>
    this.statuses().map((status) => ({
      value: status.id,
      label: status.name,
    }))
  );

  private readonly formBuilder = inject(FormBuilder);

  projectForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    startDate: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  name = this.projectForm.get('name') as FormControl<string>;
  description = this.projectForm.get('description') as FormControl<string>;
  startDate = this.projectForm.get('startDate') as FormControl<string>;

  closePopup(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.projectForm.valid) return;

    const newProject: AddProjectDto = {
      name: this.name.value,
      description: this.description.value,
      startDate: new Date(this.startDate.value),
    };

    this.projectService.addProject(newProject);
    this.closePopup();
  }
}
