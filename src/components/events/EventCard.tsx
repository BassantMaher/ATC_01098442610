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
    <Card className="h-full flex flex-col group transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
      <div className="aspect-video w-full overflow-hidden rounded-t-xl">
        <img 
          src={image || DEFAULT_EVENT_IMAGE} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="flex flex-col flex-grow p-5">
        <Link to={`/events/${_id}`} className="block mt-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30">
            <Calendar size={16} className="mr-2 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30">
            <MapPin size={16} className="mr-2 text-blue-500" />
            <span className="line-clamp-1">{venue}</span>
          </div>
          <div className="flex items-center bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30">
            <Tag size={16} className="mr-2 text-blue-500" />
            <span>{category}</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </div>
          {spotsLeft > 0 && (
            <span className="text-sm font-medium px-3 py-1 bg-green-100/50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
              {spotsLeft} {t('events.spots')}
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-6">
          {isBooked ? (
            <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100 text-center font-medium backdrop-blur-sm">
              {t('events.booked')}
            </div>
          ) : isSoldOut ? (
            <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 text-center font-medium backdrop-blur-sm">
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