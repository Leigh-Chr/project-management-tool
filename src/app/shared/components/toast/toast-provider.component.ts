import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ToastComponent } from './toast.component';
import { Toast, ToastService } from './toast.service';

@Component({
  selector: 'toast-provider',
  standalone: true,
  imports: [ToastComponent, AsyncPipe, NgIf, NgFor],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastProviderComponent implements OnInit {
  @Input() maxToasts: number = 5;
  @Input() providerId: string = 'default';
  toasts$!: Observable<Toast[]>;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.setMaxToasts(this.maxToasts, this.providerId);
    this.toasts$ = this.toastService.getToasts(this.providerId);
  }

  clearToast(id: number): void {
    this.toastService.clearToast(id, this.providerId);
  }
}
