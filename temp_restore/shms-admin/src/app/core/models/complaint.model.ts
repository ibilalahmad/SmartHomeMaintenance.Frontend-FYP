// Complaint TypeScript interface

export interface Complaint {
  customer: string;
  provider: string;
  reason: string;
  filed: string;    // e.g. "Jul 5, 2026"
  status: ComplaintStatus;
}

export type ComplaintStatus = 'Pending' | 'In Review' | 'Resolved' | 'Dismissed';
