import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent {
  toastService = inject(ToastService);
}
