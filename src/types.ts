export interface PackagePrice {
  nights: number;
  sessions: number;
  basic: number;
  deluxe: number;
  premier: number;
}

export interface ScubaPrice {
  nights: number;
  basic: number;
  deluxe: number;
  premium: number;
}

export enum PackageType {
  FREEDIVING = 'FREEDIVING',
  SCUBA = 'SCUBA'
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Travel' | 'Diving' | 'Culture';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CoursePrice {
  name: string;
  price: number;
  details?: string;
}

export interface Sponsor {
  id: number;
  category: string;     // e.g. "Cameras"
  partner: string;      // e.g. "GoPro"
  frequency: number;    // 0-100% chance of mention
  startDate: string;    // YYYY-MM-DD
  endDate: string;      // YYYY-MM-DD
  active: boolean;
}

export interface LogEntry {
  id: string;
  date: string;         // YYYY-MM-DD
  time: string;
  user: string;         // e.g. "Guest (UK)"
  topic: string;
  categoryMatch?: string; // Used for ROI calculation
  brandMentioned?: string; // Used for ROI calculation
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}
