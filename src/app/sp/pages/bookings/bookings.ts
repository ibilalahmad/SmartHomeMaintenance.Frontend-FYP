import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SpBookingService } from '../../../core/services/sp-booking.service';
import { SpAuthService } from '../../../core/services/sp-auth.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-sp-bookings',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './bookings.html'
})
export class Bookings implements OnInit {
  bookings = signal<Booking[]>([]);
  filteredBookings = signal<Booking[]>([]);
  isLoading = signal(true);
  currentFilter = signal('All');

  private readonly bookingService = inject(SpBookingService);
  private readonly authService = inject(SpAuthService);

  ngOnInit(): void {
    const sp = this.authService.currentSp();
    if (sp) {
      this.bookingService.getBookingsForSp(sp.providerId.toString()).subscribe((data) => {
        this.bookings.set(data);
        this.filteredBookings.set(data);
        this.isLoading.set(false);
      });
    } else {
        this.isLoading.set(false);
    }
  }

  filter(status: string): void {
    this.currentFilter.set(status);
    if (status === 'All') {
      this.filteredBookings.set(this.bookings());
    } else {
      this.filteredBookings.set(this.bookings().filter(b => b.status === status));
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
}
