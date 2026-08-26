import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustAuthService } from '../../../core/services/cust-auth.service';

@Component({
  selector: 'app-cust-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  address = '';
  preferredPayment = 'Cash on Delivery';
  defaultAddress = '';

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  showPassword = false;
  showConfirmPassword = false;

  private readonly authService = inject(CustAuthService);
  private readonly router = inject(Router);

  validatePassword(pw: string): string | null {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(pw)) return 'Password must contain a number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return 'Password must contain a special character.';
    return null;
  }

  // Password strength indicator based on rules
  getPasswordStrength(): { label: string, color: string } {
    if (!this.password) return { label: 'None', color: 'var(--muted)' };
    let strength = 0;
    if (this.password.length >= 8) strength++;
    if (/[A-Z]/.test(this.password)) strength++;
    if (/[a-z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) strength++;

    if (strength < 3) return { label: 'Weak', color: 'var(--red)' };
    if (strength < 5) return { label: 'Medium', color: 'var(--amber)' };
    return { label: 'Strong', color: 'var(--green)' };
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.name || !this.email || !this.password || !this.phone || !this.address) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    const pwError = this.validatePassword(this.password);
    if (pwError) {
      this.errorMessage.set(pwError);
      return;
    }

    this.isLoading.set(true);

    const custData = {
      fullName: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phone,
      address: this.address,
      preferredPayment: this.preferredPayment,
      defaultAddress: this.defaultAddress || this.address,
      profilePic: null
    };

    this.authService.register(custData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Registration successful! Redirecting to your dashboard...');
        setTimeout(() => {
           this.router.navigate(['/customer/dashboard']);
        }, 1500);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Registration failed.');
      }
    });
  }
}
