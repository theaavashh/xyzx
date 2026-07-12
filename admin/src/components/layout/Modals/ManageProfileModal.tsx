'use client';

import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContextTanStack';

interface ManageProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const updateProfile = async (data: { name: string; email: string }) => {
  const response = await fetch('/api/v1/users/profile', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
};

export const ManageProfileModal = ({
  isOpen,
  onClose,
}: ManageProfileModalProps) => {
  const { user, refetchProfile } = useAuth();
  const [name, setName] = useState(user?.name || user?.firstName || '');
  const [email, setEmail] = useState(user?.email || '');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || user?.firstName || '');
      setEmail(user?.email || '');
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refetchProfile();
      onClose();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    updateProfileMutation.mutate({ name: name.trim(), email: email.trim() });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manage-profile-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 id="manage-profile-title" className="text-xl font-bold text-black outer-sans">
                  Manage Profile
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close manage profile dialog"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateProfileMutation.isPending
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
