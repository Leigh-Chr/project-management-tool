import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
} from '@angular/core';
import type { Observable } from 'rxjs';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';
import type { Toast } from './toast.service';

/**
 * Component to provide and display toast notifications.
 */
@Component({
  selector: 'pmt-toast-provider',
  standalone: true,
  imports: [ToastComponent, AsyncPipe],
  template: `
    <div
      class="toast-provider"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      @if(toasts$ | async; as toasts) { @for(toast of toasts; track toast.id) {
      <ui-toast [toast]="toast" (close)="clearToast(toast.id)"></ui-toast>
      } }
    </div>
  `,
  styles: [
    `
      .toast-provider {
        position: absolute;
        top: var(--spacing-4);
        right: var(--spacing-4);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        z-index: 50;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastProviderComponent implements OnInit {
  private readonly toastService = inject(ToastService);

  /**
   * The observable stream of toasts.
   */
  toasts$!: Observable<Toast[]>;

  ngOnInit(): void {
    this.toasts$ = this.toastService.getToasts();
  }

  /**
   * Clears a specific toast notification.
   * @param id - The ID of the toast to clear.
   */
  clearToast(id: number): void {
    this.toastService.clearToast(id);
  }
}
