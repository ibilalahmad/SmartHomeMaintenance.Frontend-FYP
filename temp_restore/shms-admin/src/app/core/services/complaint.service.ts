import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Complaint } from '../models/complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintService {

  private complaints: Complaint[] = [
    { customer: 'Waqas Hussain', provider: 'QuickFix Repairs',      reason: 'Incomplete work, unprofessional behaviour', filed: 'Jul 5, 2026', status: 'Pending'   },
    { customer: 'Bilal Raza',    provider: 'Imran Plumbing Co.',    reason: 'Arrived 2 hours late without notice',       filed: 'Jul 3, 2026', status: 'In Review' },
    { customer: 'Hamza Sheikh',  provider: 'Bright Spark Electric', reason: 'Overcharged beyond quoted estimate',        filed: 'Jun 29, 2026',status: 'Resolved'  },
  ];

  getAll(): Observable<Complaint[]> { return of(this.complaints); }
}
