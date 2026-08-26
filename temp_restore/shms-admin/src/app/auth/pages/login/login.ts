import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Form bindings
  email = '';
  password = '';
  rememberMe = false;

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

    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage.set('Invalid credentials. (Hint: Use admin@servifix.pk)');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('An unexpected error occurred. Please try again.');
      }
    });
  }
}
