'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MapPin, Plus, Home, Building2, Edit3, Trash2, X } from 'lucide-react';
import { useAddresses, useAddAddress, useDeleteAddress, useUpdateAddress } from '@/lib/dashboard/hooks';
import type { Address } from '@/lib/dashboard/types';
import { ErrorState } from '@/components/dashboard/ErrorState';

const addressSchema = z.object({
  type: z.enum(['home', 'office', 'other']),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const TYPE_ICONS = { home: Home, office: Building2, other: MapPin };

function AddressForm({ address, onCancel }: { address?: Address | null; onCancel: () => void }) {
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: address?.type ?? 'home',
      name: address?.name ?? '',
      phone: address?.phone ?? '',
      street: address?.street ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      zip: address?.zip ?? '',
      country: address?.country ?? '',
      isDefault: address?.isDefault ?? false,
    },
  });

  const onSubmit = (data: AddressFormData) => {
    const payload = { ...data, isDefault: data.isDefault ?? false };
    if (address?.id) {
      updateAddress.mutate({ id: address.id, data: payload }, { onSuccess: onCancel });
    } else {
      addAddress.mutate(payload, { onSuccess: onCancel });
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{address ? 'Edit Address' : 'Add New Address'}</h2>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors" aria-label="Close form">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input id="address-name" type="text" {...register('name')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="address-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input id="address-phone" type="tel" {...register('phone')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address-street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input id="address-street" type="text" {...register('street')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>}
          </div>
          <div>
            <label htmlFor="address-city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input id="address-city" type="text" {...register('city')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="address-state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input id="address-state" type="text" {...register('state')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
          </div>
          <div>
            <label htmlFor="address-zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input id="address-zip" type="text" {...register('zip')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>}
          </div>
          <div>
            <label htmlFor="address-country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input id="address-country" type="text" {...register('country')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
          </div>
          <div>
            <label htmlFor="address-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id="address-type" {...register('type')} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-300">
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="address-default" {...register('isDefault')} className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <label htmlFor="address-default" className="text-sm text-gray-700">Set as default</label>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg text-base font-medium hover:bg-[#C4A030] transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function AddressesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map((i) => <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />)}
      </div>
    </div>
  );
}

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { data: addresses, isLoading, error, refetch } = useAddresses();
  const deleteAddress = useDeleteAddress();

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  if (error) {
    return <ErrorState message="Unable to load your addresses." onRetry={() => refetch()} />;
  }

  const addressList = addresses ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`lastik text-4xl font-medium text-gray-900 uppercase`}>Addresses</h1>
          <p className="text-base text-gray-400 mt-1">Manage your shipping addresses</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingAddress(null); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white rounded-lg text-base font-medium hover:bg-[#C4A030] transition-colors">
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {showForm && <AddressForm address={editingAddress} onCancel={() => { setShowForm(false); setEditingAddress(null); }} />}

      {addressList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addressList.map((address) => {
            const Icon = TYPE_ICONS[address.type] ?? MapPin;
            return (
              <div key={address.id} className="bg-white border border-gray-100 rounded-xl p-6 relative group">
                {address.isDefault && <span className="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded">Default</span>}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 capitalize">{address.type}</h3>
                    <p className="text-sm text-gray-400">{address.name}</p>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-base text-gray-600">{address.street}</p>
                  <p className="text-base text-gray-600">{address.city}, {address.state} {address.zip}</p>
                  <p className="text-base text-gray-600">{address.country}</p>
                  <p className="text-base text-gray-600 pt-1">{address.phone}</p>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <button onClick={() => { setEditingAddress(address); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button onClick={() => { if (window.confirm('Are you sure you want to delete this address?')) deleteAddress.mutate(address.id); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl p-12">
          <div className="text-center max-w-sm mx-auto">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-base text-gray-400 mb-6">Add your shipping address for faster checkout</p>
            <button onClick={() => { setShowForm(true); setEditingAddress(null); }} className="inline-flex items-center gap-2 text-base font-medium text-gray-900 hover:text-[#D4AF37] transition-colors">
              <Plus className="h-4 w-4" />
              Add your first address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
