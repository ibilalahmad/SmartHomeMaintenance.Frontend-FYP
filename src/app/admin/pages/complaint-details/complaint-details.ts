import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service';
import { Complaint, ComplaintStatus } from '../../../core/models/complaint.model';
import { ProviderService } from '../../../core/services/provider.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-complaint-details',
  standalone: true,
  imports: [RouterLink, FormsModule, StatusBadgeComponent],
  templateUrl: './complaint-details.html',
})
export class ComplaintDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private complaintService = inject(ComplaintService);
  private providerService = inject(ProviderService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);

  complaint = signal<Complaint | undefined>(undefined);
  
  readonly statuses: ComplaintStatus[] = ['Pending', 'In Review', 'Resolved', 'Dismissed'];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadComplaint(id);
      }
    });
  }

  loadComplaint(id: string): void {
    this.complaintService.getComplaintById(id).subscribe(complaint => {
      if (complaint) {
        this.complaint.set({ ...complaint }); // Clone to allow local edits before saving
      } else {
        this.router.navigate(['/admin/complaints']);
      }
    });
  }

  updateComplaint(): void {
    const current = this.complaint();
    if (!current) return;

    if (current.status === 'Dismissed' && !current.dismissReason?.trim()) {
      this.toastService.show('A reason is required when dismissing a complaint.', 'danger');
      return;
    }

    this.complaintService.updateComplaint(current).subscribe(() => {
      this.toastService.show('Complaint updated successfully!', 'success');
    });
  }

  async sendWarning(): Promise<void> {
    const current = this.complaint();
    if (!current) return;

    const confirmed = await this.confirmationModalService.confirm({
      title: 'Issue Formal Warning',
      message: `Are you sure you want to issue a formal warning to <strong>${current.provider}</strong>? An email notification will be sent immediately.`,
      confirmText: 'Issue Warning',
      confirmColor: 'warning'
    });

    if (confirmed) {
      const updatedWarnings = (current.warningsIssued || 0) + 1;
      this.complaintService.updateComplaint({ ...current, warningsIssued: updatedWarnings }).subscribe(updated => {
        this.complaint.set(updated);
        this.toastService.show(`Warning recorded and email sent to ${current.provider}.`, 'success');
      });
    }
  }

  async blockProvider(): Promise<void> {
    const current = this.complaint();
    if (!current || !current.providerId) {
      this.toastService.show('Provider ID missing, cannot block.', 'danger');
      return;
    }

    const confirmed = await this.confirmationModalService.confirm({
      title: 'Block Provider',
      message: `Are you sure you want to block <strong>${current.provider}</strong>? They will be immediately restricted from accessing the platform.`,
      confirmText: 'Block Provider',
      confirmColor: 'danger'
    });

    if (confirmed) {
      const newStatus = 'Blocked';
      // Simulate fetching the provider and updating their status
      this.providerService.getProviderById(Number(current.providerId)).subscribe(provider => {
        if (provider) {
          this.providerService.updateProvider(provider.providerId, { ...provider, status: newStatus } as any).subscribe(() => {
          this.toastService.show(`Provider ${provider.fullName} has been ${newStatus.toLowerCase()}.`, 'success');
        });
        }
      });
    }
  }
}
