import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { PostProjectRequest } from '@app/shared/models/project.models';
import { StatusService } from '@app/shared/services/data/status.service';
import { map } from 'rxjs';
import { ProjectService } from '../../services/data/project.service';
import { InputFieldComponent } from '../ui/input-field.component';
import { PopupComponent } from '../ui/popup.component';
import { SelectFieldComponent } from '../ui/select-field.component';
import {
  FormBuilder,
  FormControl,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'pmt-add-project-popup',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PopupComponent,
    SelectFieldComponent,
  ],
  template: `
    <ui-popup
      id="add-project-popup"
      popupTitle="Add New Project"
      [isSubmitDisabled]="projectForm.invalid"
      submitLabel="Add Project"
      cancelLabel="Cancel"
      (onSubmit)="submit()"
      (onClose)="this.onClose.emit()"
    >
      <form
        [formGroup]="projectForm"
        class="add-project-popup__form"
        novalidate
      >
        <ui-input-field
          [control]="name"
          id="name"
          label="Name"
          type="text"
          [errorMessage]="'Name is required'"
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
          [errorMessage]="'Start Date is required'"
        />
        <ui-input-field
          [control]="endDate"
          id="endDate"
          label="End Date"
          type="date"
        />
        <ui-select-field
          [control]="status"
          id="status"
          label="Status"
          [options]="statusOptions()"
          [errorMessage]="'Status is required'"
        />
      </form>
    </ui-popup>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectPopupComponent {
  private readonly projectService = inject(ProjectService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly statusService = inject(StatusService);

  onClose = output<void>();

  statusOptions = toSignal(
    this.statusService.getStatuses().pipe(
      map((statuses) =>
        statuses.map((status) => ({
          value: status.id,
          label: status.name,
        }))
      )
    ),
    {
      initialValue: [],
    }
  );

  readonly projectForm: FormGroup = this.formBuilder.group({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    startDate: new FormControl<string | undefined>(undefined),
    endDate: new FormControl<string | undefined>(undefined),
    status: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
  });

  readonly name = this.projectForm.get('name') as FormControl<string>;
  readonly description = this.projectForm.get(
    'description'
  ) as FormControl<string>;
  readonly startDate = this.projectForm.get('startDate') as FormControl<
    string | undefined
  >;
  readonly endDate = this.projectForm.get('endDate') as FormControl<
    string | undefined
  >;
  readonly status = this.projectForm.get('status') as FormControl<
    string | undefined
  >;

  constructor() {
    this.projectForm.reset();
    effect(() => {
      const postedProject = this.projectService.postedProject();
      if (!postedProject) {return;}
      this.onClose.emit();
    });
  }

  async submit(): Promise<void> {
    if (!this.projectForm.valid) {return;}

    const statusId = Number.parseInt(this.status.value || '');
    if (Number.isNaN(statusId)) {return;}

    const newProject: PostProjectRequest = {
      name: this.name.value,
      description: this.description.value || undefined,
      startDate: this.startDate.value
        ? new Date(this.startDate.value)
        : undefined,
      endDate: this.endDate.value ? new Date(this.endDate.value) : undefined,
      statusId,
    };

    this.projectService.postProject(newProject);
  }
}
