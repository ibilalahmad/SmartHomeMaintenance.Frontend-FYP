import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookingByMonth, ServiceSplit, RecentBooking } from '../models/booking.model';
import { PendingApproval } from '../models/provider.model';

// Mock data — mirrors data.js from the original template.
// Swap of() for this.http.get<T>() when the ASP.NET 10 API is ready.

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private bookingsByMonth: BookingByMonth[] = [
    { m: 'Feb', done: 52, cancel: 6 },
    { m: 'Mar', done: 61, cancel: 4 },
    { m: 'Apr', done: 58, cancel: 9 },
    { m: 'May', done: 70, cancel: 5 },
    { m: 'Jun', done: 66, cancel: 7 },
    { m: 'Jul', done: 74, cancel: 3 },
  ];

  private serviceSplit: ServiceSplit[] = [
    { name: 'Plumbing',          pct: 38, color: 'var(--primary)' },
    { name: 'Electrical',        pct: 29, color: 'var(--teal)'    },
    { name: 'Sanitary Work',     pct: 21, color: 'var(--amber)'   },
    { name: 'Appliance Repair',  pct: 12, color: 'var(--red)'     },
  ];

  private recentBookings: RecentBooking[] = [
    { customer: 'Ayesha Noor',   provider: 'Imran Plumbing Co.',    service: 'Pipe Leakage Repair', date: 'Jul 6, 2026', status: 'Completed'   },
    { customer: 'Hamza Sheikh',  provider: 'Bright Spark Electric', service: 'Wiring Inspection',  date: 'Jul 6, 2026', status: 'In Progress'  },
    { customer: 'Sara Khan',     provider: 'CleanPro Sanitary',     service: 'Bathroom Fitting',   date: 'Jul 5, 2026', status: 'Confirmed'    },
    { customer: 'Bilal Raza',    provider: 'Imran Plumbing Co.',    service: 'Water Tank Cleaning',date: 'Jul 5, 2026', status: 'Cancelled'    },
    { customer: 'Fatima Malik',  provider: 'Volt Masters',          service: 'AC Installation',    date: 'Jul 4, 2026', status: 'Completed'    },
  ];

  private pendingApprovals: PendingApproval[] = [
    { name: 'Usman Tariq',    expertise: 'Electrical, Appliance Repair', applied: '2 days ago'  },
    { name: 'Nadia Iqbal',    expertise: 'Sanitary Work',                applied: '1 day ago'   },
    { name: 'Kashif Mehmood', expertise: 'Plumbing',                     applied: '5 hours ago' },
  ];

  getBookingsByMonth(): Observable<BookingByMonth[]> { return of(this.bookingsByMonth); }
  getServiceSplit():    Observable<ServiceSplit[]>    { return of(this.serviceSplit);    }
  getRecentBookings():  Observable<RecentBooking[]>  { return of(this.recentBookings);  }
  getPendingApprovals():Observable<PendingApproval[]>{ return of(this.pendingApprovals);}
}
