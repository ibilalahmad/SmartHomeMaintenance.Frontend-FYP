import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {

  private bookings: Booking[] = [
    { id: 'BK-3021', customer: 'Ayesha Noor',   provider: 'Imran Plumbing Co.',    service: 'Pipe Leakage Repair',  when: 'Jul 6, 10:00 AM', status: 'Completed'  },
    { id: 'BK-3022', customer: 'Hamza Sheikh',  provider: 'Bright Spark Electric', service: 'Wiring Inspection',    when: 'Jul 6, 2:30 PM',  status: 'In Progress'},
    { id: 'BK-3023', customer: 'Sara Khan',     provider: 'CleanPro Sanitary',     service: 'Bathroom Fitting',     when: 'Jul 8, 11:00 AM', status: 'Confirmed'  },
    { id: 'BK-3024', customer: 'Bilal Raza',    provider: 'Imran Plumbing Co.',    service: 'Water Tank Cleaning',  when: 'Jul 5, 9:00 AM',  status: 'Cancelled'  },
    { id: 'BK-3025', customer: 'Fatima Malik',  provider: 'Volt Masters',          service: 'AC Installation',      when: 'Jul 4, 4:00 PM',  status: 'Completed'  },
    { id: 'BK-3026', customer: 'Waqas Hussain', provider: 'QuickFix Repairs',      service: 'Switchboard Repair',   when: 'Jul 9, 1:00 PM',  status: 'Confirmed'  },
  ];

  getAll(): Observable<Booking[]> { return of(this.bookings); }

  cancelBooking(id: string): Observable<boolean> {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'Cancelled';
      return of(true);
    }
    return of(false);
  }
}
