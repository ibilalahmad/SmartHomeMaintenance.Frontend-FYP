import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustAuthService } from '../../../core/services/cust-auth.service';
import { CustBookingService } from '../../../core/services/cust-booking.service';
import { CustSearchService } from '../../../core/services/cust-search.service';
import { Booking } from '../../../core/models/booking.model';
import { Customer } from '../../../core/models/customer.model';
import { Provider } from '../../../core/models/provider.model';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-cust-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private readonly authService = inject(CustAuthService);
  private readonly bookingService = inject(CustBookingService);
  private readonly searchService = inject(CustSearchService);

  readonly customer = signal<Customer | null>(null);
  readonly upcomingBookings = signal<Booking[]>([]);
  readonly favoriteProviders = signal<Provider[]>([]);
  
  readonly stats = signal({
    totalBookings: 0,
    totalSpent: 0,
    activeComplaints: 0
  });

  ngOnInit() {
    const cust = this.authService.currentCustomer();
    if (cust) {
      this.customer.set(cust);
      
      this.bookingService.getMyBookings().subscribe(bookings => {
        const upcoming = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'In Progress');
        this.upcomingBookings.set(upcoming);
        
        // Mock stats
        this.stats.set({
          totalBookings: bookings.length,
          totalSpent: bookings.filter(b => b.paymentStatus === 'Paid').length * 2500, // Mock calculation
          activeComplaints: 0 // Mock 0 for now
        });
      });
      
      this.searchService.getFavoriteProviders().subscribe(provs => {
        this.favoriteProviders.set(provs.slice(0, 3)); // Show top 3
      });
    }
  }
}
