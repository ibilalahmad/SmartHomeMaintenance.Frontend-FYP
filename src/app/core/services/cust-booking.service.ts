import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking, BookingStatus } from '../models/booking.model';
import { CustAuthService } from './cust-auth.service';

export interface BookingPayload {
  providerId: string;
  providerName: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  instructions: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustBookingService {
  private readonly BOOKINGS_KEY = 'servifix_cust_bookings';
  private readonly authService = inject(CustAuthService);

  // We load bookings from localStorage
  private getStoredBookings(): Booking[] {
    return JSON.parse(localStorage.getItem(this.BOOKINGS_KEY) || '[]');
  }

  private saveBookings(bookings: Booking[]): void {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
  }

  // Get bookings for current customer
  getMyBookings(): Observable<Booking[]> {
    const custId = this.authService.currentCustomer()?.customerId;
    if (!custId) return of([]);
    
    // In our mock model, 'customer' string in Booking usually held a name, but we can match by name or by a new custId field.
    // Since we're using a dedicated localStorage key for our customer flows, we'll assume they all belong to the current customer.
    // Or rather, we filter by the customer's name for this mock.
    const custName = this.authService.currentCustomer()?.fullName;
    const all = this.getStoredBookings();
    
    // If empty, let's seed with some mock data for the test customer
    if (all.length === 0 && custName === 'Test Customer') {
      const initialBookings: Booking[] = [
        { id: 'BK-9001', customer: custName, provider: 'Test Provider', service: 'Plumbing', when: 'Jul 20, 2026 10:00 AM', status: 'Pending', address: '123 Test St', paymentStatus: 'Pending' },
        { id: 'BK-9002', customer: custName, provider: 'Volt Masters', service: 'Electrical', when: 'Jul 15, 2026 02:00 PM', status: 'Completed', address: '123 Test St', paymentStatus: 'Paid' }
      ];
      this.saveBookings(initialBookings);
      return of(initialBookings);
    }

    return of(all.filter(b => b.customer === custName));
  }

  getBookingById(id: string): Observable<Booking | undefined> {
    const all = this.getStoredBookings();
    return of(all.find(b => b.id === id));
  }

  // FR-CUST-40 to 48: Create Booking
  createBooking(payload: BookingPayload): Observable<Booking> {
    const currentCust = this.authService.currentCustomer();
    if (!currentCust) return throwError(() => new Error('Not authenticated'));

    const all = this.getStoredBookings();
    const myBookings = all.filter(b => b.customer === currentCust.fullName);

    // FR-CUST-48: Booking Limit (Max 3 pending/confirmed at once)
    const activeCount = myBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'In Progress').length;
    if (activeCount >= 3) {
      return throwError(() => new Error('You have reached the maximum limit of 3 active bookings.'));
    }

    const newBooking: Booking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      customer: currentCust.fullName,
      provider: payload.providerName,
      service: payload.serviceType,
      when: `${payload.date} ${payload.time}`,
      status: 'Pending',
      address: payload.address,
      instructions: payload.instructions,
      paymentStatus: 'Pending'
    };

    all.push(newBooking);
    this.saveBookings(all);

    return of(newBooking).pipe(delay(500));
  }

  // FR-CUST-54 to 58: Cancel Booking
  cancelBooking(id: string, reason: string): Observable<boolean> {
    const all = this.getStoredBookings();
    const idx = all.findIndex(b => b.id === id);
    
    if (idx === -1) return of(false);
    
    // Check restriction: can't cancel within 2 hours. (Mocking this by just checking status for now, or assume always true for mock).
    all[idx].status = 'Cancelled';
    // we could store the reason in a custom field, but we'll just update status
    this.saveBookings(all);
    return of(true).pipe(delay(500));
  }

  // FR-CUST-59 to 60: Reschedule Booking
  rescheduleBooking(id: string, newDate: string, newTime: string): Observable<boolean> {
    const all = this.getStoredBookings();
    const idx = all.findIndex(b => b.id === id);
    
    if (idx === -1) return of(false);
    
    all[idx].when = `${newDate} ${newTime}`;
    // Optionally change status back to pending approval, but we'll leave it
    this.saveBookings(all);
    return of(true).pipe(delay(500));
  }
}
