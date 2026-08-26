import { Component, OnInit, signal, computed, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { ModalService } from '../../../core/services/modal/modal.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusBadgeComponent, AvatarInitialsComponent, DatePipe],
  templateUrl: './providers.html',
})
export class ProvidersComponent implements OnInit {
  allProviders  = signal<Provider[]>([]);
  providers     = signal<Provider[]>([]);
  activeFilter  = signal<string>('All');
  searchQuery   = signal<string>('');

  // Pagination state
  Math = Math;
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizes = [5, 10, 25, 50];

  paginatedProviders = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.providers().slice(startIndex, startIndex + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.providers().length / this.pageSize());
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  @ViewChild('providerModal') providerModal!: TemplateRef<any>;
  @ViewChild('rejectSpModal') rejectSpModal!: TemplateRef<any>;

  newProvider: Provider = this.getEmptyProvider();
  rejectReason = signal<string>('');
  providerToReject: Provider | null = null;
  
  isEditing = false;

  readonly filters = ['All', '4+ Stars', 'Under 3 Stars', 'Pending', 'Blocked'];

  constructor(
    private providerService: ProviderService,
    private modalService: ModalService,
    private confirmationModalService: ConfirmationModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.providerService.getAllForAdmin().subscribe(data => {
      this.allProviders.set(data);
      this.applyFilters();
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.applyFilters();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  getProviderStatus(p: Provider): string {
    if (!p.isApproved) return 'Pending';
    if (!p.isActive) return 'Blocked';
    return 'Active';
  }

  private applyFilters(): void {
    let result = this.allProviders();
    const filter = this.activeFilter();
    const query  = this.searchQuery().toLowerCase();

    if (filter !== 'All') {
      result = result.filter(p => {
        const pStatus = this.getProviderStatus(p);
        if (filter === 'Pending' || filter === 'Blocked') return pStatus === filter;
        if (filter === '4+ Stars') return (p.avgRating || 0) >= 4;
        if (filter === 'Under 3 Stars') return p.avgRating !== null && p.avgRating !== undefined && p.avgRating < 3;
        return p.expertise.toLowerCase().includes(filter.toLowerCase());
      });
    }
    if (query) {
      result = result.filter(p =>
        p.fullName.toLowerCase().includes(query) ||
        p.expertise.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query)
      );
    }
    this.providers.set(result);
    this.currentPage.set(1); // Reset to first page on filter/search change
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  changePageSize(newSize: string): void {
    this.pageSize.set(parseInt(newSize, 10));
    this.currentPage.set(1);
  }

  newProviderPassword = '';

  openAddModal(): void {
    this.isEditing = false;
    this.newProvider = this.getEmptyProvider();
    this.newProviderPassword = '';
    this.modalService.open(this.providerModal, 'Add New Provider');
  }

  openEditModal(provider: Provider): void {
    this.isEditing = true;
    this.newProvider = { ...provider };
    this.newProviderPassword = '';
    this.modalService.open(this.providerModal, 'Edit Provider');
  }

  closeModal(): void {
    this.modalService.close();
  }

  submitProvider(): void {
    if (!this.newProvider.fullName || !this.newProvider.expertise || !this.newProvider.workExperience) return;
    
    if (this.isEditing) {
      this.providerService.updateProvider(this.newProvider.providerId, this.newProvider).subscribe({
        next: () => {
          this.toastService.show('Provider updated successfully!', 'success');
          this.loadProviders();
          this.closeModal();
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to update provider.', 'danger');
        }
      });
    } else {
      const payload = {
        fullName: this.newProvider.fullName,
        email: this.newProvider.email,
        password: this.newProviderPassword,
        phoneNumber: this.newProvider.phoneNumber,
        address: this.newProvider.address,
        location: this.newProvider.location,
        expertise: this.newProvider.expertise,
        qualification: this.newProvider.qualification,
        workExperience: this.newProvider.workExperience,
        hourlyRate: this.newProvider.hourlyRate,
        profilePic: this.newProvider.profilePic
      };
      
      this.providerService.createProvider(payload).subscribe({
        next: () => {
          this.toastService.show('Provider created successfully!', 'success');
          this.loadProviders();
          this.closeModal();
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to create provider.', 'danger');
        }
      });
    }
  }

  async deleteProvider(id: number | string): Promise<void> {
    const provider = this.allProviders().find(p => p.providerId === Number(id));
    const hasPendingBookings = provider?.bookingHistory?.some(b => b.status === 'Pending' || b.status === 'In Progress');
    
    if (hasPendingBookings) {
      this.toastService.show(`Cannot delete ${provider?.fullName}. They have active/pending bookings.`, 'danger');
      return;
    }

    const confirmed = await this.confirmationModalService.confirm({
      title: 'Delete Provider',
      message: `Are you sure you want to delete <strong>${provider?.fullName}</strong>? This action cannot be undone.`,
      confirmText: 'Delete Provider',
      confirmColor: 'danger'
    });

    if (confirmed) {
      this.providerService.deleteProvider(Number(id)).subscribe(() => {
        this.toastService.show('Provider deleted successfully.', 'success');
        this.loadProviders();
      });
    }
  }

  toggleBlock(provider: Provider): void {
    const pStatus = this.getProviderStatus(provider);
    const newStatus = pStatus === 'Blocked' ? 'Active' : 'Blocked';
    const isActive = newStatus === 'Active';
    
    this.providerService.toggleProviderActiveStatus(provider.providerId, isActive).subscribe(() => {
      this.toastService.show(`Provider ${newStatus === 'Blocked' ? 'blocked' : 'unblocked'}.`, 'success');
      this.loadProviders();
    });
  }

  resetPassword(provider: Provider): void {
    if (confirm(`Reset password for ${provider.fullName}?`)) {
      this.toastService.show(`Password reset link sent to ${provider.email || provider.fullName}.`, 'success');
    }
  }

  approveProvider(provider: Provider): void {
    this.providerService.approveProvider(provider.providerId, true).subscribe(() => {
      this.toastService.show(`${provider.fullName} has been approved.`, 'success');
      this.loadProviders();
    });
  }

  openRejectModal(provider: Provider): void {
    this.providerToReject = provider;
    this.rejectReason.set('');
    this.modalService.open(this.rejectSpModal, `Reject Provider: ${provider.fullName}`);
  }

  confirmRejectSp(): void {
    if (!this.rejectReason()) {
      this.toastService.show('Rejection reason is mandatory.', 'danger');
      return;
    }
    if (this.providerToReject) {
      this.providerService.deleteProvider(this.providerToReject.providerId).subscribe(() => {
        this.toastService.show(`Rejection email sent to ${this.providerToReject?.fullName}.`, 'success');
        this.loadProviders();
        this.closeModal();
      });
    }
  }

  private getEmptyProvider(): Provider {
    return {
      providerId: 0,
      fullName: '',
      email: '',
      phoneNumber: '',
      location: '',
      expertise: '',
      qualification: '',
      workExperience: 0,
      avgRating: 0,
      hourlyRate: 0,
      totalBookings: 0,
      isApproved: false,
      isActive: true,
      profilePic: null,
      status: 'Pending',
      registrationDate: '',
      remarks: [],
      bookingHistory: [],
      address: null
    };
  }
}
