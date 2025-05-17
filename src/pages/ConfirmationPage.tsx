import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Calendar, MapPin, Tag } from 'lucide-react';
import { Event } from '../types';
import { eventsApi } from '../services/api';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const eventData = await eventsApi.getEvent(id);
        setEvent(eventData);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !event) {
    return (
      <Layout>
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-red-500 dark:text-red-400">{error || 'Event not found'}</p>
          <Link to="/events" className="mt-4 inline-block text-blue-500 hover:text-blue-700">
            {t('eventDetails.backToEvents')}
          </Link>
        </div>
      </Layout>
    );
  }
  
  const { title, date, venue, category } = event;
  const formattedDate = new Date(date).toLocaleDateString();
  const bookingReference = `BK-${id?.substring(0, 8).toUpperCase()}`;
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <CheckCircle size={64} className="text-green-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                {t('confirmation.title')}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 text-center">
                {t('confirmation.success')}
              </p>
            </div>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('confirmation.eventDetails')}
              </h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
                </div>
                
                <div className="flex items-center">
                  <Calendar size={16} className="text-blue-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">{formattedDate}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={16} className="text-blue-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">{venue}</span>
                </div>
                
                <div className="flex items-center">
                  <Tag size={16} className="text-blue-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">{category}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('confirmation.bookingReference')}</p>
              <p className="text-lg font-mono font-medium text-gray-900 dark:text-white">{bookingReference}</p>
            </div>
            
            <Link to="/bookings">
              <Button variant="primary" fullWidth>
                {t('confirmation.viewBookings')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;