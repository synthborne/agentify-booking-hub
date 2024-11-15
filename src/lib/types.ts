export type UserRole = 'customer' | 'agent';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  region: string;
  district: string;
  walletId: string;
}

export interface Agent extends User {
  charges: number;
  aboutMe: string;
  workingHours: 'nine-to-five' | 'flexible';
  workingDays: 'weekdays' | 'weekends' | 'full-week';
  rating: number;
  reviewCount: number;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  region?: string;
  district?: string;
  walletId?: string;
  role?: UserRole;
  charges?: number;
  aboutMe?: string;
  workingHours?: 'nine-to-five' | 'flexible';
  workingDays?: 'weekdays' | 'weekends' | 'full-week';
}