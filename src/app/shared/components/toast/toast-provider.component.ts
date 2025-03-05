import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ToastComponent } from './toast.component';
import { Toast, ToastService } from './toast.service';

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
  styles: [`
    .toast-provider {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      z-index: 50;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastProviderComponent implements OnInit {
  /**
   * The maximum number of toasts to display.
   */
  @Input() maxToasts: number = 5;

  /**
   * The ID of the toast provider.
   */
  @Input() providerId: string = 'default';

  /**
   * The observable stream of toasts.
   */
  toasts$!: Observable<Toast[]>;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.setMaxToasts(this.maxToasts, this.providerId);
    this.toasts$ = this.toastService.getToasts(this.providerId);
  }

  /**
   * Clears a specific toast notification.
   * @param id - The ID of the toast to clear.
   */
  clearToast(id: number): void {
    this.toastService.clearToast(id, this.providerId);
  }
}
