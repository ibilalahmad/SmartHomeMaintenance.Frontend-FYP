import { Component, OnInit, signal, computed, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { ModalService } from '../../../core/services/modal/modal.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusBadgeComponent, AvatarInitialsComponent, DatePipe],
  templateUrl: './customers.html',
})
export class CustomersComponent implements OnInit {
  allCustomers = signal<Customer[]>([]);
  customers    = signal<Customer[]>([]);
  searchQuery  = signal<string>('');

  // Pagination state
  Math = Math;
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizes = [5, 10, 25, 50];

  paginatedCustomers = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.customers().slice(startIndex, startIndex + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.customers().length / this.pageSize());
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  @ViewChild('customerModal') customerModal!: TemplateRef<any>;

  newCustomer: Customer = this.getEmptyCustomer();
  isEditing = false;

  constructor(
    private customerService: CustomerService,
    private modalService: ModalService,
    private confirmationModalService: ConfirmationModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe(data => {
      this.allCustomers.set(data);
      this.onSearch(this.searchQuery());
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    const q = query.toLowerCase();
    this.customers.set(
      q ? this.allCustomers().filter(c => 
        c.fullName.toLowerCase().includes(q) || 
        c.email?.toLowerCase().includes(q) ||
        c.phoneNumber?.toLowerCase().includes(q) ||
        c.defaultAddress?.toLowerCase().includes(q)
      ) : this.allCustomers()
    );
    this.currentPage.set(1); // Reset to first page on search change
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

  newCustomerPassword = '';

  openAddModal(): void {
    this.isEditing = false;
    this.newCustomer = this.getEmptyCustomer();
    this.newCustomerPassword = '';
    this.modalService.open(this.customerModal, 'Add New Customer');
  }

  openEditModal(customer: Customer): void {
    this.isEditing = true;
    this.newCustomer = { ...customer };
    this.newCustomerPassword = '';
    this.modalService.open(this.customerModal, 'Edit Customer');
  }

  closeModal(): void {
    this.modalService.close();
  }

  submitCustomer(): void {
    if (!this.newCustomer.fullName) return;
    
    if (this.isEditing) {
      this.customerService.updateCustomer(this.newCustomer.customerId, this.newCustomer as any).subscribe(() => {
        this.toastService.show('Customer updated successfully!', 'success');
        this.loadCustomers();
        this.closeModal();
      });
    } else {
      const payload = {
        fullName: this.newCustomer.fullName,
        email: this.newCustomer.email,
        password: this.newCustomerPassword,
        phoneNumber: this.newCustomer.phoneNumber,
        address: this.newCustomer.address,
        defaultAddress: this.newCustomer.defaultAddress,
        preferredPayment: this.newCustomer.preferredPayment,
        profilePic: this.newCustomer.profilePic
      };
      
      this.customerService.createCustomer(payload).subscribe({
        next: () => {
          this.toastService.show('Customer created successfully!', 'success');
          this.loadCustomers();
          this.closeModal();
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to create customer.', 'danger');
        }
      });
    }
  }

  async deleteCustomer(id: number | string): Promise<void> {
    const customer = this.allCustomers().find(c => c.customerId === Number(id));
    const confirmed = await this.confirmationModalService.confirm({
      title: 'Delete Customer',
      message: `Are you sure you want to delete <strong>${customer?.fullName}</strong>? This action cannot be undone.`,
      confirmText: 'Delete Customer',
      confirmColor: 'danger'
    });

    if (confirmed) {
      this.customerService.deleteCustomer(Number(id)).subscribe(() => {
        this.toastService.show('Customer deleted successfully.', 'success');
        this.loadCustomers();
      });
    }
  }

  resetPassword(customer: Customer): void {
    if (confirm(`Reset password for ${customer.fullName}?`)) {
      this.toastService.show(`Password reset link sent to ${customer.email || customer.fullName}.`, 'success');
    }
  }

  toggleBlock(customer: Customer): void {
    const newStatus = customer.status === 'Blocked' ? true : false;
    this.customerService.toggleCustomerActiveStatus(customer.customerId, newStatus).subscribe(() => {
      this.toastService.show(`Customer ${!newStatus ? 'blocked' : 'unblocked'} successfully.`, 'success');
      this.loadCustomers();
    });
  }

  private getEmptyCustomer(): Customer {
    return {
      customerId: 0,
      fullName: '',
      email: '',
      phoneNumber: '',
      address: null,
      preferredPayment: null,
      defaultAddress: null,
      loyaltyPoints: 0,
      profilePic: null,
      regDate: '',
      isActive: true,
      status: 'Active',
      bookingHistory: []
    };
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newCustomer.profilePic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
