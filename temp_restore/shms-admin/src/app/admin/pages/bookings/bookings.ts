import { Component, OnInit, signal } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './bookings.html',
})
export class BookingsComponent implements OnInit {
  allBookings  = signal<Booking[]>([]);
  bookings     = signal<Booking[]>([]);
  activeFilter = signal<string>('All');

  readonly filters: string[] = ['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAll().subscribe(data => {
      this.allBookings.set(data);
      this.bookings.set(data);
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.bookings.set(
      filter === 'All'
        ? this.allBookings()
        : this.allBookings().filter(b => b.status === filter as BookingStatus)
    );
  }

  cancelBooking(id: string): void {
    if (confirm(`Are you sure you want to cancel booking ${id}?`)) {
      this.bookingService.cancelBooking(id).subscribe((success) => {
        if (success) {
          // Reload bookings
          this.bookingService.getAll().subscribe(data => {
            this.allBookings.set(data);
            this.setFilter(this.activeFilter());
          });
        }
      });
    }
  }
}
