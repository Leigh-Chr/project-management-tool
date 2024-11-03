import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private nextId = 0;
  private maxToasts = 5;

  setMaxToasts(maxToasts: number): void {
    this.maxToasts = maxToasts;
  }

  showToast(toast: Omit<Toast, 'id'>): void {
    const currentToasts = this.toastsSubject.value;
    if (currentToasts.length >= this.maxToasts) currentToasts.shift();
    const newToast = { ...toast, id: this.nextId++ };
    this.toastsSubject.next([...currentToasts, newToast]);
    setTimeout(() => this.clearToast(newToast.id), toast.duration);
  }

  clearToast(id: number): void {
    this.toastsSubject.next(
      this.toastsSubject.value.filter((toast) => toast.id !== id)
    );
  }
}
