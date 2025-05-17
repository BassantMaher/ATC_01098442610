import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
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
    const { email, password } = formData;
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError(null);
      await login(email, password);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card className="mt-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {t('auth.login.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label={t('auth.login.email')}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  className='py-1'
                />
              </div>
              
              <div>
                <Input
                  label={t('auth.login.password')}
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  className='py-1'
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                leftIcon={<LogIn size={16} />}
              >
                {t('auth.login.submit')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.login.noAccount')}{' '}
                <Link to="/register" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  {t('auth.login.register')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;