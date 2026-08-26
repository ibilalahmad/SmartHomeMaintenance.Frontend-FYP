export interface Provider {
  providerId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  workExperience: number;
  expertise: string;
  qualification: string | null;
  hourlyRate: number;
  isApproved: boolean; // true if approved by Admin, false if pending
  avgRating: number; // Decimal, 0.0 to 5.0
  totalBookings: number;
  location: string;
  profilePic: string | null;
  isActive: boolean;
  
  // Frontend specific optional fields to keep UI components somewhat happy temporarily
  status?: ProviderStatus;
  registrationDate?: string;
  remarks?: string[];
  bookingHistory?: { service: string, date: string, status: string }[];
}

export interface UpdateServiceProvider {
  fullName: string;
  phoneNumber: string;
  address: string | null;
  workExperience: number;
  expertise: string;
  qualification: string | null;
  hourlyRate: number;
  location: string;
  profilePic: string | null;
}

export interface PendingApproval {
  name: string; // Mapping back to old components
  expertise: string;
  applied: string;
}

export type ProviderStatus = 'Active' | 'Pending' | 'Blocked';
