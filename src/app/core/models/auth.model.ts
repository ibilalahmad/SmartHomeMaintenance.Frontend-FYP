export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  fullName: string;
  email: string;
  userType: 'Admin' | 'Customer' | 'ServiceProvider';
  profilePic: string | null;
  isActive: boolean;
  isApproved: boolean | null;
  token: string;
  message: string;
}

export interface CustomerRegister {
  fullName: string;
  email: string;
  password?: string; // used for forms, might not be kept in state
  phoneNumber: string;
  address: string | null;
  preferredPayment: string | null;
  profilePic: string | null;
}

export interface ServiceProviderRegister {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  expertise: string;
  workExperience: number;
  qualification: string | null;
  hourlyRate: number;
  location: string;
  profilePic: string | null;
}
