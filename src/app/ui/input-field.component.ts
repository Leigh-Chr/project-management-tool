import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'ui-input-field',
  template: `
    <div class="mt-6">
      <label>
        <span
          class="
        block text-sm font-medium text-neutral-700 dark:text-neutral-300
        mb-2
        "
        >
          {{ label }}
        </span>
        <input
          [formControl]="control"
          [id]="id"
          [type]="type"
          [autocomplete]="autocomplete"
          class="
          px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 
          border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          dark:focus:ring-blue-600
          w-full
          "
        />
      </label>
      @if (control.invalid && control.touched) {
      <small class="text-xs text-red-500">
        {{ errorMessage }}
      </small>
      }
    </div>
  `,
  standalone: true,
})
export class InputFieldComponent {
  @Input() control!: FormControl;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() errorMessage: string = 'This field is required.';
  @Input() autocomplete: string = '';
}
