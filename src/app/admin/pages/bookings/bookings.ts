import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [StatusBadgeComponent, FormsModule, DatePipe],
  templateUrl: './bookings.html',
})
export class BookingsComponent implements OnInit {
  allBookings  = signal<Booking[]>([]);
  bookings     = signal<Booking[]>([]);
  activeFilter = signal<string>('All');

  // Pagination state
  Math = Math;
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizes = [5, 10, 25, 50];

  paginatedBookings = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.bookings().slice(startIndex, startIndex + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.bookings().length / this.pageSize());
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

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
    this.currentPage.set(1); // Reset to first page on filter change
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  changePageSize(newSize: string): void {
    this.pageSize.set(parseInt(newSize, 10));
    this.currentPage.set(1);
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
