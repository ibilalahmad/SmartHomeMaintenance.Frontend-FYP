import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../../../core/services/provider.service';
import { CustBookingService } from '../../../core/services/cust-booking.service';
import { Provider } from '../../../core/models/provider.model';

@Component({
  selector: 'app-cust-book',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './book.html'
})
export class Book implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerService = inject(ProviderService);
  private readonly bookingService = inject(CustBookingService);

  readonly provider = signal<Provider | null>(null);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  // Form Data
  serviceType = '';
  date = '';
  time = '';
  address = '';
  instructions = '';

  availableServices: string[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.providerService.getProviderById(Number(id)).subscribe({
        next: (prov) => {
          this.provider.set(prov || null);
          if (prov) {
             // Mock parsing expertise string into array of services
             this.availableServices = prov.expertise.split(',').map(s => s.trim());
          }
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  onSubmit() {
    this.errorMessage.set('');
    
    if (!this.serviceType || !this.date || !this.time || !this.address) {
       this.errorMessage.set('Please fill out all required fields.');
       return;
    }
    
    // FR-CUST-46: Booking Validation (Rejects past dates)
    const selectedDate = new Date(`${this.date}T${this.time}`);
    if (selectedDate < new Date()) {
       this.errorMessage.set('Cannot book appointments in the past.');
       return;
    }

    const prov = this.provider();
    if (!prov) return;

    this.isSubmitting.set(true);

    this.bookingService.createBooking({
      providerId: prov.providerId.toString(),
      providerName: prov.fullName,
      serviceType: this.serviceType,
      date: this.date,
      time: this.time,
      address: this.address,
      instructions: this.instructions
    }).subscribe({
      next: (booking) => {
        this.isSubmitting.set(false);
        // FR-CUST-45: Confirmation page (we route to the details page of the new booking)
        this.router.navigate(['/customer/bookings', booking.id], { queryParams: { newlyCreated: true } });
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Failed to create booking.');
      }
    });
  }
}
