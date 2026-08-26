import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Complaint, ComplaintStatus } from '../models/complaint.model';
import { CustAuthService } from './cust-auth.service';

export interface ComplaintPayload {
  bookingId: string;
  providerName: string;
  reason: string;
  evidenceLink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustComplaintService {
  private readonly COMPLAINTS_KEY = 'servifix_cust_complaints';
  private readonly authService = inject(CustAuthService);

  private getStoredComplaints(): Complaint[] {
    return JSON.parse(localStorage.getItem(this.COMPLAINTS_KEY) || '[]');
  }

  private saveComplaints(complaints: Complaint[]): void {
    localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(complaints));
  }

  getMyComplaints(): Observable<Complaint[]> {
    const custName = this.authService.currentCustomer()?.fullName;
    if (!custName) return of([]);

    let all = this.getStoredComplaints();
    
    if (all.length === 0 && custName === 'Test Customer') {
      const initial: Complaint[] = [
        { id: 'CMP-8001', customer: custName, provider: 'Volt Masters', providerId: 'p-1', reason: 'Provider did not arrive on time', filed: 'Jul 15, 2026', status: 'In Review', notes: 'Admin is checking with the provider.', bookingId: 'BK-9002', warningsIssued: 0 }
      ];
      this.saveComplaints(initial);
      all = initial;
    }

    return of(all.filter(c => c.customer === custName));
  }

  getComplaintById(id: string): Observable<Complaint | undefined> {
    const all = this.getStoredComplaints();
    return of(all.find(c => c.id === id));
  }

  fileComplaint(payload: ComplaintPayload): Observable<Complaint> {
    const custName = this.authService.currentCustomer()?.fullName;
    const all = this.getStoredComplaints();
    
    // FR-CUST-75: No duplicate complaints for same booking
    if (all.find(c => c.bookingId === payload.bookingId && c.customer === custName && c.status !== 'Resolved' && c.status !== 'Dismissed')) {
      throw new Error('You already have an active complaint for this booking.');
    }

    const newComplaint: Complaint = {
      id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
      customer: custName || 'Unknown',
      provider: payload.providerName,
      providerId: 'unknown',
      reason: payload.reason,
      filed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
      notes: '',
      bookingId: payload.bookingId,
      evidenceLink: payload.evidenceLink,
      warningsIssued: 0
    };

    all.unshift(newComplaint);
    this.saveComplaints(all);
    return of(newComplaint).pipe(delay(500));
  }
}
