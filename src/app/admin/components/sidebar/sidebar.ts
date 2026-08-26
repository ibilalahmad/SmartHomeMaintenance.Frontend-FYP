import { Component, output, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { ProviderService } from '../../../core/services/provider.service';

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
export class SidebarComponent implements OnInit {
  /** Emitted when a nav item is clicked (used to close mobile sidebar) */
  readonly navClicked = output<void>();

  navGroups: NavGroup[] = [
    {
      groupLabel: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/admin/dashboard' },
      ],
    },
    {
      groupLabel: 'Manage',
      items: [
        { label: 'Service Providers', icon: 'bi-person-badge',    route: '/admin/providers', badge: '0' },
        { label: 'Customers',         icon: 'bi-people',          route: '/admin/customers'                                },
        { label: 'Bookings',          icon: 'bi-calendar2-check', route: '/admin/bookings', disabled: true },
        { label: 'Ratings & Reviews', icon: 'bi-star-half',       route: '/admin/reviews', disabled: true },
        { label: 'Complaints',        icon: 'bi-flag',            route: '/admin/complaints', badge: '3', badgeDanger: true, disabled: true },
      ],
    },
    {
      groupLabel: 'Insights',
      items: [
        { label: 'Reports & Analytics', icon: 'bi-bar-chart-line', route: '/admin/reports', disabled: true },
      ],
    },
  ];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ConfirmationModalService);
  private readonly providerService = inject(ProviderService);

  ngOnInit(): void {
    this.providerService.getAllForAdmin().subscribe(providers => {
      const pendingCount = providers.filter(p => !p.isApproved).length;
      const spItem = this.navGroups[1].items.find(item => item.label === 'Service Providers');
      if (spItem) {
        if (pendingCount > 0) {
          spItem.badge = pendingCount.toString();
        } else {
          spItem.badge = undefined;
        }
      }
    });
  }

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
