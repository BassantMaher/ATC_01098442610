import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Event } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { DEFAULT_EVENT_IMAGE } from '../../config';

interface EventCardProps {
  event: Event;
  isBooked?: boolean;
  onBook?: (eventId: string) => void;
  loading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isBooked = false, 
  onBook,
  loading = false
}) => {
  const { t } = useTranslation();
  const { _id, title, date, venue, category, price, image, capacity, bookedCount } = event;
  
  const formattedDate = new Date(date).toLocaleDateString();
  const spotsLeft = capacity - bookedCount;
  const isSoldOut = spotsLeft <= 0;

  return (
    <Card className="h-full flex flex-col transition-transform duration-300 hover:transform hover:scale-[1.02]">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image || DEFAULT_EVENT_IMAGE} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="flex flex-col flex-grow">
        <Link to={`/events/${_id}`} className="block mt-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-blue-500" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center">
            <Tag size={16} className="mr-2 text-blue-500" />
            <span>{category}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </div>
          {spotsLeft > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {spotsLeft} {t('events.spots')}
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-4">
          {isBooked ? (
            <div className="px-3 py-2 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-center font-medium">
              {t('events.booked')}
            </div>
          ) : isSoldOut ? (
            <div className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center font-medium">
              {t('eventDetails.soldOut')}
            </div>
          ) : (
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => onBook && onBook(_id)}
              isLoading={loading}
            >
              {t('events.book')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;