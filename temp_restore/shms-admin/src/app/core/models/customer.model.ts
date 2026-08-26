// Customer TypeScript interface

export interface Customer {
  name: string;
  bookings: number;
  complaints: number;
  joined: string;   // e.g. "Jan 2026"
  status: CustomerStatus;
}

export type CustomerStatus = 'Active' | 'Blocked';
