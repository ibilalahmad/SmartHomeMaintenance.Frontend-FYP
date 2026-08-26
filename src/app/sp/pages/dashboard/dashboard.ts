import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SpBookingService } from '../../../core/services/sp-booking.service';
import { Booking } from '../../../core/models/booking.model';
import { SpAuthService } from '../../../core/services/sp-auth.service';

@Component({
  selector: 'app-sp-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  upcomingBookings = signal<Booking[]>([]);
  jobsCompleted = signal(0);
  earnings = signal(0);
  averageRating = signal('4.8'); // Mock
  
  private readonly bookingService = inject(SpBookingService);
  private readonly authService = inject(SpAuthService);

  ngOnInit(): void {
     const sp = this.authService.currentSp();
     if(sp) {
         this.bookingService.getBookingsForSp(sp.providerId.toString()).subscribe((bookings) => {
            const upcoming = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').slice(0, 3);
            this.upcomingBookings.set(upcoming);
            
            const completed = bookings.filter(b => b.status === 'Completed').length;
            this.jobsCompleted.set(completed);
            this.earnings.set(completed * 85); // mock $85 per job
         });
     }
  }
}
