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
    class: 'popup',
  },
  template: `
    <div 
      class="popup__overlay" 
      role="dialog"
      [attr.aria-modal]="true"
      [attr.aria-labelledby]="'popup-title-' + id"
    >
      <div class="popup__content">
        <h3 
          class="popup__title"
          [id]="'popup-title-' + id"
        >
          {{ title }}
        </h3>
        <ng-content></ng-content>
        <div class="popup__actions">
          <ui-button
            type="button"
            (click)="close()"
            [label]="cancelLabel"
            class="popup__button"
            [attr.aria-label]="cancelLabel"
          ></ui-button>
          <ui-button
            type="button"
            (click)="submit()"
            [disabled]="isSubmitDisabled"
            [label]="submitLabel"
            [variant]="submitVariant"
            [attr.aria-label]="submitLabel"
          ></ui-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .popup {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: var(--z-modal);
    }

    .popup__overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .popup__content {
      position: relative;
      background-color: var(--surface-1);
      border-radius: var(--border-radius-lg);
      padding: var(--space-4);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 28rem;
      max-height: 90vh;
      overflow-y: auto;
    }

    .popup__title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--text-color);
    }

    .popup__actions {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--space-4);
      gap: var(--space-2);
    }

    .popup__button {
      margin-right: var(--space-2);
    }
  `],
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() isSubmitDisabled: boolean = false;
  @Input() submitLabel: string = 'Submit';
  @Input() cancelLabel: string = 'Cancel';
  @Input() submitVariant: ButtonVariant = 'primary';
  @Input() id: string = '';

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  close(): void {
    this.onClose.emit();
  }

  submit(): void {
    this.onSubmit.emit();
  }
}
