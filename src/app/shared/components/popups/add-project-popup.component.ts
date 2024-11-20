import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputFieldComponent } from '../ui/input-field.component';
import { PopupComponent } from '../ui/popup.component';
import { Project } from '../../models/Project';
import { ProjectService } from '../../services/_data/project.service';

@Component({
  selector: 'add-project-popup',
  standalone: true,
  imports: [ReactiveFormsModule, InputFieldComponent, PopupComponent],
  template: `
    <ui-popup
      title="Add New Project"
      [isSubmitDisabled]="projectForm.invalid"
      submitLabel="Add Project"
      (onSubmit)="submit()"
      (onClose)="close()"
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

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<Project>();

  async submit(): Promise<void> {
    if (!this.projectForm.valid) return;

    const newProject: Omit<Project, 'id' | 'statusId'> = {
      name: this.name.value,
      description: this.description.value,
      startDate: new Date(this.startDate.value),
    };

    const project = await this.projectService.addProject(newProject);
    this.onSubmit.emit(project);
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
