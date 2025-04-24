import { Component, input } from '@angular/core';
import { type FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'ui-input-field',
  template: `
    <div class="flex flex-col gap-2">
      <label class="label">
        {{ label() }}
        @if (required()) {
        <span>*</span>
        }
      </label>
      <input [formControl]="control()" [type]="type()" class="input" />
      @if (control().invalid && control().touched) {
      <small class="error">
        {{ errorMessage() }}
      </small>
      }
    </div>
  `,
})
export class InputFieldComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input.required<string>();
  errorMessage = input<string>();
  required = input<boolean>();
}
