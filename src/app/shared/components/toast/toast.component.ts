import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Toast, ToastWithTemplate } from './toast.service';

/**
 * Component to display a toast notification.
 */
@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  template: `
    <div 
      class="toast" 
      [ngClass]="'toast--' + toast.type"
      role="alert"
      [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
      [attr.aria-label]="getToastLabel()"
    >
      <div class="toast__content">
        @if (isTemplateToast(toast)) {
        <ng-container *ngTemplateOutlet="toast.template"></ng-container>
        } @else {
        <div class="toast__message">
          <h3 class="toast__title">{{ toast.title }}</h3>
          <p class="toast__text">{{ toast.message }}</p>
        </div>
        }
      </div>
      <button 
        class="toast__close" 
        (click)="close.emit()"
        aria-label="Close notification"
      >
        <i class="fi fi-rr-cross" aria-hidden="true"></i>
      </button>
    </div>
  `,
  styles: [`
    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-4);
      background-color: var(--surface-2);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      min-width: 300px;
      max-width: 400px;
    }

    .toast--success {
      border-left: 4px solid var(--success-color);
    }

    .toast--error {
      border-left: 4px solid var(--danger-color);
    }

    .toast--info {
      border-left: 4px solid var(--info-color);
    }

    .toast__content {
      flex: 1;
    }

    .toast__message {
      display: grid;
      gap: var(--space-2);
    }

    .toast__title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--text-color);
    }

    .toast__text {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .toast__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      background: none;
      border: none;
      border-radius: var(--border-radius-full);
      color: var(--text-muted);
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--surface-3);
      }

      &:focus-visible {
        outline: var(--outline-size) var(--outline-style) var(--outline-color);
        outline-offset: var(--focus-ring-offset);
      }
    }
  `],
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

  /**
   * Type guard to check if the toast is a ToastWithTemplate.
   * @param toast - The toast to check.
   * @returns True if the toast is a ToastWithTemplate, false otherwise.
   */
  isTemplateToast(toast: Toast): toast is ToastWithTemplate {
    return 'template' in toast;
  }

  /**
   * Gets the appropriate label for the toast based on its type and content.
   * @returns The label for the toast.
   */
  getToastLabel(): string {
    if (this.isTemplateToast(this.toast)) {
      return 'Notification';
    }
    return this.toast.title || 'Notification';
  }
}
