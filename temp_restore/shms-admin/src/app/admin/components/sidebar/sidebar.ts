import { Component, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  badgeDanger?: boolean;
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
export class SidebarComponent {
  /** Emitted when a nav item is clicked (used to close mobile sidebar) */
  readonly navClicked = output<void>();

  readonly navGroups: NavGroup[] = [
    {
      groupLabel: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/admin/dashboard' },
      ],
    },
    {
      groupLabel: 'Manage',
      items: [
        { label: 'Service Providers', icon: 'bi-person-badge',    route: '/admin/providers',  badge: '6'                   },
        { label: 'Customers',         icon: 'bi-people',          route: '/admin/customers'                                },
        { label: 'Bookings',          icon: 'bi-calendar2-check', route: '/admin/bookings'                                 },
        { label: 'Ratings & Reviews', icon: 'bi-star-half',       route: '/admin/reviews'                                  },
        { label: 'Complaints',        icon: 'bi-flag',            route: '/admin/complaints', badge: '3', badgeDanger: true },
      ],
    },
    {
      groupLabel: 'Insights',
      items: [
        { label: 'Reports & Analytics', icon: 'bi-bar-chart-line', route: '/admin/reports' },
      ],
    },
  ];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onNavClick(): void {
    this.navClicked.emit();
  }

  onLogout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
