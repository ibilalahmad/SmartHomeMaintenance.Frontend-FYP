import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AdminProfile {
  fullName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
})
export class SettingsComponent {
  /** Form fields for two-way data binding */
  fullName = 'Bilal Ahmed';
  email = 'admin@servifix.pk';
  password = '';

  saveChanges(): void {
    console.log('Save settings:', {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }); // TODO: POST to API
    alert('Settings saved! (Front-end demo only)');
  }
}
