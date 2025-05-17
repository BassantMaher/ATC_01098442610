import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash } from 'lucide-react';
import { Event } from '../../types';
import Button from '../ui/Button';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  isDeleting: string | null;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const { t } = useTranslation();

  if (events.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300">{t('events.noEvents')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.eventTable.title')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.eventTable.date')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.eventTable.venue')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.eventTable.price')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.eventTable.bookings')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.eventTable.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {events.map((event) => (
            <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{event.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{event.venue}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">${event.price.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{event.bookedCount}/{event.capacity}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(event)}
                    leftIcon={<Edit size={16} />}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(event._id)}
                    isLoading={isDeleting === event._id}
                    leftIcon={<Trash size={16} />}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;