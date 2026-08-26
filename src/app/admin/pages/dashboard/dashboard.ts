import { Component, OnInit, signal, TemplateRef, ViewChild, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProviderService } from '../../../core/services/provider.service';
import { BookingByMonth, BookingByDay, ServiceSplit, RecentBooking, RevenueData, TopProvider } from '../../../core/models/booking.model';
import { PendingApproval } from '../../../core/models/provider.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { ModalService } from '../../../core/services/modal/modal.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, AvatarInitialsComponent, StatCardComponent, FormsModule, DatePipe],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  bookingsByDay = signal<BookingByDay[]>([]);
  serviceSplit    = signal<ServiceSplit[]>([]);
  recentBookings  = signal<RecentBooking[]>([]);
  pendingApprovals= signal<PendingApproval[]>([]);
  revenueData     = signal<RevenueData[]>([]);
  topProviders    = signal<TopProvider[]>([]);

  // Key Analytics Dashboard Stats
  totalRegisteredCustomers = signal<number>(0);
  totalServiceProviders = signal<number>(0);
  totalBookingsThisMonth = signal<number>(341);
  pendingApprovalsCount = signal<number>(0);
  openComplaintsCount = signal<number>(3);
  averagePlatformRating = signal<number>(4.6);

  /** Max total (done + cancel) used to scale bar heights */
  maxBookings = signal<number>(1);

  /** Track which month we're viewing. 0 = current, -1 = last month */
  monthOffset = signal<number>(0);
  
  monthLabel = computed(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + this.monthOffset());
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  @ViewChild('rejectModal') rejectModal!: TemplateRef<any>;
  rejectReason = signal<string>('');
  selectedProviderForReject: string | null = null;

  private customerService = inject(CustomerService);
  private providerService = inject(ProviderService);

  constructor(
    private dashboardService: DashboardService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadGraphData();
    this.dashboardService.getServiceSplit().subscribe(data => this.serviceSplit.set(data));
    this.dashboardService.getRecentBookings().subscribe(data => this.recentBookings.set(data));
    this.dashboardService.getRevenueData().subscribe(data => this.revenueData.set(data));
    this.dashboardService.getTopProviders().subscribe(data => this.topProviders.set(data));

    // Fetch real data for Customers and Providers
    this.customerService.getAll().subscribe(customers => {
      this.totalRegisteredCustomers.set(customers.length);
    });

    this.providerService.getAllForAdmin().subscribe(providers => {
      this.totalServiceProviders.set(providers.length);
      const pending = providers.filter(p => !p.isApproved);
      this.pendingApprovalsCount.set(pending.length);
      
      const mappedPending: PendingApproval[] = pending.map(p => ({
        name: p.fullName,
        expertise: p.expertise,
        applied: p.registrationDate || 'Recently'
      }));
      this.pendingApprovals.set(mappedPending);
    });
  }

  loadGraphData(): void {
    this.dashboardService.getBookingsByDay(this.monthOffset()).subscribe(data => {
      this.bookingsByDay.set(data);
      this.maxBookings.set(Math.max(...data.map(d => d.done + d.cancel)));
    });
  }

  prevMonth(): void {
    this.monthOffset.update(v => v - 1);
    this.loadGraphData();
  }

  nextMonth(): void {
    if (this.monthOffset() < 0) {
      this.monthOffset.update(v => v + 1);
      this.loadGraphData();
    }
  }


  getBarHeight(value: number): number {
    return Math.round((value / this.maxBookings()) * 160);
  }

  getRevenueBarHeight(value: number): number {
    const max = Math.max(...this.revenueData().map(r => r.amount));
    return Math.round((value / max) * 160);
  }

  onApprove(name: string): void {
    this.toastService.show(`${name} has been approved.`, 'success');
    this.pendingApprovals.update(list => list.filter(p => p.name !== name));
  }

  onReject(name: string): void {
    this.selectedProviderForReject = name;
    this.rejectReason.set('');
    this.modalService.open(this.rejectModal, `Reject ${name}`);
  }

  confirmReject(): void {
    if (!this.rejectReason()) {
      this.toastService.show('Rejection reason is mandatory.', 'danger');
      return;
    }
    if (this.selectedProviderForReject) {
      this.toastService.show(`${this.selectedProviderForReject} has been rejected.`, 'success');
      this.pendingApprovals.update(list => list.filter(p => p.name !== this.selectedProviderForReject));
      this.modalService.close();
    }
  }

  cancelReject(): void {
    this.modalService.close();
  }
}
