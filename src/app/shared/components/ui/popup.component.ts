import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonComponent, ButtonVariant } from './button.component';

@Component({
  imports: [ButtonComponent],
  selector: 'ui-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center',
  },
  template: `
    <div
      class="rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-lg w-full max-w-md"
    >
      <h3 class="text-lg font-semibold mb-4">
        {{ title }}
      </h3>
      <ng-content></ng-content>
      <div class="flex justify-end mt-4">
        <ui-button
          type="button"
          (click)="close()"
          label="Cancel"
          class="mr-2"
          [label]="cancelLabel"
        ></ui-button>
        <ui-button
          type="button"
          (click)="submit()"
          [disabled]="isSubmitDisabled"
          [label]="submitLabel"
          [variant]="submitVariant"
        ></ui-button>
      </div>
    </div>
  `,
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() isSubmitDisabled: boolean = false;
  @Input() submitLabel: string = 'Submit';
  @Input() cancelLabel: string = 'Cancel';
  @Input() submitVariant: ButtonVariant = 'primary';

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  close(): void {
    this.onClose.emit();
  }

  submit(): void {
    this.onSubmit.emit();
  }
}
