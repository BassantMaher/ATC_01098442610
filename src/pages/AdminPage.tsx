import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays, BookOpen, AlertCircle, Pencil } from 'lucide-react';
import { Event, Booking } from '../types';
import { eventsApi, bookingsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import EventForm from '../components/admin/EventForm';
import EventTable from '../components/admin/EventTable';
import BookingTable from '../components/admin/BookingTable';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'events' | 'bookings'>('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (authState.user && authState.user.role !== 'admin') {
      navigate('/');
    }

    fetchEvents();
  }, [authState.user, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getEvents(1, 100); // Get up to 100 events for admin view
      setEvents(data.events);
    } catch (err) {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getAllBookings();
      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'events' | 'bookings') => {
    setActiveTab(tab);
    if (tab === 'bookings' && bookings.length === 0) {
      fetchBookings();
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        setDeletingEvent(eventId);
        await eventsApi.deleteEvent(eventId);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (err) {
        setError('Failed to delete event.');
      } finally {
        setDeletingEvent(null);
      }
    }
  };

  const handleEventSubmit = async (eventData: Partial<Event>) => {
    try {
      setFormLoading(true);

      if (selectedEvent) {
        // Update existing event
        await eventsApi.updateEvent(selectedEvent._id, eventData);
      } else {
        // Create new event
        await eventsApi.createEvent(eventData);
      }

      setShowEventForm(false);
      fetchEvents();
    } catch (err) {
      setError('Failed to save event.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('admin.title')}
          </h1>

          {activeTab === 'events' && !showEventForm && (
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleCreateEvent}
            >
              {t('admin.createEvent')}
            </Button>
          )}

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {!showEventForm && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  className={`px-6 py-4 text-sm font-medium ${activeTab === 'events'
                      ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } flex items-center gap-2 transition-all duration-200`}
                  onClick={() => handleTabChange('events')}
                >
                  <CalendarDays className="w-5 h-5" />
                  {t('admin.events')}
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium ${activeTab === 'bookings'
                      ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } flex items-center gap-2 transition-all duration-200`}
                  onClick={() => handleTabChange('bookings')}
                >
                  <BookOpen className="w-5 h-5" />
                  {t('admin.bookings')}
                </button>
              </nav>
            </div>
          )}


          <div className="p-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500 dark:text-red-300" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : showEventForm ? (
              <Card className="p-2 md:p-6">
                <CardHeader className="flex items-center gap-2 pb-2 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                    {selectedEvent ? <Pencil className="w-6 h-6 text-blue-500" /> : <Plus className="w-6 h-6 text-blue-500" />}
                    <span>{selectedEvent ? t('admin.editEvent') : t('admin.createEvent')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 md:p-6">
                  <EventForm
                    event={selectedEvent || undefined}
                    onSubmit={handleEventSubmit}
                    onCancel={() => setShowEventForm(false)}
                    isLoading={formLoading}
                  />
                </CardContent>
              </Card>
            ) : activeTab === 'events' ? (
              <EventTable
                events={events}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                isDeleting={deletingEvent}
              />
            ) : (
              <BookingTable
                bookings={bookings}
                onViewEvent={handleViewEvent}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;