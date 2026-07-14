import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Stadium } from '../../types';
import { Button } from '../ui/Button';
// import { LoadingSkeleton } from '../ui/LoadingSkeleton';

interface FormValues {
  name: string;
  city: string;
  country: string;
  capacity: number;
  climateType: string;
  latitude: number;
  longitude: number;
  status: 'Online' | 'Maintenance' | 'Offline';
}

/**
 * Accessible stadium creation form.
 * Uses proper label/input association and ARIA live region for errors.
 */
const StadiumForm: React.FC<{ onSubmit: (data: Omit<Stadium, 'id'>) => Promise<void>; loading?: boolean }> = ({ onSubmit, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      city: '',
      country: '',
      capacity: 0,
      climateType: '',
      latitude: 0,
      longitude: 0,
      status: 'Online',
    },
  });

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    const { climateType, ...rest } = data;
    await onSubmit({ ...(rest as Omit<Stadium, 'id'>), climate: climateType } as Omit<Stadium, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" aria-describedby="form-errors" noValidate>
      {/* Simple text inputs */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-200">
          Stadium Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded bg-slate-800/50 text-slate-100 p-2"
          aria-invalid={!!errors.name}
          aria-required="true"
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>
      {/* Repeat for other fields (city, country, capacity, etc.) */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-slate-200">
          City
        </label>
        <input
          id="city"
          type="text"
          {...register('city', { required: 'City is required' })}
          className="mt-1 block w-full rounded bg-slate-800/50 text-slate-100 p-2"
          aria-invalid={!!errors.city}
          aria-required="true"
        />
        {errors.city && (
          <p role="alert" className="mt-1 text-sm text-red-400">
            {errors.city.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-slate-200">
          Country
        </label>
        <input
          id="country"
          type="text"
          {...register('country', { required: 'Country is required' })}
          className="mt-1 block w-full rounded bg-slate-800/50 text-slate-100 p-2"
          aria-invalid={!!errors.country}
          aria-required="true"
        />
        {errors.country && (
          <p role="alert" className="mt-1 text-sm text-red-400">
            {errors.country.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-slate-200">
          Capacity
        </label>
        <input
          id="capacity"
          type="number"
          {...register('capacity', { required: 'Capacity is required', min: { value: 1, message: 'Must be >0' } })}
          className="mt-1 block w-full rounded bg-slate-800/50 text-slate-100 p-2"
          aria-invalid={!!errors.capacity}
          aria-required="true"
        />
        {errors.capacity && (
          <p role="alert" className="mt-1 text-sm text-red-400">
            {errors.capacity.message}
          </p>
        )}
      </div>
      {/* Add more fields as needed */}
      <div className="flex justify-end space-x-2">
        <Button type="submit" variant="primary" disabled={loading} loading={loading}>
          {loading ? 'Saving…' : 'Add Stadium'}
        </Button>
      </div>
    </form>
  );
};
export default StadiumForm;
