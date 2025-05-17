import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { Booking } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { DEFAULT_EVENT_IMAGE } from '../../config';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { t } = useTranslation();
  const { _id, event, createdAt } = booking;
  
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const eventDate = new Date(event.date).toLocaleDateString();

  return (
    <Card className="flex flex-col h-full">
      <div className="h-40 overflow-hidden">
        <img 
          src={event.image || DEFAULT_EVENT_IMAGE} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {event.title}
        </h3>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="mb-1">
            <span className="font-medium">{t('events.date')}:</span> {eventDate}
          </div>
          <div className="mb-1">
            <span className="font-medium">{t('events.venue')}:</span> {event.venue}
          </div>
          <div className="mb-3 flex items-center">
            <Clock size={16} className="mr-1 text-gray-500" />
            <span className="font-medium">{t('bookings.bookingDate')}:</span> {formattedDate}
          </div>
        </div>
        
        <div className="mt-auto pt-3">
          <Link to={`/events/${event._id}`}>
            <Button variant="outline" fullWidth>
              {t('bookings.viewEvent')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;