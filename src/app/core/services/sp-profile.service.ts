import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Provider } from '../models/provider.model';
import { SpAuthService } from './sp-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpProfileService {
  private readonly USERS_KEY = 'servifix_mock_sps';

  constructor(private authService: SpAuthService) {}

  private getSps(): Provider[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  private saveSps(sps: Provider[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(sps));
  }

  updateProfile(spId: number, updates: Partial<Provider>): Observable<Provider> {
    const sps = this.getSps();
    const index = sps.findIndex(s => s.providerId === spId);
    
    if (index === -1) {
      return throwError(() => new Error('Service Provider not found.'));
    }

    const updatedSp = { ...sps[index], ...updates };
    sps[index] = updatedSp;
    this.saveSps(sps);
    
    const currentUser = this.authService.currentSp();
    if (currentUser && currentUser.providerId === spId) {
        const validSp = {...updatedSp} as any;
        delete validSp._password;
        this.authService.currentSp.set(validSp);
    }

    const retSp = {...updatedSp} as any;
    delete retSp._password;
    return of(retSp).pipe(delay(500));
  }

  updatePassword(spId: number, currentPass: string, newPass: string): Observable<boolean> {
    const sps = this.getSps();
    const index = sps.findIndex(s => s.providerId === spId);
    
    if (index === -1) {
      return throwError(() => new Error('Service Provider not found.'));
    }

    const sp: any = sps[index];
    if (sp._password !== currentPass) {
        return throwError(() => new Error('Incorrect current password.'));
    }

    sp._password = newPass;
    this.saveSps(sps);
    
    return of(true).pipe(delay(500));
  }

  deleteAccount(spId: number): Observable<boolean> {
      const sps = this.getSps();
      const index = sps.findIndex(s => s.providerId === spId);
      if (index > -1) {
          // Soft delete / anonymize
          sps[index].status = 'Blocked'; 
          sps[index].fullName = 'Deleted User';
          sps[index].email = `deleted_${Date.now()}@domain.com`;
          sps[index].phoneNumber = '';
          this.saveSps(sps);
      }
      return of(true).pipe(delay(500));
  }
}
