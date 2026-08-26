import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpBookingService } from '../../../core/services/sp-booking.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

@Component({
  selector: 'app-sp-booking-details',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './booking-details.html'
})
export class BookingDetails implements OnInit {
  booking = signal<Booking | null>(null);
  isLoading = signal(true);
  
  issueText = '';
  showIssueBox = false;

  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(SpBookingService);
  private readonly toast = inject(ToastService);
  private readonly modal = inject(ConfirmationModalService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
       this.bookingService.getBookingById(id).subscribe({
         next: (b) => {
           this.booking.set(b);
           this.isLoading.set(false);
         },
         error: () => {
           this.isLoading.set(false);
           this.toast.show('Booking not found.', 'danger');
         }
       });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Confirmed': return 'bg-info text-dark';
      case 'In Progress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  canTransitionTo(target: BookingStatus): boolean {
    const current = this.booking()?.status;
    if (!current) return false;
    
    const validTransitions: Record<string, string[]> = {
      'Pending': ['Confirmed', 'Cancelled'],
      'Confirmed': ['In Progress', 'Cancelled'],
      'In Progress': ['Completed'],
      'Completed': [],
      'Cancelled': []
    };
    
    return validTransitions[current].includes(target);
  }

  async updateStatus(newStatus: BookingStatus): Promise<void> {
     const confirmed = await this.modal.confirm({
       title: 'Update Status',
       message: `Are you sure you want to change the status to ${newStatus}?`,
       confirmText: 'Yes, Update',
       confirmColor: 'primary'
     });

     if (confirmed) {
       this.isLoading.set(true);
       this.bookingService.updateBookingStatus(this.booking()!.id, newStatus).subscribe({
         next: (updatedBooking) => {
           this.booking.set(updatedBooking);
           this.isLoading.set(false);
           this.toast.show(`Status updated to ${newStatus}`, 'success');
         },
         error: (err) => {
           this.isLoading.set(false);
           this.toast.show(err.message, 'danger');
         }
       });
     }
  }

  submitIssue(): void {
     if (!this.issueText) return;
     this.bookingService.reportIssue(this.booking()!.id, this.issueText).subscribe(() => {
        this.toast.show('Your issue has been reported to the admin.', 'info');
        this.showIssueBox = false;
        this.issueText = '';
     });
  }
}
