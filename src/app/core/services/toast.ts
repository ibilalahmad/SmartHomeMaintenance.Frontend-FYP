import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', delay = 3000) {
    const toast: Toast = { message, type, delay };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.remove(toast), delay);
  }

  remove(toast: Toast) {
    this.toasts.update(t => t.filter(x => x !== toast));
  }
}
