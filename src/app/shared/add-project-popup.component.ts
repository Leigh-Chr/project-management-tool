import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../core/services/data-mock.service';
import { ButtonComponent } from '../ui/button.component';
import { InputFieldComponent } from '../ui/input-field.component';

@Component({
  selector: 'add-project-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFieldComponent,
  ],
  host: {
    class:
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center',
  },
  template: `
    <div
      class="rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-lg w-full max-w-md"
    >
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
        <ui-input-field
          [control]="endDate"
          id="endDate"
          label="End Date"
          type="date"
        />
        <ui-input-field
          [control]="statusId"
          id="statusId"
          label="Status ID"
          type="number"
          errorMessage="Status ID is required."
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
    </div>
  `,
})
export class AddProjectPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() addProject = new EventEmitter<Project>();

  private readonly formBuilder = inject(FormBuilder);

  projectForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    startDate: ['', [Validators.required]],
    endDate: [''],
    statusId: ['', [Validators.required]],
  });

  name = this.projectForm.get('name') as FormControl<string>;
  description = this.projectForm.get('description') as FormControl<string>;
  startDate = this.projectForm.get('startDate') as FormControl<string>;
  endDate = this.projectForm.get('endDate') as FormControl<string>;
  statusId = this.projectForm.get('statusId') as FormControl<number>;

  closePopup(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.projectForm.valid) return;
    this.addProject.emit(this.projectForm.value);
    this.closePopup();
  }
}
