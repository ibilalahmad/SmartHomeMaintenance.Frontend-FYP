import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProviderService } from '../../../core/services/provider.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Provider } from '../../../core/models/provider.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, AvatarInitialsComponent, FormsModule, DatePipe],
  templateUrl: './provider-details.html',
})
export class ProviderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private providerService = inject(ProviderService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  provider = signal<Provider | undefined>(undefined);
  
  showPasswordModal = false;
  newPasswordInput = '';
  showPassword = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.providerService.getProviderById(Number(id)).subscribe(provider => {
          if (provider) {
            if (!provider.isActive) {
              provider.status = 'Blocked';
            } else if (!provider.isApproved) {
              provider.status = 'Pending';
            } else {
              provider.status = 'Active';
            }
            this.provider.set(provider);
          } else {
            // Redirect back if provider not found
            this.router.navigate(['/admin/providers']);
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
    const p = this.provider();
    if (!p || !this.newPasswordInput) return;
    
    this.authService.adminResetPassword(p.providerId, this.newPasswordInput).subscribe({
       next: () => {
         this.toast.show('Password reset successfully!', 'success');
         this.showPasswordModal = false;
       },
       error: (err) => this.toast.show('Failed to reset password.', 'danger')
    });
  }
}
