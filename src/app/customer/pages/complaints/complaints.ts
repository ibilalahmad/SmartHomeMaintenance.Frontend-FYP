import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustComplaintService } from '../../../core/services/cust-complaint.service';
import { CustBookingService } from '../../../core/services/cust-booking.service';
import { Complaint } from '../../../core/models/complaint.model';
import { Booking } from '../../../core/models/booking.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cust-complaints',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './complaints.html'
})
export class Complaints implements OnInit {
  private readonly complaintService = inject(CustComplaintService);
  private readonly bookingService = inject(CustBookingService);

  readonly complaints = signal<Complaint[]>([]);
  readonly bookings = signal<Booking[]>([]); // for dropdown
  readonly isLoading = signal(true);

  // New Complaint Form
  showForm = false;
  selectedBookingId = '';
  reason = '';
  evidenceLink = '';
  
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  ngOnInit() {
    this.loadComplaints();
    this.loadBookings();
  }

  loadComplaints() {
    this.isLoading.set(true);
    this.complaintService.getMyComplaints().subscribe({
      next: (complaints) => {
        this.complaints.set(complaints);
        this.isLoading.set(false);
      }
    });
  }

  loadBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (b) => {
        // Can file complaint on completed or in-progress bookings (per FR)
        this.bookings.set(b.filter(x => x.status === 'Completed' || x.status === 'In Progress'));
      }
    });
  }

  onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.selectedBookingId || !this.reason) {
      this.errorMessage.set('Please select a booking and provide a reason.');
      return;
    }

    const booking = this.bookings().find(b => b.id === this.selectedBookingId);
    if (!booking) return;

    this.isSubmitting.set(true);

    this.complaintService.fileComplaint({
      bookingId: booking.id,
      providerName: booking.provider,
      reason: this.reason,
      evidenceLink: this.evidenceLink
    }).subscribe({
      next: (c) => {
        this.isSubmitting.set(false);
        this.showForm = false;
        this.selectedBookingId = '';
        this.reason = '';
        this.evidenceLink = '';
        this.successMessage.set('Complaint filed successfully. Our admin team will review it within 3 business days.');
        this.loadComplaints();
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Failed to file complaint.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'badge--amber';
      case 'In Review': return 'badge--blue';
      case 'Resolved': return 'badge--green';
      case 'Dismissed': return 'badge--red';
      default: return '';
    }
  }
}
