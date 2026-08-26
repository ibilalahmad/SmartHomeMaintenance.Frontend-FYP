import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SpAuthService } from '../../../core/services/sp-auth.service';
import { CustAuthService } from '../../../core/services/cust-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly spAuthService = inject(SpAuthService);
  private readonly custAuthService = inject(CustAuthService);
  private readonly router = inject(Router);

  // Form bindings
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  // UI state signals
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill in both email and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.genericLogin(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        try {
          if (response.userType === 'ServiceProvider') {
            this.spAuthService.setSpSession(response);
            this.router.navigate(['/sp/dashboard']);
          } else if (response.userType === 'Customer') {
            this.custAuthService.setCustomerSession(response);
            this.router.navigate(['/customer/dashboard']);
          } else if (response.userType === 'Admin') {
            this.authService.setAdminSession(response);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.errorMessage.set('Unknown user type.');
          }
        } catch (error: any) {
          this.errorMessage.set(error.message || 'Error occurred during login.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        
        let errorMsg = 'Invalid credentials or an unexpected error occurred.';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.message) {
            errorMsg = err.error.message;
          } else if (err.error.detail) {
            errorMsg = err.error.detail;
          } else if (err.error.title) {
            errorMsg = err.error.title;
          }
        }
        
        if (errorMsg.includes('Invalid email or password')) {
          errorMsg = 'Invalid email or password.';
        }
        
        this.errorMessage.set(errorMsg);
      }
    });
  }
}
