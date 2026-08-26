import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Check tokens for Admin, Customer, or SP. Usually, a single token key is preferred, 
  // but we can check all if the app uses different ones based on who is logged in.
  const adminToken = localStorage.getItem('servifix_admin_token');
  const custToken = localStorage.getItem('servifix_cust_token');
  const spToken = localStorage.getItem('servifix_sp_token');

  const token = adminToken || custToken || spToken;

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
