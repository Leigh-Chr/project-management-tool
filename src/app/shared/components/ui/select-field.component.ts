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
    <div class="select-field">
      <label
        class="select-field__label"
        [for]="id"
      >
        {{ label }}
        @if (required) {
          <span class="select-field__required" aria-hidden="true">*</span>
        }
      </label>
      <select
        [formControl]="control"
        [id]="id"
        class="select-field__select"
        [attr.aria-invalid]="control.invalid && control.touched"
        [attr.aria-describedby]="control.invalid && control.touched ? id + '-error' : null"
        [attr.aria-required]="required"
        [attr.aria-label]="label"
      >
        @for (option of options; track option.value) {
        <option [value]="option.value">
          {{ option.label }}
        </option>
        }
      </select>
      @if (control.invalid && control.touched) {
      <small 
        class="select-field__error"
        [id]="id + '-error'"
        role="alert"
      >
        {{ errorMessage }}
      </small>
      }
    </div>
  `,
  styles: [`
    .select-field {
      margin-top: var(--space-6);
    }

    .select-field__label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: var(--space-2);
    }

    .select-field__required {
      color: var(--danger-color);
      margin-left: var(--space-1);
    }

    .select-field__select {
      width: 100%;
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-color);
      background-color: var(--surface-2);
      border: var(--input-border);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--input-shadow);
      transition: all var(--transition-normal);

      &:focus {
        outline: none;
        box-shadow: var(--input-focus-shadow);
      }

      &:focus-visible {
        outline: var(--outline-size) var(--outline-style) var(--outline-color);
        outline-offset: var(--focus-ring-offset);
      }

      &[aria-invalid="true"] {
        border-color: var(--danger-color);
      }
    }

    .select-field__error {
      font-size: var(--font-size-xs);
      color: var(--danger-color);
      margin-top: var(--space-1);
    }
  `],
})
export class SelectFieldComponent<T> {
  @Input() control!: FormControl;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() options: SelectOption<T>[] = [];
  @Input() errorMessage: string = 'This field is required.';
  @Input() required: boolean = false;
}
