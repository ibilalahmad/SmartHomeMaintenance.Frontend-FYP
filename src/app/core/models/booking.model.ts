// Booking-related TypeScript interfaces
// Replace mock data with HttpClient calls to ASP.NET 10 Web API when ready.

export interface BookingByMonth {
  m: string;      // Month label e.g. "Feb"
  done: number;   // Completed bookings count
  cancel: number; // Cancelled bookings count
}

export interface BookingByDay {
  day: string;    // Day number e.g. "1", "2"
  done: number;
  cancel: number;
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
  provider: string; // This will map to SP id in mock
  service: string;
  when: string;
  status: BookingStatus;
  phone?: string;
  address?: string;
  instructions?: string;
  paymentStatus?: 'Pending' | 'Paid';
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface RevenueData {
  month: string;
  amount: number;
}

export interface TopProvider {
  name: string;
  expertise: string;
  rating: number;
  bookings: number;
}
