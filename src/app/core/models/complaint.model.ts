// Complaint TypeScript interface

export interface Complaint {
  id: string;
  customer: string;
  provider: string;
  reason: string;
  filed: string;    // e.g. "Jul 5, 2026"
  status: ComplaintStatus;
  notes?: string;
  bookingId?: string;
  evidenceLink?: string;
  dismissReason?: string;
  resolutionMessage?: string;
  warningsIssued?: number;
  providerId?: string;
}

export type ComplaintStatus = 'Pending' | 'In Review' | 'Resolved' | 'Dismissed';
