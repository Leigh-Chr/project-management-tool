import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Toast, ToastWithTemplate } from './toast.service';

export type ToastType = 'success' | 'error' | 'info';

/**
 * Component to display a toast notification.
 */
@Component({
    selector: 'ui-toast',
    imports: [NgClass, NgTemplateOutlet],
    template: `
    <div
      [ngClass]="toastClasses"
      class="relative p-4 rounded shadow-md border-l-4 bg-neutral-100 dark:bg-neutral-800"
      role="alert"
      aria-live="assertive"
    >
      <button
        (click)="closeToast()"
        class="absolute top-2 right-2 text-gray-500"
        aria-label="Close"
      >
        &times;
      </button>
      @if(isToastWithTemplate(toast)) {
      <ng-container *ngTemplateOutlet="toast.template"></ng-container>
      } @else {
      <strong class="block">{{ toast.title }}</strong>
      <p class="text-sm">{{ toast.message }}</p>
      }
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  /**
   * The toast to display.
   */
  @Input() toast!: Toast;

  /**
   * Event emitted when the toast is closed.
   */
  @Output() readonly close = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => this.closeToast(), this.toast.duration);
  }

  /**
   * Closes the toast.
   */
  closeToast(): void {
    this.close.emit();
  }

  /**
   * Gets the CSS classes for the toast based on its type.
   */
  get toastClasses(): string {
    return {
      success:
        'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400',
      error:
        'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400',
      info: 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400',
    }[this.toast.type];
  }

  /**
   * Type guard to check if the toast is a ToastWithTemplate.
   * @param toast - The toast to check.
   * @returns True if the toast is a ToastWithTemplate, false otherwise.
   */
  isToastWithTemplate(toast: Toast): toast is ToastWithTemplate {
    return (toast as ToastWithTemplate).template !== undefined;
  }
}
