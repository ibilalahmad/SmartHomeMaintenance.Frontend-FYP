import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth.guard';
import { SpLayout } from './layouts/sp-layout/sp-layout';
import { spAuthGuard } from './core/guards/sp-auth-guard';
import { CustLayout } from './layouts/cust-layout/cust-layout';
import { custAuthGuard } from './core/guards/cust-auth.guard';

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
        path: 'providers/:id',
        loadComponent: () =>
          import('./admin/pages/provider-details/provider-details').then(m => m.ProviderDetailsComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/pages/customers/customers').then(m => m.CustomersComponent),
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import('./admin/pages/customer-details/customer-details').then(m => m.CustomerDetailsComponent),
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
        path: 'complaints/:id',
        loadComponent: () =>
          import('./admin/pages/complaint-details/complaint-details').then(m => m.ComplaintDetailsComponent),
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

  {
    path: 'sp-register',
    loadComponent: () =>
      import('./sp/auth/register/register').then(m => m.Register),
  },
  {
    path: 'sp-forgot-password',
    loadComponent: () =>
      import('./sp/auth/forgot-password/forgot-password').then(m => m.ForgotPassword),
  },
  {
    path: 'sp',
    component: SpLayout,
    canActivate: [spAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./sp/pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./sp/pages/profile/profile').then(m => m.Profile),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./sp/pages/bookings/bookings').then(m => m.Bookings),
      },
      {
        path: 'bookings/:id',
        loadComponent: () =>
          import('./sp/pages/booking-details/booking-details').then(m => m.BookingDetails),
      },
      {
        path: 'ratings',
        loadComponent: () =>
          import('./sp/pages/ratings/ratings').then(m => m.Ratings),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./sp/pages/analytics/analytics').then(m => m.Analytics),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./sp/pages/notifications/notifications').then(m => m.Notifications),
      },
    ],
  },
  {
    path: 'customer-register',
    loadComponent: () =>
      import('./customer/auth/register/register').then(m => m.Register),
  },
  {
    path: 'customer-forgot-password',
    loadComponent: () =>
      import('./customer/auth/forgot-password/forgot-password').then(m => m.ForgotPassword),
  },
  {
    path: 'customer',
    component: CustLayout,
    canActivate: [custAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./customer/pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./customer/pages/profile/profile').then(m => m.Profile),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./customer/pages/search/search').then(m => m.Search),
      },
      {
        path: 'provider/:id',
        loadComponent: () =>
          import('./customer/pages/provider-profile/provider-profile').then(m => m.ProviderProfile),
      },
      {
        path: 'rate',
        loadComponent: () =>
          import('./customer/pages/rate/rate').then(m => m.Rate),
      },
      {
        path: 'book/:id',
        loadComponent: () =>
          import('./customer/pages/book/book').then(m => m.Book),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./customer/pages/bookings/bookings').then(m => m.Bookings),
      },
      {
        path: 'bookings/:id',
        loadComponent: () =>
          import('./customer/pages/booking-details/booking-details').then(m => m.BookingDetails),
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./customer/pages/complaints/complaints').then(m => m.Complaints),
      },
      {
        path: 'complaints/:id',
        loadComponent: () =>
          import('./customer/pages/complaint-details/complaint-details').then(m => m.ComplaintDetails),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./customer/pages/favorites/favorites').then(m => m.Favorites),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./customer/pages/notifications/notifications').then(m => m.Notifications),
      },
    ],
  },
  // Default redirect to admin dashboard (guarded)
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/dashboard' },
];
