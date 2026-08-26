import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComplaintService } from '../../../core/services/complaint.service';
import { Complaint, ComplaintStatus } from '../../../core/models/complaint.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [StatusBadgeComponent, RouterLink],
  templateUrl: './complaints.html',
})
export class ComplaintsComponent implements OnInit {
  allComplaints = signal<Complaint[]>([]);
  complaints    = signal<Complaint[]>([]);
  activeFilter  = signal<string>('All');

  readonly filters: string[] = ['All', 'Pending', 'In Review', 'Resolved', 'Dismissed'];

  constructor(
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getAll().subscribe(data => {
      this.allComplaints.set(data);
      this.applyFilter();
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.applyFilter();
  }

  applyFilter(): void {
    const filter = this.activeFilter();
    this.complaints.set(
      filter === 'All'
        ? this.allComplaints()
        : this.allComplaints().filter(c => c.status === filter as ComplaintStatus)
    );
  }
}
