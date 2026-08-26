import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface BookingReportSummary {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  successRate: number; // percentage
}

export interface SPPerformanceReportItem {
  id: string;
  name: string;
  completedJobs: number;
  averageRating: number;
  complaintsReceived: number;
  status: 'Active' | 'Warned' | 'Blocked';
}

export interface CustomerActivityReportSummary {
  totalRegistered: number;
  activeLast3Months: number;
  totalBookings: number;
  averageBookingsPerCustomer: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {

  generateBookingReport(startDate: string, endDate: string): Observable<BookingReportSummary> {
    // Mock simulation based on dates (just returning static realistic data for UI consistency)
    return of({
      total: 382,
      completed: 310,
      cancelled: 32,
      pending: 40,
      successRate: 81.1
    });
  }

  generateSPPerformanceReport(startDate: string, endDate: string): Observable<SPPerformanceReportItem[]> {
    return of([
      { id: '1', name: 'QuickFix Repairs', completedJobs: 145, averageRating: 4.8, complaintsReceived: 1, status: 'Active' },
      { id: '2', name: 'Imran Plumbing Co.', completedJobs: 89, averageRating: 4.2, complaintsReceived: 3, status: 'Warned' },
      { id: '3', name: 'Bright Spark Electric', completedJobs: 210, averageRating: 4.9, complaintsReceived: 0, status: 'Active' },
      { id: '4', name: 'Elite Cleaners', completedJobs: 12, averageRating: 2.1, complaintsReceived: 5, status: 'Blocked' },
    ]);
  }

  generateCustomerActivityReport(startDate: string, endDate: string): Observable<CustomerActivityReportSummary> {
    return of({
      totalRegistered: 942,
      activeLast3Months: 615,
      totalBookings: 1845,
      averageBookingsPerCustomer: 1.95
    });
  }
}
