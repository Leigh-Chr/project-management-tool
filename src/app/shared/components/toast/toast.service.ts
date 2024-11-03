import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastBase {
  readonly id: number;
  readonly type: 'success' | 'error' | 'info';
  readonly duration: number;
}

export interface ToastWithMessage extends ToastBase {
  readonly title: string;
  readonly message: string;
}

export interface ToastWithTemplate extends ToastBase {
  readonly template: TemplateRef<unknown>;
}

export type Toast = ToastWithMessage | ToastWithTemplate;

export type ToastMessageInput = Omit<ToastWithMessage, 'id'>;
export type ToastTemplateInput = Omit<ToastWithTemplate, 'id'>;

/**
 * Service to manage toast notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubjects = new Map<string, BehaviorSubject<Toast[]>>();
  private nextId = 0;
  private maxToasts = 5;

  /**
   * Sets the maximum number of toasts for a specific provider.
   * @param maxToasts - The maximum number of toasts.
   * @param providerId - The ID of the toast provider.
   */
  setMaxToasts(maxToasts: number, providerId: string): void {
    this.maxToasts = maxToasts;
    if (!this.toastsSubjects.has(providerId)) {
      this.toastsSubjects.set(providerId, new BehaviorSubject<Toast[]>([]));
    }
  }

  /**
   * Shows a new toast notification.
   * @param toast - The toast to show.
   * @param providerId - The ID of the toast provider.
   */
  showToast(
    toast: ToastMessageInput | ToastTemplateInput,
    providerId: string
  ): void {
    if (!this.toastsSubjects.has(providerId)) {
      this.toastsSubjects.set(providerId, new BehaviorSubject<Toast[]>([]));
    }
    const currentToasts = this.toastsSubjects.get(providerId)!.value;
    if (currentToasts.length >= this.maxToasts) currentToasts.shift();
    const newToast: Toast = { ...toast, id: this.nextId++ } as Toast;
    this.toastsSubjects.get(providerId)!.next([...currentToasts, newToast]);
    setTimeout(() => this.clearToast(newToast.id, providerId), toast.duration);
  }

  /**
   * Clears a specific toast notification.
   * @param id - The ID of the toast to clear.
   * @param providerId - The ID of the toast provider.
   */
  clearToast(id: number, providerId: string): void {
    if (this.toastsSubjects.has(providerId)) {
      this.toastsSubjects
        .get(providerId)!
        .next(
          this.toastsSubjects
            .get(providerId)!
            .value.filter((toast) => toast.id !== id)
        );
    }
  }

  /**
   * Gets the observable stream of toasts for a specific provider.
   * @param providerId - The ID of the toast provider.
   * @returns An observable stream of toasts.
   */
  getToasts(providerId: string): Observable<Toast[]> {
    if (!this.toastsSubjects.has(providerId)) {
      this.toastsSubjects.set(providerId, new BehaviorSubject<Toast[]>([]));
    }
    return this.toastsSubjects.get(providerId)!.asObservable();
  }
}
