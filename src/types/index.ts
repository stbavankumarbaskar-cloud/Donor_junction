export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  location?: string;
  city?: string;
  isAvailable: boolean;
  lastDonated?: string;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  totalDonations: number;
  livesSaved?: number;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  location?: string;
  city?: string;
  distance?: string | number;
  distanceKm?: string | number;
  phone: string;
  isAvailable: boolean;
  lastDonated?: string;
  lastDonatedDate?: string;
  rating?: number;
  verified?: boolean;
  totalDonations?: number;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospital?: string;
  hospitalName?: string;
  location?: string;
  city?: string;
  unitsNeeded: number;
  contactPerson?: string;
  contactPhone: string;
  urgency?: 'critical' | 'urgent' | 'standard' | 'CRITICAL' | 'MODERATE' | 'STANDARD' | string;
  urgencyLevel?: 'critical' | 'urgent' | 'standard' | 'CRITICAL' | 'MODERATE' | 'STANDARD' | string;
  requestedBy?: string;
  fulfilled?: boolean;
  createdAt: string;
  notes?: string;
}

export interface User {
  id?: number | string;
  name?: string;
  mobile?: string;
  phone?: string;
  blood_group?: string;
  dob?: string;
  gender?: string;
  last_donation_date?: string;
  address?: string;
  city?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
  profile_image?: string | null;
}

export interface Campaign {
  id: number | string;
  title: string;
  place: string;
  location?: string;
  org_name?: string;
  description: string;
  status: string;
  statusBg?: string;
  statusColor?: string;
  target?: number;
  collected?: number;
  date?: string;
  time?: string;
}

export interface Post {
  id: number | string;
  title: string;
  blood_group: string;
  location: string;
  description?: string;
  units_needed?: string;
  type?: 'normal' | 'urgent' | string;
  category?: 'donor' | 'seeker' | string;
  image?: string | null;
  image_base64?: string | null;
  mobile?: string;
  author_name?: string;
  author_avatar?: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  distance?: string;
}

export interface Blog {
  id: number | string;
  title: string;
  org_name?: string;
  description?: string;
  image_uri?: string | null;
  created_at?: string;
}

export interface NutritionTip {
  id: number;
  name: string;
  type: string;
  badgeColor: string;
  tag: string;
  image: any;
  teaser: string;
  nutrient: string;
  benefits: string[];
}

export interface ChatThread {
  id: string;
  name: string;
  partnerMobile?: string;
  partnerType?: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'partner' | 'hospital' | string;
}

export interface Certificate {
  id: number | string;
  title: string;
  issued_by: string;
  date: string;
  image_uri?: string | null;
}
