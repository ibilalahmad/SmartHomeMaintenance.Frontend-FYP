import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { CustAuthService } from '../services/cust-auth.service';

export const custAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(CustAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
