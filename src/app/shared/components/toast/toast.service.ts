import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private toastsSubjects = new Map<string, BehaviorSubject<Toast[]>>();
  private nextId = 0;
  private maxToasts = 5;

  setMaxToasts(maxToasts: number, providerId: string): void {
    this.maxToasts = maxToasts;
    if (!this.toastsSubjects.has(providerId)) {
      this.toastsSubjects.set(providerId, new BehaviorSubject<Toast[]>([]));
    }
  }

  showToast(toast: Omit<Toast, 'id'>, providerId: string): void {
    if (!this.toastsSubjects.has(providerId)) {
      this.toastsSubjects.set(providerId, new BehaviorSubject<Toast[]>([]));
    }
    const currentToasts = this.toastsSubjects.get(providerId)!.value;
    if (currentToasts.length >= this.maxToasts) currentToasts.shift();
    const newToast = { ...toast, id: this.nextId++ };
    this.toastsSubjects.get(providerId)!.next([...currentToasts, newToast]);
    setTimeout(() => this.clearToast(newToast.id, providerId), toast.duration);
  }

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

  getToasts(providerId: string): Observable<Toast[]> {
    if (!this.toastsSubjects.has(providerId)) {
      this.toastsSubjects.set(providerId, new BehaviorSubject<Toast[]>([]));
    }
    return this.toastsSubjects.get(providerId)!.asObservable();
  }
}
