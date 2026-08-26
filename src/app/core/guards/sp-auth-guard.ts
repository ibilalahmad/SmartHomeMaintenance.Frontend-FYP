import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SpAuthService } from '../services/sp-auth.service';

export const spAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(SpAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated, redirect to SP login
  router.navigate(['/login']);
  return false;
};
