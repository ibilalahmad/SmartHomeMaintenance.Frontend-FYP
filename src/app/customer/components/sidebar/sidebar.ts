import { Component, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CustAuthService } from '../../../core/services/cust-auth.service';
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
  selector: 'app-cust-sidebar',
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
        { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/customer/dashboard' },
      ],
    },
    {
      groupLabel: 'Services',
      items: [
        { label: 'Search Providers', icon: 'bi-search', route: '/customer/search', disabled: true },
        { label: 'My Bookings',      icon: 'bi-calendar2-check', route: '/customer/bookings', disabled: true },
        { label: 'Favorites',        icon: 'bi-heart', route: '/customer/favorites', disabled: true },
      ],
    },
    {
      groupLabel: 'Feedback',
      items: [
        { label: 'Complaints', icon: 'bi-exclamation-octagon', route: '/customer/complaints', disabled: true },
      ],
    },
  ];

  private readonly authService = inject(CustAuthService);
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
