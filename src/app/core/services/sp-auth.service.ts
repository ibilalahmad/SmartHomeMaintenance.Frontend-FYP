import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of, map, delay } from 'rxjs';
import { Provider } from '../models/provider.model';
import { LoginRequest, LoginResponse, ServiceProviderRegister } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpAuthService {
  private readonly TOKEN_KEY = 'servifix_sp_token';
  private apiUrl = `${environment.apiUrl}/Auth`;
  
  readonly isAuthenticated = signal<boolean>(this.checkToken());
  readonly currentSp = signal<Provider | null>(null);

  constructor(private http: HttpClient) {
    if (this.isAuthenticated()) {
       // Typically decode JWT to restore state here
    }
  }

  register(spData: ServiceProviderRegister): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/service-provider`, spData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isAuthenticated.set(true);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  setSpSession(response: LoginResponse): void {
    if (response.token && response.userType === 'ServiceProvider') {
      if (response.isApproved === false) {
         throw new Error('Account is pending admin approval.');
      }
      if (response.isActive === false) {
         throw new Error('Account has been blocked.');
      }
      localStorage.setItem(this.TOKEN_KEY, response.token);
      this.isAuthenticated.set(true);
      this.currentSp.set({
        providerId: response.userId,
        fullName: response.fullName,
        email: response.email,
        phoneNumber: '', 
        address: null,
        workExperience: 0,
        expertise: '',
        qualification: null,
        hourlyRate: 0,
        isApproved: response.isApproved ?? true,
        avgRating: 0,
        totalBookings: 0,
        location: '',
        profilePic: response.profilePic,
        isActive: response.isActive,
        status: response.isActive ? 'Active' : 'Blocked'
      } as Provider);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.token && response.userType === 'ServiceProvider') {
          this.setSpSession(response);
        } else {
          throw new Error('Not a service provider account.');
        }
      }),
      catchError(err => throwError(() => err))
    );
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.currentSp.set(null);
  }

  forgotPassword(email: string): Observable<boolean> {
    return of(true).pipe(delay(1000));
  }

  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/${userId}`, { oldPassword, newPassword });
  }

  private checkToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
