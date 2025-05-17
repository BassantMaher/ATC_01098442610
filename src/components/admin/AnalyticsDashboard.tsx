import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { bookingsApi } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface AnalyticsData {
  mostBookedEvents: Array<{
    title: string;
    bookedCount: number;
    capacity: number;
  }>;
  bookingTrends: Array<{
    _id: string;
    count: number;
  }>;
  activityHeatmap: Array<{
    _id: {
      hour: number;
      dayOfWeek: number;
    };
    count: number;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await bookingsApi.getAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  const { mostBookedEvents, bookingTrends, activityHeatmap } = analyticsData;

  // Format data for charts
  const bookingTrendsData = bookingTrends.map(trend => ({
    date: new Date(trend._id).toLocaleDateString(),
    bookings: trend.count,
  }));

  const mostBookedEventsData = mostBookedEvents.map(event => ({
    name: event.title,
    booked: event.bookedCount,
    capacity: event.capacity,
  }));

  // Create heatmap data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const heatmapData = activityHeatmap.map(item => ({
    hour: item._id.hour,
    day: daysOfWeek[item._id.dayOfWeek - 1],
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Most Booked Events */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.analytics.mostBookedEvents')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostBookedEventsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="booked" fill="#3B82F6" name="Booked" />
                <Bar dataKey="capacity" fill="#93C5FD" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Booking Trends */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.analytics.bookingTrends')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  name="Bookings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;