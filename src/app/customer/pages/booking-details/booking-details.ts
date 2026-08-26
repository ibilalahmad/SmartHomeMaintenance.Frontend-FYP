import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustBookingService } from '../../../core/services/cust-booking.service';
import { Booking } from '../../../core/models/booking.model';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-cust-booking-details',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './booking-details.html'
})
export class BookingDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(CustBookingService);

  readonly booking = signal<Booking | null>(null);
  readonly isLoading = signal(true);
  readonly newlyCreated = signal(false);

  // Cancellation state
  showCancelForm = false;
  cancelReason = '';

  // Reschedule state
  showRescheduleForm = false;
  newDate = '';
  newTime = '';

  // Payment state
  showPaymentOptions = false;
  paymentMethod: 'cash' | 'bank' | '' = '';
  paymentSuccess = false;

  ngOnInit() {
    this.newlyCreated.set(this.route.snapshot.queryParamMap.get('newlyCreated') === 'true');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(id);
    } else {
      this.isLoading.set(false);
    }
  }

  loadBooking(id: string) {
    this.isLoading.set(true);
    this.bookingService.getBookingById(id).subscribe({
      next: (b) => {
        this.booking.set(b || null);
        this.isLoading.set(false);
      }
    });
  }

  canCancelOrReschedule(): boolean {
    const b = this.booking();
    if (!b) return false;
    return b.status === 'Pending' || b.status === 'Confirmed';
  }

  submitCancel() {
    const b = this.booking();
    if (!b || !this.cancelReason) return;
    
    this.bookingService.cancelBooking(b.id, this.cancelReason).subscribe(() => {
      this.showCancelForm = false;
      this.loadBooking(b.id);
    });
  }

  submitReschedule() {
    const b = this.booking();
    if (!b || !this.newDate || !this.newTime) return;
    
    this.bookingService.rescheduleBooking(b.id, this.newDate, this.newTime).subscribe(() => {
      this.showRescheduleForm = false;
      this.loadBooking(b.id);
    });
  }

  confirmPayment() {
    if (!this.paymentMethod) return;
    
    // Mock payment confirmation
    setTimeout(() => {
      this.paymentSuccess = true;
      this.showPaymentOptions = false;
      
      const b = this.booking();
      if (b) {
        b.paymentStatus = 'Paid';
        this.booking.set({...b});
      }
    }, 1000);
  }
}
