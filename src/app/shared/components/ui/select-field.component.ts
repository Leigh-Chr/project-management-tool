import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export type SelectOption<T> = {
  value: T;
  label: string;
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'ui-select-field',
  template: `
    <div class="mt-6">
      <label
        class="
        block text-sm font-medium text-neutral-700 dark:text-neutral-300
        mb-2
        "
        [for]="id"
      >
        {{ label }}
      </label>
      <select
        [formControl]="control"
        [id]="id"
        class="
        px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 
        border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        dark:focus:ring-blue-600
        w-full
        "
      >
        @for (option of options; track option.value) {
        <option [value]="option.value">
          {{ option.label }}
        </option>
        }
      </select>
      @if (control.invalid && control.touched) {
      <small class="text-xs text-red-500">
        {{ errorMessage }}
      </small>
      }
    </div>
  `,
})
export class SelectFieldComponent<T> {
  @Input() control!: FormControl;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() options: SelectOption<T>[] = [];
  @Input() errorMessage: string = 'This field is required.';
}
