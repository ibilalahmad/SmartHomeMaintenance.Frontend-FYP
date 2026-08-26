import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Complaint } from '../models/complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintService {

  private complaints: Complaint[] = [
    { id: '1', customer: 'Waqas Hussain', provider: 'QuickFix Repairs', providerId: '4', reason: 'Incomplete work, unprofessional behaviour', filed: 'Jul 5, 2026', status: 'Pending', notes: '', bookingId: 'BKG-1029', evidenceLink: 'https://shms.com/evidence/1', warningsIssued: 0 },
    { id: '2', customer: 'Bilal Raza',    provider: 'Imran Plumbing Co.', providerId: '2', reason: 'Arrived 2 hours late without notice',       filed: 'Jul 3, 2026', status: 'In Review', notes: 'Contacted provider.', bookingId: 'BKG-1014', warningsIssued: 1 },
    { id: '3', customer: 'Hamza Sheikh',  provider: 'Bright Spark Electric', providerId: '3', reason: 'Overcharged beyond quoted estimate',        filed: 'Jun 29, 2026',status: 'Resolved', notes: 'Refund issued.', bookingId: 'BKG-0988', evidenceLink: 'https://shms.com/evidence/3', warningsIssued: 0, resolutionMessage: 'A partial refund has been issued to your account.' },
  ];

  getAll(): Observable<Complaint[]> { return of(this.complaints); }

  getComplaintById(id: string): Observable<Complaint | undefined> {
    const complaint = this.complaints.find(c => c.id === id);
    return of(complaint);
  }

  updateComplaint(updatedComplaint: Complaint): Observable<Complaint> {
    const index = this.complaints.findIndex(c => c.id === updatedComplaint.id);
    if (index !== -1) {
      this.complaints[index] = { ...updatedComplaint };
    }
    return of(updatedComplaint);
  }
}
