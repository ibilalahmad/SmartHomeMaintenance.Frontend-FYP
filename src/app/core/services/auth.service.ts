import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'servifix_admin_token';
  private apiUrl = `${environment.apiUrl}/Auth`;
  
  readonly isAuthenticated = signal<boolean>(this.checkToken());

  constructor(private http: HttpClient) {}

  genericLogin(email: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      catchError(err => throwError(() => err))
    );
  }

  setAdminSession(response: LoginResponse): void {
    if (response.token && response.userType === 'Admin') {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      this.isAuthenticated.set(true);
    }
  }

  // Backward compatibility for admin login specifically if used elsewhere
  login(email: string, password: string): Observable<LoginResponse> {
    return this.genericLogin(email, password).pipe(
      tap(response => {
        if (response.token && response.userType === 'Admin') {
          this.setAdminSession(response);
        } else {
          throw new Error('Not an admin account.');
        }
      })
    );
  }

  adminResetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Admin/users/${userId}/reset-password`, { newPassword });
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

  private checkToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
