import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Page Components
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import ConfirmationPage from '../pages/ConfirmationPage';
import BookingsPage from '../pages/BookingsPage';
import AdminPage from '../pages/AdminPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode; 
  isAdmin?: boolean;
}> = ({ element, isAdmin = false }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return <div>Loading...</div>;
  }
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin && authState.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

// Guest Route Wrapper (redirect if already authenticated)
const GuestRoute: React.FC<{ 
  element: React.ReactNode;
}> = ({ element }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return <div>Loading...</div>;
  }
  
  if (authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

// Define routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/events/:id',
    element: <EventDetailPage />,
  },
  {
    path: '/confirmation/:id',
    element: <ProtectedRoute element={<ConfirmationPage />} />,
  },
  {
    path: '/bookings',
    element: <ProtectedRoute element={<BookingsPage />} />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute element={<AdminPage />} isAdmin={true} />,
  },
  {
    path: '/login',
    element: <GuestRoute element={<LoginPage />} />,
  },
  {
    path: '/register',
    element: <GuestRoute element={<RegisterPage />} />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;