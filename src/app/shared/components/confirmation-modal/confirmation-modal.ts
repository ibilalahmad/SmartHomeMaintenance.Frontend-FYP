import { Component, inject } from '@angular/core';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModalComponent {
  modalService = inject(ConfirmationModalService);
}
