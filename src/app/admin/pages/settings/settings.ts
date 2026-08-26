import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
})
export class SettingsComponent {
  fullName = 'Bilal Ahmed';
  email = 'admin@shms.com';
  profilePic = '';
  password = '';
  newPassword = '';

  constructor(private toastService: ToastService) {}

  saveChanges(): void {
    if (!this.fullName || !this.email) {
      this.toastService.show('Name and email are required.', 'danger');
      return;
    }
    this.toastService.show('Profile changes saved successfully.', 'success');
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profilePicInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Simulate file upload
      this.toastService.show('Uploading new profile picture...', 'info');
      setTimeout(() => {
        // Just mock a new random avatar for visual feedback
        this.profilePic = `https://i.pravatar.cc/150?u=${Math.random()}`;
        this.toastService.show('Profile picture updated!', 'success');
      }, 1000);
    }
  }

  changePassword(): void {
    if (!this.password || !this.newPassword) {
      this.toastService.show('Please enter your current and new password.', 'danger');
      return;
    }
    this.toastService.show('Password changed successfully.', 'success');
    this.password = '';
    this.newPassword = '';
  }
}
