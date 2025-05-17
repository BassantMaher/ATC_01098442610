export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  price: number;
  image: string;
  capacity: number;
  bookedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  event: Event;
  user: User;
  createdAt: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';