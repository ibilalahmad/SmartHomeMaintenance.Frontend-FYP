import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking, BookingStatus } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class SpBookingService {
  private readonly BOOKINGS_KEY = 'servifix_mock_bookings';

  constructor() {
    this.initMockDb();
  }

  private initMockDb() {
    if (!localStorage.getItem(this.BOOKINGS_KEY)) {
      // Create some initial mock bookings if empty
      const mockBookings: Booking[] = [
        {
          id: 'B-1001',
          customer: 'Ali Khan',
          provider: 'sp-12345', // an example ID
          service: 'Plumbing Repair',
          when: new Date(Date.now() + 86400000).toISOString(),
          status: 'Pending',
          phone: '0300-1234567',
          address: 'House 123, Street 4, Gulberg, Lahore',
          instructions: 'Call upon arrival, sink is leaking badly.',
          paymentStatus: 'Pending'
        }
      ];
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(mockBookings));
    }
  }

  private getBookings(): Booking[] {
    return JSON.parse(localStorage.getItem(this.BOOKINGS_KEY) || '[]');
  }

  private saveBookings(bookings: Booking[]) {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
  }

  getBookingsForSp(spId: string): Observable<Booking[]> {
    const bookings = this.getBookings().filter(b => b.provider === spId);
    return of(bookings).pipe(delay(500));
  }

  getBookingById(bookingId: string): Observable<Booking> {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
       return throwError(() => new Error('Booking not found.'));
    }
    return of(booking).pipe(delay(300));
  }

  updateBookingStatus(bookingId: string, newStatus: BookingStatus): Observable<Booking> {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) {
      return throwError(() => new Error('Booking not found.'));
    }

    const currentStatus = bookings[index].status;
    // Basic validation to prevent going backward (Pending -> Confirmed -> In Progress -> Completed)
    const validTransitions: Record<string, string[]> = {
      'Pending': ['Confirmed', 'Cancelled'],
      'Confirmed': ['In Progress', 'Cancelled'],
      'In Progress': ['Completed'],
      'Completed': [],
      'Cancelled': []
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
       return throwError(() => new Error(`Cannot transition from ${currentStatus} to ${newStatus}`));
    }

    bookings[index].status = newStatus;
    if (newStatus === 'Completed') {
       bookings[index].paymentStatus = 'Paid'; // mock unlock payment
    }
    this.saveBookings(bookings);
    return of(bookings[index]).pipe(delay(500));
  }

  reportIssue(bookingId: string, issueText: string): Observable<boolean> {
    // Mock sending issue to admin
    console.log(`Issue reported for booking ${bookingId}: ${issueText}`);
    return of(true).pipe(delay(500));
  }
}
