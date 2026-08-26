import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/pages/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'providers',
        loadComponent: () =>
          import('./admin/pages/providers/providers').then(m => m.ProvidersComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/pages/customers/customers').then(m => m.CustomersComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./admin/pages/bookings/bookings').then(m => m.BookingsComponent),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./admin/pages/reviews/reviews').then(m => m.ReviewsComponent),
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./admin/pages/complaints/complaints').then(m => m.ComplaintsComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/pages/reports/reports').then(m => m.ReportsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/pages/settings/settings').then(m => m.SettingsComponent),
      },
    ],
  },
  // Default redirect to admin dashboard (guarded)
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/dashboard' },
];
