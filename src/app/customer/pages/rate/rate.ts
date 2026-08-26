import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustBookingService } from '../../../core/services/cust-booking.service';
import { ProviderService } from '../../../core/services/provider.service';
import { Booking } from '../../../core/models/booking.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cust-rate',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './rate.html'
})
export class Rate implements OnInit {
  private readonly bookingService = inject(CustBookingService);
  private readonly providerService = inject(ProviderService);
  private readonly router = inject(Router);

  readonly completedBookings = signal<Booking[]>([]);
  readonly isLoading = signal(true);
  
  selectedBookingId = '';
  rating = 0;
  remarks = '';
  
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  ngOnInit() {
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        // Find completed bookings (mocking that we only allow rating once by not checking here, or just showing all completed)
        this.completedBookings.set(bookings.filter(b => b.status === 'Completed'));
        this.isLoading.set(false);
      }
    });
  }

  setRating(stars: number) {
    this.rating = stars;
  }

  onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.selectedBookingId) {
      this.errorMessage.set('Please select a service booking to rate.');
      return;
    }
    
    if (this.rating === 0) {
      this.errorMessage.set('Please provide a star rating.');
      return;
    }

    this.isSubmitting.set(true);

    // In a real app we'd save this to a ReviewService. 
    // Here we'll just mock success.
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set('Thank you! Your review has been submitted.');
      setTimeout(() => {
         this.router.navigate(['/customer/dashboard']);
      }, 1500);
    }, 800);
  }
}
