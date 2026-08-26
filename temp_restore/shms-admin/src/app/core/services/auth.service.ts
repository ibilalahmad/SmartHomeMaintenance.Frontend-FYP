import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'servifix_admin_token';
  
  // Expose signal for reactive status checking in the app shell
  readonly isAuthenticated = signal<boolean>(this.checkToken());

  login(email: string, password: string): Observable<boolean> {
    // For demo/mock, accept any admin credentials or test accounts
    // e.g. admin@servifix.pk / admin123
    const success = email === 'admin@servifix.pk' || email.endsWith('@servifix.pk');
    
    if (success) {
      localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-auth-token-bilal');
      this.isAuthenticated.set(true);
    }
    
    // Simulate network delay
    return of(success).pipe(delay(800));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

  private checkToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
