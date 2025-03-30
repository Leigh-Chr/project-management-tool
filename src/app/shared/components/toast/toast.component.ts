import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import type { Toast } from './toast.service';

/**
 * Component to display a toast notification.
 */
@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="toast" [ngClass]="'toast--' + toast.type" role="alert">
      <div class="toast__content">
        <div class="toast__message">
          <h3>{{ toast.title }}</h3>
          <p>{{ toast.message }}</p>
        </div>
      </div>
      <button class="toast__close" (click)="close.emit()">
        <i class="fi fi-rr-cross"></i>
      </button>
    </div>
  `,
  styles: [
    `
      .toast {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-4);
        padding: var(--spacing-4);
        background-color: var(--neutral-color-0);
        border-radius: var(--border-radius-lg);
        border: 2px solid var(--text-color);
        box-shadow: var(--shadow-sm);
      }

      .toast--success {
        border-left: 4px solid var(--success-color);
      }

      .toast--error {
        border-left: 4px solid var(--error-color);
      }

      .toast--info {
        border-left: 4px solid var(--accent-color);
      }

      .toast__content {
        flex: 1;
      }

      .toast__message {
        display: grid;
        gap: var(--space-2);
      }

      .toast__close {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  /**
   * The toast to display.
   */
  @Input({ required: true }) toast!: Toast;

  /**
   * Event emitted when the toast is closed.
   */
  @Output() close = new EventEmitter<void>();
}
