import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustAuthService } from '../../../core/services/cust-auth.service';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

@Component({
  selector: 'app-cust-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  private readonly authService = inject(CustAuthService);

  private readonly customerService = inject(CustomerService);

  readonly customer = signal<Customer | null>(null);
  readonly isSaving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  editFullName = '';
  editPhoneNumber = '';
  profilePic: string | ArrayBuffer | null = '';
  address = '';
  preferredPayment = '';
  defaultAddress = '';
  profilePicture = '';

  // Password
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  pwSuccessMessage = signal('');
  pwErrorMessage = signal('');
  isChangingPassword = signal(false);

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    const cust = this.authService.currentCustomer();
    if (cust) {
      // First set whatever we have from auth state so UI doesn't look completely empty
      this.customer.set(cust);
      this.editFullName = cust.fullName;
      this.editPhoneNumber = cust.phoneNumber || '';
      
      // Then fetch the full profile from the backend to get all fields
      this.customerService.getCustomerById(cust.customerId).subscribe({
        next: (fullProfile) => {
          this.customer.set(fullProfile);
          this.editFullName = fullProfile.fullName;
          this.editPhoneNumber = fullProfile.phoneNumber || '';
          this.address = fullProfile.address || '';
          this.preferredPayment = fullProfile.preferredPayment || '';
          this.defaultAddress = fullProfile.defaultAddress || '';
          this.profilePic = fullProfile.profilePic || '';
        },
        error: (err) => {
          console.error('Failed to fetch full customer profile', err);
        }
      });
    }
  }

  saveProfile() {
    this.isSaving.set(true);
    this.successMessage.set('');
    
    const current = this.customer();
    if (!current) return;

    const updateData = {
      fullName: this.editFullName,
      phoneNumber: this.editPhoneNumber,
      address: this.address,
      preferredPayment: this.preferredPayment,
      defaultAddress: this.defaultAddress,
      profilePic: this.profilePic as string
    };

    this.customerService.updateCustomer(current.customerId, updateData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Profile updated successfully.');
        setTimeout(() => this.successMessage.set(''), 3000);
        
        current.fullName = this.editFullName;
        current.phoneNumber = this.editPhoneNumber;
        current.address = this.address;
        current.preferredPayment = this.preferredPayment;
        current.defaultAddress = this.defaultAddress;
        current.profilePic = this.profilePic as string;
        this.customer.set({...current});
        
        // Update the current customer in auth service so UI reflects globally (topbar, dashboard)
        const currentAuthCust = this.authService.currentCustomer();
        if (currentAuthCust && currentAuthCust.customerId === current.customerId) {
           this.authService.currentCustomer.set({ ...currentAuthCust, ...current });
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error(err);
        this.errorMessage.set('Failed to update profile.');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toast = inject(ToastService);

  changePassword() {
    this.pwSuccessMessage.set('');
    this.pwErrorMessage.set('');
    this.cdr.detectChanges();

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.pwErrorMessage.set('Please fill out all password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.pwErrorMessage.set('New passwords do not match.');
      return;
    }

    const current = this.customer();
    if (!current) return;

    this.isChangingPassword.set(true);
    this.cdr.detectChanges();

    this.authService.changePassword(current.customerId, this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.isChangingPassword.set(false);
        this.pwSuccessMessage.set('Password updated successfully.');
        setTimeout(() => this.pwSuccessMessage.set(''), 3000);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.pwErrorMessage.set(err.error?.message || 'Failed to change password. Please check your current password.');
        setTimeout(() => this.pwErrorMessage.set(''), 3000);
        this.cdr.detectChanges();
      }
    });
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private readonly modal = inject(ConfirmationModalService);
  private readonly router = inject(Router);

  async deleteAccount(): Promise<void> {
    const current = this.customer();
    if (!current) return;

    const confirmed = await this.modal.confirm({
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (confirmed) {
      this.customerService.deleteAccount(current.customerId).subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
      });
    }
  }
}
