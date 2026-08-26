import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustBookingService } from '../../../core/services/cust-booking.service';
import { Booking } from '../../../core/models/booking.model';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-cust-bookings',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings implements OnInit {
  private readonly bookingService = inject(CustBookingService);

  readonly allBookings = signal<Booking[]>([]);
  readonly isLoading = signal(true);
  readonly currentTab = signal<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        // Sort by date (descending for now)
        this.allBookings.set(bookings.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime()));
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'upcoming' | 'completed' | 'cancelled') {
    this.currentTab.set(tab);
  }

  getFilteredBookings(): Booking[] {
    const tab = this.currentTab();
    return this.allBookings().filter(b => {
      if (tab === 'upcoming') {
        return b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'In Progress';
      }
      if (tab === 'completed') return b.status === 'Completed';
      if (tab === 'cancelled') return b.status === 'Cancelled';
      return true;
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}
