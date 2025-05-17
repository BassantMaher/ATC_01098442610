import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Event } from '../../types';
import { EVENT_CATEGORIES } from '../../config';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: Partial<Event>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Event>>({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    venue: event?.venue || '',
    category: event?.category || EVENT_CATEGORIES[0],
    price: event?.price || 0,
    capacity: event?.capacity || 100,
    image: event?.image || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'capacity' ? parseFloat(value) : value
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.price === undefined || formData.price < 0) newErrors.price = 'Valid price is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label={t('admin.eventForm.title')}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          fullWidth
          required
          className='py-1'
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('admin.eventForm.description')}
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`w-full rounded-md shadow-sm border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 
            focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
            bg-white dark:bg-gray-700 ${errors.description ? 'border-red-500' : ''}`}
          required
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label={t('admin.eventForm.date')}
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            fullWidth
            required
            className='py-1 text-sm'
          />
        </div>
        
        <div>
          <Input
            label={t('admin.eventForm.venue')}
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            error={errors.venue}
            fullWidth
            required
            className='py-1'
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.eventForm.category')}
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md shadow-sm border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 
              focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
              bg-white dark:bg-gray-700 py-1"
            required
            
          >
            {EVENT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500 py-1">{errors.category}</p>}
        </div>
        
        <div>
          <Input
            label={t('admin.eventForm.price')}
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            fullWidth
            required
            className='py-1'
          />
        </div>
        
        <div>
          <Input
            label={t('admin.eventForm.capacity')}
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            error={errors.capacity}
            fullWidth
            required
            className='py-1'
          />
        </div>
      </div>
      
      <div>
        <Input
          label={t('admin.eventForm.image')}
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          fullWidth
          className='py-1'
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t('admin.eventForm.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {t('admin.eventForm.submit')}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;