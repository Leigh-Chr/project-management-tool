import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'ui-input-field',
  template: `
    <div class="input-field">
      <label class="input-field__label" [for]="id">
        {{ label }}
        @if (required) {
          <span class="input-field__required" aria-hidden="true">*</span>
        }
      </label>
      <input
        [formControl]="control"
        [id]="id"
        [type]="type"
        [autocomplete]="autocomplete"
        [required]="required"
        class="input-field__input"
        [attr.aria-invalid]="control.invalid && control.touched"
        [attr.aria-describedby]="control.invalid && control.touched ? id + '-error' : null"
        [attr.aria-required]="required"
        [attr.aria-label]="label"
      />
      @if (control.invalid && control.touched) {
      <small 
        class="input-field__error"
        [id]="id + '-error'"
        role="alert"
      >
        {{ errorMessage }}
      </small>
      }
    </div>
  `,
  styles: [`
    .input-field {
      margin-top: var(--space-6);
    }

    .input-field__label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: var(--space-2);
    }

    .input-field__required {
      color: var(--danger-color);
      margin-left: var(--space-1);
    }

    .input-field__input {
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

    .input-field__error {
      font-size: var(--font-size-xs);
      color: var(--danger-color);
      margin-top: var(--space-1);
    }
  `],
})
export class InputFieldComponent {
  @Input() control!: FormControl;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() errorMessage: string = 'This field is required.';
  @Input() autocomplete: string = '';
  @Input() required: boolean = false;
}
