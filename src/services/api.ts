import axios from 'axios';
import { API_URL } from '../config';
import { Event, Booking } from '../types';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Events API
export const eventsApi = {
  // Get all events with optional pagination and filters
  getEvents: async (page = 1, limit = 9, category?: string, search?: string) => {
    let url = `/events?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get a single event by ID
  getEvent: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create a new event (admin only)
  createEvent: async (eventData: Partial<Event>) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update an existing event (admin only)
  updateEvent: async (id: string, eventData: Partial<Event>) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete an event (admin only)
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Bookings API
export const bookingsApi = {
  // Get all bookings for the current user
  getMyBookings: async () => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Book an event
  bookEvent: async (eventId: string) => {
    const response = await api.post('/bookings', { eventId });
    return response.data;
  },

  // Check if user has booked an event
  checkBookingStatus: async (eventId: string) => {
    try {
      const response = await api.get(`/bookings/check/${eventId}`);
      return response.data.isBooked;
    } catch (error) {
      return false;
    }
  },

  // Get booking analytics (admin only)
  getAnalytics: async () => {
    const response = await api.get('/bookings/analytics');
    return response.data;
  },
};

export default api;