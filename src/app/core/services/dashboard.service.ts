import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookingByMonth, BookingByDay, ServiceSplit, RecentBooking, RevenueData, TopProvider } from '../models/booking.model';
import { PendingApproval } from '../models/provider.model';

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

  getBookingsByDay(monthOffset: number): Observable<BookingByDay[]> {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthOffset);
    const totalDaysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
    const currentDay = monthOffset === 0 ? new Date().getDate() : totalDaysInMonth;

    const days: BookingByDay[] = [];
    const baseDone = monthOffset === 0 ? 15 : (monthOffset === -1 ? 12 : 10);
    
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({
        day: i.toString(),
        done: i <= currentDay ? Math.floor(Math.random() * baseDone) + 2 : 0,
        cancel: i <= currentDay ? Math.floor(Math.random() * 3) : 0,
      });
    }
    return of(days);
  }

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

  private revenueData: RevenueData[] = [
    { month: 'Feb', amount: 8400 },
    { month: 'Mar', amount: 9200 },
    { month: 'Apr', amount: 8900 },
    { month: 'May', amount: 11500 },
    { month: 'Jun', amount: 10800 },
    { month: 'Jul', amount: 12450 },
  ];

  private topProviders: TopProvider[] = [
    { name: 'CleanPro Sanitary', expertise: 'Sanitary Work', rating: 4.9, bookings: 142 },
    { name: 'Volt Masters', expertise: 'Electrical', rating: 4.8, bookings: 128 },
    { name: 'Imran Plumbing Co.', expertise: 'Plumbing', rating: 4.7, bookings: 115 },
    { name: 'Bright Spark Electric', expertise: 'Electrical', rating: 4.6, bookings: 98 },
  ];

  getBookingsByMonth(): Observable<BookingByMonth[]> { return of(this.bookingsByMonth); }
  getServiceSplit():    Observable<ServiceSplit[]>    { return of(this.serviceSplit);    }
  getRecentBookings():  Observable<RecentBooking[]>  { return of(this.recentBookings);  }
  getPendingApprovals():Observable<PendingApproval[]>{ return of(this.pendingApprovals);}
  getRevenueData():     Observable<RevenueData[]>    { return of(this.revenueData);     }
  getTopProviders():    Observable<TopProvider[]>    { return of(this.topProviders);    }
}
