import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpAuthService } from '../../../core/services/sp-auth.service';

@Component({
  selector: 'app-sp-register',
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
  location = '';
  expertise: string[] = [];
  qualification = '';
  workExperience: number | null = null;
  hourlyRate: number | null = null;

  readonly availableExpertise = [
    'Plumbing', 'Sanitary', 'Electrical', 'AC Repair', 
    'Appliance Repair', 'Carpentry', 'Painting', 'General Repairs'
  ];

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  showPassword = false;
  showConfirmPassword = false;

  private readonly authService = inject(SpAuthService);
  private readonly router = inject(Router);

  toggleExpertise(exp: string): void {
    const idx = this.expertise.indexOf(exp);
    if (idx > -1) {
      this.expertise.splice(idx, 1);
    } else {
      this.expertise.push(exp);
    }
  }

  validatePassword(pw: string): string | null {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(pw)) return 'Password must contain a number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return 'Password must contain a special character.';
    return null;
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.name || !this.email || !this.password || !this.phone || !this.address || !this.location || this.workExperience === null || this.hourlyRate === null) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    if (this.expertise.length === 0) {
       this.errorMessage.set('Please select at least one area of expertise.');
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

    const spData = {
      fullName: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phone,
      address: this.address,
      location: this.location,
      expertise: this.expertise.join(', '),
      qualification: this.qualification,
      workExperience: this.workExperience || 0,
      hourlyRate: this.hourlyRate || 0,
      profilePic: null
    };

    this.authService.register(spData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Registration successful! Please wait for admin approval.');
        setTimeout(() => {
           this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Registration failed.');
      }
    });
  }
}
