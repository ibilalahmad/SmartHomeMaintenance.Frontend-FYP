export interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  preferredPayment: string | null;
  defaultAddress: string | null;
  loyaltyPoints: number;
  profilePic: string | null;
  regDate: string; // ISO DateTime string
  isActive: boolean;
  
  // Frontend specific optional fields to keep compatibility for UI components temporarily
  status?: CustomerStatus;
  bookings?: number;
  complaints?: number;
  bookingHistory?: { service: string, provider: string, date: string, status: string }[];
}

export interface UpdateCustomer {
  fullName: string;
  phoneNumber: string;
  address: string | null;
  preferredPayment: string | null;
  defaultAddress: string | null;
  profilePic: string | null;
}

export type CustomerStatus = 'Active' | 'Blocked';
