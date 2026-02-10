import React from 'react';

export enum AppView {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  MARKETPLACE = 'MARKETPLACE',
  VEHICLES = 'VEHICLES',
  COMMUNITY = 'COMMUNITY',
  CHARITY = 'CHARITY',
  SERVICES = 'SERVICES',
  DELIVERY = 'DELIVERY',
  FLEXY = 'FLEXY',
  CHAT = 'CHAT',
  SELLER_DASHBOARD = 'SELLER_DASHBOARD',
  PROFILE = 'PROFILE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ADMIN_PANEL = 'ADMIN_PANEL'
}

export type UserRole = 'admin' | 'user' | 'seller';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  cover?: string;
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  targetId?: string;
  targetType?: 'user' | 'item';
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  tag: string;
  condition?: string;
  date: string;
  seller: {
    name: string;
    avatar?: string;
    verified?: boolean;
    rating?: number;
  };
  description?: string;
  images?: string[];
}

export interface CommunityPost {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export interface CharityEvent {
  id: string;
  title: string;
  location: string;
  joined: number;
  goal: number;
  progress: number;
  category: string;
  description?: string;
  date?: string;
}

export interface CurrencyRate {
  currency: string;
  buy: number;
  sell: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export interface MedicalService {
  id: string;
  name: string;
  type: 'Doctor' | 'Nurse' | 'Clinic' | 'Equipment';
  location: string;
  price: string;
  image: string;
  isAvailable: boolean;
  rating: number;
  specialty?: string;
  contactNumber?: string;
}

export interface DeliveryRequest {
  id: string;
  type: 'Delivery' | 'Moving';
  pickup: string;
  dropoff: string;
  date: string;
  budget: string;
  distance: string;
  vehicle: string;
  status: 'Open' | 'In Progress';
}