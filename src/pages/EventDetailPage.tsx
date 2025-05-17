import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Tag, Users, ArrowLeft, DollarSign } from 'lucide-react';
import { Event } from '../types';
import { eventsApi, bookingsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import EventDetailsSkeleton from '../components/events/EventDetailsSkeleton';
import { DEFAULT_EVENT_IMAGE } from '../config';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const eventData = await eventsApi.getEvent(id);
        setEvent(eventData);
        
        if (authState.isAuthenticated) {
          const bookingStatus = await bookingsApi.checkBookingStatus(id);
          setIsBooked(bookingStatus);
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id, authState.isAuthenticated]);
  
  const handleBook = async () => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!id) return;
    
    try {
      setBookingInProgress(true);
      await bookingsApi.bookEvent(id);
      navigate(`/confirmation/${id}`);
    } catch (err) {
      setError('Failed to book event. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <EventDetailsSkeleton />
      </Layout>
    );
  }
  
  if (error || !event) {
    return (
      <Layout>
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          <p>{error || 'Event not found'}</p>
          <Link to="/events" className="mt-4 inline-block text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {t('eventDetails.backToEvents')}
          </Link>
        </div>
      </Layout>
    );
  }
  
  const { title, description, date, venue, category, price, image, capacity, bookedCount } = event;
  const formattedDate = new Date(date).toLocaleDateString();
  const spotsLeft = capacity - bookedCount;
  const isSoldOut = spotsLeft <= 0;
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6">
          <ArrowLeft size={16} className="mr-1" />
          {t('eventDetails.backToEvents')}
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 sm:h-96 overflow-hidden">
            <img 
              src={image || DEFAULT_EVENT_IMAGE} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <Calendar size={24} className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('events.date')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formattedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <MapPin size={24} className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('events.venue')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{venue}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <Tag size={24} className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('events.category')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{category}</p>
                </div>
              </div>
            </div>
            
            <div className="my-6 flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign size={24} className="text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center">
                <Users size={24} className="text-blue-500 mr-2" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {spotsLeft} / {capacity} {t('events.spots')}
                </span>
              </div>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t('events.decription')}</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{description}</p>
            </div>
            
            <div className="mt-8">
              {isBooked ? (
                <div className="px-4 py-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg text-center font-medium">
                  {t('eventDetails.booked')}
                </div>
              ) : isSoldOut ? (
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-center font-medium">
                  {t('eventDetails.soldOut')}
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  onClick={handleBook}
                  isLoading={bookingInProgress}
                >
                  {t('eventDetails.book')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;