import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { Booking } from '../../types';
import Button from '../ui/Button';

interface BookingTableProps {
  bookings: Booking[];
  onViewEvent: (eventId: string) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onViewEvent,
}) => {
  const { t } = useTranslation();

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300">{t('bookings.noBookings')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.bookingTable.event')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.bookingTable.user')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.bookingTable.date')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.bookingTable.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.event.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(booking.event.date).toLocaleDateString()} | {booking.event.venue}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{booking.user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewEvent(booking.event._id)}
                  leftIcon={<Eye size={16} />}
                >
                  {t('common.view')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;