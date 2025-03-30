import { Component, input } from '@angular/core';
import { type FormControl, ReactiveFormsModule } from '@angular/forms';

export type SelectOption<T> = {
  value: T;
  label: string;
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'ui-select-field',
  template: `
    <div class="flex flex-col gap-2">
      <label class="label">
        <span>
          {{ label() }}
        </span>
        @if (required()) {
        <span class="select-field__required" aria-hidden="true">*</span>
        }
      </label>
      <select [formControl]="control()" class="input">
        @for (option of options(); track option.value) {
        <option [value]="option.value">
          {{ option.label }}
        </option>
        }
      </select>
      @if (control().invalid && control().touched) {
      <small class="error">
        {{ errorMessage() }}
      </small>
      }
    </div>
  `,
})
export class SelectFieldComponent<T> {
  control = input.required<FormControl>();
  label = input.required<string>();
  options = input.required<SelectOption<T>[]>();
  errorMessage = input<string>();
  required = input<boolean>(false);
}
