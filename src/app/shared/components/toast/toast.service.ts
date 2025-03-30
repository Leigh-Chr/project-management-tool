import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Observable } from 'rxjs';

export interface Toast {
  readonly id: number;
  readonly type: 'success' | 'error' | 'info';
  readonly title: string;
  readonly message: string;
}

export interface ToastInput {
  readonly title: string;
  readonly message: string;
  readonly type?: Toast['type'];
}

/**
 * Service to manage toast notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  private nextId = 0;
  private readonly DEFAULT_DURATION = 5000; // 5 seconds

  /**
   * Shows a new toast notification.
   * @param input - The toast input object containing title, message and optional type
   */
  showToast(input: ToastInput): void {
    const currentToasts = this.toastsSubject.value;
    if (currentToasts.length >= 5) currentToasts.shift(); // Max 5 toasts

    const newToast: Toast = {
      id: this.nextId++,
      title: input.title,
      message: input.message,
      type: input.type ?? 'info',
    };

    this.toastsSubject.next([...currentToasts, newToast]);
    setTimeout(() => this.clearToast(newToast.id), this.DEFAULT_DURATION);
  }

  /**
   * Clears a specific toast notification.
   * @param id - The ID of the toast to clear.
   */
  clearToast(id: number): void {
    this.toastsSubject.next(
      this.toastsSubject.value.filter((toast) => toast.id !== id)
    );
  }

  /**
   * Gets the observable stream of toasts.
   * @returns An observable stream of toasts.
   */
  getToasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }
}
