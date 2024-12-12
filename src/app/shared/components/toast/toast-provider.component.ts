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
    selector: 'toast-provider',
    imports: [ToastComponent, AsyncPipe],
    template: `
    <div
      class="absolute top-4 right-4 flex flex-col gap-2 z-50"
      role="region"
      aria-live="polite"
    >
      @if(toasts$ | async; as toasts) { @for(toast of toasts; track toast.id) {
      <ui-toast [toast]="toast" (close)="clearToast(toast.id)"></ui-toast>
      } }
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
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
