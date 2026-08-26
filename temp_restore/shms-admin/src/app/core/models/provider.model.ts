// Service Provider TypeScript interfaces

export interface Provider {
  name: string;
  expertise: string;
  experience: string;
  rating: number | null;
  status: ProviderStatus;
}

export interface PendingApproval {
  name: string;
  expertise: string;
  applied: string; // e.g. "2 days ago"
}

export type ProviderStatus = 'Active' | 'Pending' | 'Blocked';
