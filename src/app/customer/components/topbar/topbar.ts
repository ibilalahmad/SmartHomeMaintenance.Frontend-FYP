import { Component, output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustAuthService } from '../../../core/services/cust-auth.service';

@Component({
  selector: 'app-cust-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html'
})
export class Topbar {
  readonly menuToggle = output<void>();
  readonly authService = inject(CustAuthService);
  private readonly router = inject(Router);

  onMenuClick(): void {
    this.menuToggle.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
