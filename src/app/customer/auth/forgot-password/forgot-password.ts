import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustAuthService } from '../../../core/services/cust-auth.service';

@Component({
  selector: 'app-cust-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../register/register.css'
})
export class ForgotPassword {
  email = '';
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  private readonly authService = inject(CustAuthService);

  onSubmit(): void {
    if (!this.email) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('If your email is registered, you will receive a password reset link shortly.');
      },
      error: () => {
        this.isLoading.set(false);
        // We show the same message for security reasons
        this.successMessage.set('If your email is registered, you will receive a password reset link shortly.');
      }
    });
  }
}
