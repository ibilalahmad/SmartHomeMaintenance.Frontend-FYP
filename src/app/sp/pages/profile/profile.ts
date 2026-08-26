import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpAuthService } from '../../../core/services/sp-auth.service';
import { SpProfileService } from '../../../core/services/sp-profile.service';
import { ProviderService } from '../../../core/services/provider.service';
import { Provider } from '../../../core/models/provider.model';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

@Component({
  selector: 'app-sp-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profile = signal<Provider | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);

  successMessage = signal('');
  errorMessage = signal('');
  pwSuccessMessage = signal('');
  pwErrorMessage = signal('');

  editName = '';
  editLocation = '';
  editAddress = '';
  editPhone = '';
  editExpertise: string[] = [];
  editQualification = '';
  editWorkExperience: number | null = null;
  editHourlyRate: number | null = null;
  editProfilePic = '';

  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  readonly availableExpertise = [
    'Plumbing', 'Sanitary', 'Electrical', 'AC Repair', 
    'Appliance Repair', 'Carpentry', 'Painting', 'General Repairs'
  ];

  private readonly authService = inject(SpAuthService);
  private readonly profileService = inject(SpProfileService);
  private readonly providerService = inject(ProviderService);
  private readonly toast = inject(ToastService);
  private readonly modal = inject(ConfirmationModalService);

  ngOnInit(): void {
    const sp = this.authService.currentSp();
    if (sp) {
      this.profile.set(sp);
      this.initEditFields(sp);

      // Fetch the full profile from the backend
      this.providerService.getProviderById(sp.providerId).subscribe({
        next: (fullProfile) => {
          this.profile.set(fullProfile);
          this.initEditFields(fullProfile);
        },
        error: (err) => {
          console.error('Failed to fetch full SP profile', err);
        }
      });
    }
  }

  private initEditFields(sp: Provider) {
    this.editName = sp.fullName;
    this.editLocation = sp.location;
    this.editAddress = sp.address || '';
    this.editPhone = sp.phoneNumber;
    this.editQualification = sp.qualification || '';
    this.editWorkExperience = sp.workExperience ?? 0;
    this.editHourlyRate = sp.hourlyRate ?? 0;
    this.editExpertise = sp.expertise ? sp.expertise.split(', ') : [];
    this.editProfilePic = sp.profilePic || '';
  }

  toggleEdit(): void {
    if (this.isEditing()) {
      this.initEditFields(this.profile()!);
    }
    this.isEditing.update(v => !v);
  }

  toggleExpertise(exp: string): void {
    const idx = this.editExpertise.indexOf(exp);
    if (idx > -1) {
      this.editExpertise.splice(idx, 1);
    } else {
      this.editExpertise.push(exp);
    }
  }

  saveProfile(): void {
    const p = this.profile();
    if (!p) return;

    this.isLoading.set(true);
    const updates = {
      fullName: this.editName,
      location: this.editLocation,
      address: this.editAddress,
      phoneNumber: this.editPhone,
      qualification: this.editQualification,
      workExperience: this.editWorkExperience || 0,
      hourlyRate: this.editHourlyRate || 0,
      expertise: this.editExpertise.join(', '),
      profilePic: this.editProfilePic
    };

    this.providerService.updateProvider(p.providerId, updates).subscribe({
      next: (res) => {
        const updatedSp = { ...p, ...updates, profilePic: updates.profilePic || null, qualification: updates.qualification || null, address: updates.address || null };
        this.profile.set(updatedSp);
        
        const currentAuthSp = this.authService.currentSp();
        if (currentAuthSp && currentAuthSp.providerId === p.providerId) {
           this.authService.currentSp.set({ ...currentAuthSp, ...updatedSp });
        }

        this.isEditing.set(false);
        this.isLoading.set(false);
        this.successMessage.set('Profile updated successfully!');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Update Error:', err);
        this.errorMessage.set('Failed to update profile.');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  changePassword(): void {
     if (this.newPassword !== this.confirmNewPassword) {
         this.pwErrorMessage.set('New passwords do not match.');
         setTimeout(() => this.pwErrorMessage.set(''), 3000);
         return;
     }

     if (!this.currentPassword || !this.newPassword) return;

     this.isLoading.set(true);
     this.authService.changePassword(this.profile()!.providerId, this.currentPassword, this.newPassword).subscribe({
         next: () => {
             this.isLoading.set(false);
             this.pwSuccessMessage.set('Password updated successfully.');
             setTimeout(() => this.pwSuccessMessage.set(''), 3000);
             this.currentPassword = '';
             this.newPassword = '';
             this.confirmNewPassword = '';
         },
         error: (err) => {
             this.isLoading.set(false);
             this.pwErrorMessage.set(err.error?.message || 'Failed to update password. Please check your current password.');
             setTimeout(() => this.pwErrorMessage.set(''), 3000);
         }
     });
  }

  private readonly router = inject(Router);

  async deleteAccount(): Promise<void> {
      const confirmed = await this.modal.confirm({
          title: 'Delete Account',
          message: 'Are you sure you want to delete your account? This action cannot be undone.',
          confirmText: 'Delete',
          confirmColor: 'danger'
      });

      if (confirmed) {
          this.providerService.deleteAccount(this.profile()!.providerId).subscribe(() => {
              this.authService.logout();
              this.router.navigate(['/login']);
          });
      }
  }

  toggleAvailability(): void {
      const p = this.profile();
      if (!p) return;
      // Using 'Active' and 'Unavailable' as mock statuses. The model has 'Pending' | 'Active' | 'Blocked'
      // If we need a strict unavailable state, we can use a custom property, but let's toggle a flag or just use a message.
      this.toast.show('Availability toggled (Mock).', 'info');
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editProfilePic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
