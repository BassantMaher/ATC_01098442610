import React from 'react';

interface EventsGridSkeletonProps {
  count?: number;
}

const EventCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-video w-full bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="mt-4">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

const EventsGridSkeleton: React.FC<EventsGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default EventsGridSkeleton;