import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useTranslation();
  const { authState, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/events', label: t('nav.events') },
  ];

  const authLinks = authState.isAuthenticated
    ? [
        { path: '/bookings', label: t('nav.myBookings') },
        ...(authState.user?.role === 'admin' ? [{ path: '/admin', label: t('nav.admin') }] : []),
      ]
    : [
        { path: '/login', label: t('nav.login') },
        { path: '/register', label: t('nav.register') },
      ];

  const linkClasses = (active: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-500">{t('app.title')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={linkClasses(isActive(link.path))}
                >
                  {link.label}
                </Link>
              ))}
              {authLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={linkClasses(isActive(link.path))}
                >
                  {link.label}
                </Link>
              ))}
              {authState.isAuthenticated && (
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label={language === 'en' ? t('language.ar') : t('language.en')}
              >
                <Globe size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block ${linkClasses(isActive(link.path))}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block ${linkClasses(isActive(link.path))}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            {authState.isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {t('nav.logout')}
              </button>
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <button
                onClick={toggleTheme}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                {theme === 'dark' ? t('theme.light') : t('theme.dark')}
              </button>
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ar' : 'en');
                  closeMenu();
                }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Globe size={16} className="mr-2" />
                {language === 'en' ? t('language.ar') : t('language.en')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;