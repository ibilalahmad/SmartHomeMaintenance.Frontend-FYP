import { Component, output, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SpAuthService } from '../../../core/services/sp-auth.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html'
})
export class Topbar {
  readonly menuToggle = output<void>();

  readonly authService = inject(SpAuthService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ConfirmationModalService);

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  async onLogout(): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Log Out',
      confirmColor: 'danger'
    });

    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
