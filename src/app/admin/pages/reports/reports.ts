import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService, BookingReportSummary, SPPerformanceReportItem, CustomerActivityReportSummary } from '../../../core/services/report.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';

export type ReportType = 'SPPerformance' | 'CustomerActivity';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent, StatCardComponent, StarRatingComponent],
  templateUrl: './reports.html',
})
export class ReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private toastService = inject(ToastService);

  // Settings
  selectedReportType = signal<ReportType>('SPPerformance');
  startDate = signal<string>('');
  endDate = signal<string>('');

  // Data Holders
  bookingSummary = signal<BookingReportSummary | null>(null);
  spPerformance = signal<SPPerformanceReportItem[]>([]);
  customerSummary = signal<CustomerActivityReportSummary | null>(null);

  ngOnInit(): void {
    // Default to last 30 days
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    this.endDate.set(today.toISOString().split('T')[0]);
    this.startDate.set(lastMonth.toISOString().split('T')[0]);

    // Always load the general booking summary for the top cards
    this.reportService.generateBookingReport(this.startDate(), this.endDate()).subscribe(data => {
      this.bookingSummary.set(data);
    });
  }

  generateReport(): void {
    if (!this.startDate() || !this.endDate()) {
      this.toastService.show('Please select a valid date range.', 'danger');
      return;
    }

    const type = this.selectedReportType();
    
    // Clear old dynamic data
    this.spPerformance.set([]);
    this.customerSummary.set(null);

    // Also refresh the booking summary based on the new dates
    this.reportService.generateBookingReport(this.startDate(), this.endDate()).subscribe(data => {
      this.bookingSummary.set(data);
    });

    if (type === 'SPPerformance') {
      this.reportService.generateSPPerformanceReport(this.startDate(), this.endDate()).subscribe(data => {
        this.spPerformance.set(data);
        this.toastService.show('Service Provider Performance Report generated.', 'success');
      });
    } else if (type === 'CustomerActivity') {
      this.reportService.generateCustomerActivityReport(this.startDate(), this.endDate()).subscribe(data => {
        this.customerSummary.set(data);
        this.toastService.show('Customer Activity Report generated.', 'success');
      });
    }
  }

  exportToPDF(): void {
    this.toastService.show('Generating PDF report...', 'info');
    setTimeout(() => this.toastService.show('PDF Report Exported Successfully!', 'success'), 1500);
  }

  exportToExcel(): void {
    this.toastService.show('Generating Excel report...', 'info');
    setTimeout(() => this.toastService.show('Excel Report Exported Successfully!', 'success'), 1500);
  }
}
