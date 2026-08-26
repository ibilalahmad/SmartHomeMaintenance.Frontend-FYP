import { Component, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SpAuthService } from '../../../core/services/sp-auth.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  badgeDanger?: boolean;
  disabled?: boolean;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class Sidebar {
  readonly navClicked = output<void>();

  readonly navGroups: NavGroup[] = [
    {
      groupLabel: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/sp/dashboard' },
      ],
    },
    {
      groupLabel: 'Manage',
      items: [
        { label: 'Bookings',          icon: 'bi-calendar2-check', route: '/sp/bookings', badge: '1', disabled: true },
        { label: 'Ratings & Remarks', icon: 'bi-star-half',       route: '/sp/ratings', disabled: true },
      ],
    },
    {
      groupLabel: 'Insights',
      items: [
        { label: 'Analytics',         icon: 'bi-bar-chart-line',  route: '/sp/analytics', disabled: true },
      ],
    },
  ];

  private readonly authService = inject(SpAuthService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ConfirmationModalService);

  onNavClick(): void {
    this.navClicked.emit();
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
