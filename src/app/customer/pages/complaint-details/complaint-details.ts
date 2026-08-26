import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustComplaintService } from '../../../core/services/cust-complaint.service';
import { Complaint } from '../../../core/models/complaint.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cust-complaint-details',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './complaint-details.html'
})
export class ComplaintDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly complaintService = inject(CustComplaintService);

  readonly complaint = signal<Complaint | null>(null);
  readonly isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.complaintService.getComplaintById(id).subscribe({
        next: (c) => {
          this.complaint.set(c || null);
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'badge--amber';
      case 'In Review': return 'badge--blue';
      case 'Resolved': return 'badge--green';
      case 'Dismissed': return 'badge--red';
      default: return '';
    }
  }
}
