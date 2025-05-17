import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { OAuthButtons } from '../components/auth/OAuthButtons';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = formData;
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError(null);
      await register(name, email, password);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card className="mt-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {t('auth.register.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <OAuthButtons className="mb-6" />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">{t('auth.register.orWithEmail')}</span>
                </div>
              </div>
              <div>
                <Input
                  label={t('auth.register.name')}
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  className='py-1 px-2'
                />
              </div>
              
              <div>
                <Input
                  label={t('auth.register.email')}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  className='py-1 px-2'
                />
              </div>
              
              <div>
                <Input
                  label={t('auth.register.password')}
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  className='py-1 px-2'
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                leftIcon={<UserPlus size={16} />}
              >
                {t('auth.register.submit')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.register.haveAccount')}{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  {t('auth.register.login')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;