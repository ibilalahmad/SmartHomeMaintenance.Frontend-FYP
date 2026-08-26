import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-sp-ratings',
  standalone: true,
  templateUrl: './ratings.html'
})
export class Ratings {
  private readonly toast = inject(ToastService);

  exportPDF() {
    this.toast.show('PDF export started.', 'info');
    // Mock export
    setTimeout(() => {
       this.toast.show('Ratings exported to PDF.', 'success');
    }, 1500);
  }
}
