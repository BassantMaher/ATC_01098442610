import React from 'react';

const EventDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
      
      <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
    </div>
  );
};

export default EventDetailsSkeleton;