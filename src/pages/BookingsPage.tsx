import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bookingsApi } from '../services/api';
import { Booking } from '../types';
import Layout from '../components/Layout';
import BookingCard from '../components/bookings/BookingCard';

const BookingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingsApi.getMyBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('bookings.title')}
        </h1>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {t('bookings.noBookings')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingsPage;