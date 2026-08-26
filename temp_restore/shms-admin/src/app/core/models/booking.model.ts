// Booking-related TypeScript interfaces
// Replace mock data with HttpClient calls to ASP.NET 10 Web API when ready.

export interface BookingByMonth {
  m: string;      // Month label e.g. "Feb"
  done: number;   // Completed bookings count
  cancel: number; // Cancelled bookings count
}

export interface ServiceSplit {
  name: string;   // Service category name
  pct: number;    // Percentage of total bookings
  color: string;  // CSS color value
}

export interface RecentBooking {
  customer: string;
  provider: string;
  service: string;
  date: string;
  status: BookingStatus;
}

export interface Booking {
  id: string;
  customer: string;
  provider: string;
  service: string;
  when: string;
  status: BookingStatus;
}

export type BookingStatus =
  | 'Confirmed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';
