export type UserRole = 'customer' | 'agent';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  state: string;
  district: string;
  about_me?: string;
  wallet_id: string;
  created_at: string;
  updated_at: string;
}

export interface AgentDetails {
  id: string;
  working_hours: 'nine-to-five' | 'flexible';
  working_days: 'weekdays' | 'weekends' | 'full-week';
  service_charge: number;
  rating: number;
  review_count: number;
}

export interface Booking {
  id: string;
  customer_id: string;
  agent_id: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  role?: UserRole;
  full_name?: string;
  state?: string;
  district?: string;
  wallet_id?: string;
  working_hours?: 'nine-to-five' | 'flexible';
  working_days?: 'weekdays' | 'weekends' | 'full-week';
  service_charge?: number;
  about_me?: string;
}