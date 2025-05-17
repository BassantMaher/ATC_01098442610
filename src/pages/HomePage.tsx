import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-blue-500 overflow-hidden rounded-xl shadow-xl mb-12">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Event"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:py-32 lg:px-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
            {t('home.title')}
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-blue-100 text-center">
            {t('home.subtitle')}
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <Link to="/events">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                {t('home.browseEvents')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-500 font-semibold tracking-wide uppercase">{t('home.features')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('home.oneStopPlatform')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              {t('home.discoverBookAttend')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                  <Calendar size={32} />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('home.wideRange')}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {t('home.eventTypes')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                  <Users size={32} />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('home.easyBooking2')}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {t('home.easyBooking')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                  <MapPin size={32} />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('home.nearbyVenues2')}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {t('home.nearbyVenues')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-amber-500 rounded-xl shadow-xl">
        <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            <span className="block">{t('home.startBrowsing')}</span>
            <span className="block text-amber-900">{t('home.startBrowsing2')}</span>
          </h2>
          <div className="mt-8 md:mt-0 text-amber-900">
            <Link to="/events">
              <Button variant="primary" size="lg" className="px-8 py-3 bg-white text-amber-900 hover:bg-gray-100">
              {t('home.browseEvents')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;