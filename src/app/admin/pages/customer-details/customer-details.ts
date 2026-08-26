import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Customer } from '../../../core/models/customer.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, AvatarInitialsComponent, FormsModule, DatePipe],
  templateUrl: './customer-details.html',
})
export class CustomerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  customer = signal<Customer | undefined>(undefined);
  
  showPasswordModal = false;
  newPasswordInput = '';
  showPassword = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.customerService.getCustomerById(Number(id)).subscribe(customer => {
          if (customer) {
            if (!customer.isActive) {
              customer.status = 'Blocked';
            } else {
              customer.status = 'Active';
            }
            this.customer.set(customer);
          } else {
            this.router.navigate(['/admin/customers']);
          }
        });
      }
    });
  }

  resetPassword(): void {
    this.newPasswordInput = '';
    this.showPasswordModal = true;
  }

  confirmResetPassword(): void {
    const cust = this.customer();
    if (!cust || !this.newPasswordInput) return;
    
    this.authService.adminResetPassword(cust.customerId, this.newPasswordInput).subscribe({
       next: () => {
         this.toast.show('Password reset successfully!', 'success');
         this.showPasswordModal = false;
       },
       error: (err) => this.toast.show('Failed to reset password.', 'danger')
    });
  }
}
