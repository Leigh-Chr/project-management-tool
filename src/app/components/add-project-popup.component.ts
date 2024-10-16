import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ProjectService,
  AddProjectDto,
} from '../services/data/project.service';
import { InputFieldComponent } from './ui/input-field.component';
import { PopupComponent } from './ui/popup.component';

@Component({
  selector: 'add-project-popup',
  standalone: true,
  imports: [ReactiveFormsModule, InputFieldComponent, PopupComponent],
  template: `
    <ui-popup
      title="Add New Project"
      [isSubmitDisabled]="projectForm.invalid"
      submitLabel="Add Project"
      (submit)="onSubmit()"
      (close)="closePopup()"
    >
      <form [formGroup]="projectForm" novalidate>
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
      </form>
    </ui-popup>
  `,
})
export class AddProjectPopupComponent {
  private readonly projectService = inject(ProjectService);
  private readonly formBuilder = inject(FormBuilder);

  projectForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    startDate: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  name = this.projectForm.get('name') as FormControl<string>;
  description = this.projectForm.get('description') as FormControl<string>;
  startDate = this.projectForm.get('startDate') as FormControl<string>;

  @Output() close = new EventEmitter<void>();

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

  closePopup(): void {
    this.projectForm.reset();
    this.close.emit();
  }
}
