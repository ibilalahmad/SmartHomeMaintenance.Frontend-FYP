import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BookingByMonth, ServiceSplit, RecentBooking } from '../../../core/models/booking.model';
import { PendingApproval } from '../../../core/models/provider.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { StatCardComponent } from '../../components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, AvatarInitialsComponent, StatCardComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  bookingsByMonth = signal<BookingByMonth[]>([]);
  serviceSplit    = signal<ServiceSplit[]>([]);
  recentBookings  = signal<RecentBooking[]>([]);
  pendingApprovals= signal<PendingApproval[]>([]);

  /** Max total (done + cancel) used to scale bar heights */
  maxBookings = signal<number>(1);

  /** Segmented control selection */
  selectedPeriod = signal<'6m' | '1y'>('6m');

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getBookingsByMonth().subscribe(data => {
      this.bookingsByMonth.set(data);
      this.maxBookings.set(Math.max(...data.map(d => d.done + d.cancel)));
    });
    this.dashboardService.getServiceSplit().subscribe(data => this.serviceSplit.set(data));
    this.dashboardService.getRecentBookings().subscribe(data => this.recentBookings.set(data));
    this.dashboardService.getPendingApprovals().subscribe(data => this.pendingApprovals.set(data));
  }

  getBarHeight(value: number): number {
    return Math.round((value / this.maxBookings()) * 160);
  }

  onApprove(name: string): void {
    console.log('Approve:', name); // TODO: wire to API
  }

  onReject(name: string): void {
    console.log('Reject:', name); // TODO: wire to API
  }
}
