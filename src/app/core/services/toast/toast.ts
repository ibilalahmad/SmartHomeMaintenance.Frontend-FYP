import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast show align-items-center text-white bg-{{t.type}} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">{{ t.message }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toastService.remove(t.id)" aria-label="Close"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
