import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { Customer } from '../models/customer.model';
import { LoginRequest, LoginResponse, CustomerRegister } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustAuthService {
  private readonly TOKEN_KEY = 'servifix_cust_token';
  private apiUrl = `${environment.apiUrl}/Auth`;
  
  readonly isAuthenticated = signal<boolean>(this.checkToken());
  readonly currentCustomer = signal<Customer | null>(null);

  constructor(private http: HttpClient) {
    if (this.isAuthenticated()) {
      // In a real app, you might decode the JWT or fetch the profile here
      // For now we'll just set it to a placeholder or fetch it if needed.
    }
  }

  register(custData: CustomerRegister): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/customer`, custData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isAuthenticated.set(true);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  setCustomerSession(response: LoginResponse): void {
    if (response.token && response.userType === 'Customer') {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      this.isAuthenticated.set(true);
      this.currentCustomer.set({
        customerId: response.userId,
        fullName: response.fullName,
        email: response.email,
        phoneNumber: '',
        address: null,
        preferredPayment: null,
        defaultAddress: null,
        loyaltyPoints: 0,
        profilePic: response.profilePic,
        regDate: new Date().toISOString(),
        isActive: response.isActive,
        status: response.isActive ? 'Active' : 'Blocked'
      } as Customer);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.token && response.userType === 'Customer') {
          this.setCustomerSession(response);
        } else {
          throw new Error('Not a customer account.');
        }
      }),
      catchError(err => throwError(() => err))
    );
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.currentCustomer.set(null);
  }

  forgotPassword(email: string): Observable<boolean> {
    // Mock for now unless API provides an endpoint
    return of(true); 
  }

  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/${userId}`, { oldPassword, newPassword });
  }

  private checkToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
