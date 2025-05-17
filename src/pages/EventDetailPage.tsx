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
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/events" className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-8 group">
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
          {t('eventDetails.backToEvents')}
        </Link>
        
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="h-[400px] sm:h-[500px] overflow-hidden relative group">
            <img 
              src={image || DEFAULT_EVENT_IMAGE} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm text-white flex items-center">
                    <Calendar size={18} className="mr-2" />
                    {formattedDate}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm text-white flex items-center">
                    <MapPin size={18} className="mr-2" />
                    {venue}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm text-white flex items-center">
                    <Tag size={18} className="mr-2" />
                    {category}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-wrap gap-8 items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-6 py-4 rounded-xl">
                <DollarSign size={28} className="text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('events.price')}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-6 py-4 rounded-xl">
                <Users size={28} className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('events.capacity')}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {spotsLeft} / {capacity}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('events.decription')}</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{description}</p>
            </div>
            
            <div className="mt-10">
              {isBooked ? (
                <div className="px-6 py-4 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100 rounded-xl text-center font-medium backdrop-blur-sm">
                  {t('eventDetails.booked')}
                </div>
              ) : isSoldOut ? (
                <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 rounded-xl text-center font-medium backdrop-blur-sm">
                  {t('eventDetails.soldOut')}
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  onClick={handleBook}
                  isLoading={bookingInProgress}
                  className="py-4 text-lg"
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