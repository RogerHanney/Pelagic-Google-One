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
  category: string;
  partner: string;
  frequency: number; // 0-100%
  startDate: string;
  endDate: string;
}

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  user: string;
  topic: string;
  tags: string[];
  sentiment: 'Positive' | 'Neutral' | 'Mixed' | 'Negative';
}