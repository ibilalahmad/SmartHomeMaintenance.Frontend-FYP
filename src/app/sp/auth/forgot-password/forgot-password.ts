import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpAuthService } from '../../../core/services/sp-auth.service';

@Component({
  selector: 'app-sp-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  email = '';
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  private readonly authService = inject(SpAuthService);

  onSubmit(): void {
    if (!this.email) {
      this.errorMessage.set('Please enter your email.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Password reset link sent! Check your email.');
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Error sending reset link.');
      }
    });
  }
}
