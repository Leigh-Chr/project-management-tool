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
import { GetProjectResponse } from '../../models/Projects/GetProjectResponse';
import { ProjectService } from '../../services/data/project.service';
import { AddProjectRequest } from '../../models/Projects/AddProjectRequest';
import { TranslatorPipe } from '../../i18n/translator.pipe';

@Component({
  selector: 'pmt-add-project-popup',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PopupComponent,
    TranslatorPipe,
  ],
  providers: [TranslatorPipe],
  template: `
    <ui-popup
      [title]="'project.addNewProject' | translate"
      [isSubmitDisabled]="projectForm.invalid"
      [submitLabel]="'project.addProject' | translate"
      [cancelLabel]="'project.cancel' | translate"
      (onSubmit)="submit()"
      (onClose)="close()"
    >
      <form [formGroup]="projectForm" novalidate>
        <ui-input-field
          [control]="name"
          id="name"
          [label]="'project.name' | translate"
          type="text"
          [errorMessage]="'project.nameRequired' | translate"
        />
        <ui-input-field
          [control]="description"
          id="description"
          [label]="'project.description' | translate"
          type="text"
        />
        <ui-input-field
          [control]="startDate"
          id="startDate"
          [label]="'project.startDate' | translate"
          type="date"
          [errorMessage]="'project.startDateRequired' | translate"
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
  @Output() onSubmit = new EventEmitter<GetProjectResponse | null>();

  async submit(): Promise<void> {
    if (!this.projectForm.valid) return;

    const newProject: AddProjectRequest = {
      name: this.name.value,
      description: this.description.value || undefined,
      startDate: new Date(this.startDate.value),
      endDate: undefined,
    };

    const project = await this.projectService.addProject(newProject);
    this.onSubmit.emit(project);
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
