import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-800 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary" size="lg">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;