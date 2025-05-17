import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Event } from '../types';
import { eventsApi, bookingsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import EventCard from '../components/events/EventCard';
import EventsGridSkeleton from '../components/events/EventsGridSkeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { EVENT_CATEGORIES, ITEMS_PER_PAGE } from '../config';

const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [bookedEvents, setBookedEvents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const fetchEvents = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const { events: newEvents, hasMore: moreEvents } = await eventsApi.getEvents(
        currentPage, 
        ITEMS_PER_PAGE,
        category,
        search
      );
      
      if (reset) {
        setEvents(newEvents);
        setPage(1);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      setHasMore(moreEvents);
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);
  
  const fetchBookingStatus = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      const bookingStatus: Record<string, boolean> = {};
      
      for (const event of events) {
        const isBooked = await bookingsApi.checkBookingStatus(event._id);
        bookingStatus[event._id] = isBooked;
      }
      
      setBookedEvents(bookingStatus);
    } catch (err) {
      console.error('Error fetching booking status:', err);
    }
  }, [events, authState.isAuthenticated]);
  
  useEffect(() => {
    fetchEvents(true);
  }, [category]);
  
  useEffect(() => {
    if (events.length > 0 && authState.isAuthenticated) {
      fetchBookingStatus();
    }
  }, [events, authState.isAuthenticated, fetchBookingStatus]);
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchEvents();
  };
  
  const handleBook = async (eventId: string) => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setBookingInProgress(eventId);
      await bookingsApi.bookEvent(eventId);
      setBookedEvents(prev => ({ ...prev, [eventId]: true }));
      navigate(`/confirmation/${eventId}`);
    } catch (err) {
      setError('Failed to book event. Please try again.');
    } finally {
      setBookingInProgress(null);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(true);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleClearFilters = () => {
    setCategory('');
    setSearch('');
    fetchEvents(true);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('events.title')}
          </h1>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {t('events.filter')}
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('events.filterByCategory')}
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="block w-full rounded-md shadow-sm border-gray-300 dark:border-gray-600 
                    text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 
                    focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('events.filterByCategory')}</option>
                  {EVENT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    label={t('events.search')}
                    id="search"
                    value={search}
                    onChange={handleSearchChange}
                    fullWidth
                  />
                  <div className="flex items-end space-x-2">
                    <Button 
                      type="submit"
                      variant="primary"
                      leftIcon={<Search size={16} />}
                    >
                      {t('events.search')}
                    </Button>
                    {(category || search) && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearFilters}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {loading && events.length === 0 ? (
          <EventsGridSkeleton count={6} />
        ) : events.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t('events.noEvents')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                isBooked={bookedEvents[event._id] || false}
                onBook={handleBook}
                loading={bookingInProgress === event._id}
              />
            ))}
          </div>
        )}
        
        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              isLoading={loading && events.length > 0}
              disabled={loading}
            >
              {t('events.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;