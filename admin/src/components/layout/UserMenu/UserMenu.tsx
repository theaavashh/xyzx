'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Lock, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User } from '@/contexts/AuthContextTanStack';

interface UserMenuProps {
  user: User | null;
  userInitials: string;
  fullName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onManageProfile: () => void;
}

export const UserMenu = ({
  user,
  userInitials,
  fullName,
  isOpen,
  setIsOpen,
  onLogout,
  onChangePassword,
  onManageProfile,
}: UserMenuProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const email = isClient ? (user?.email ?? '') : '';

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-normal text-sm sm:text-base shadow-md">
          {userInitials}
        </div>
        <div
          className="hidden sm:block text-left cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-lg font-semibold text-black font-normal">
            Welcome back, {user?.firstName || 'Admin'}
          </div>
          <div className="text-xs text-black">{user?.email}</div>
        </div>
        <ChevronDown
          className={`hidden sm:block w-4 h-4 text-black transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-normal shadow-md">
                    {userInitials}
                  </div>
                  <div>
                    <div className="text-base font-medium text-black">
                      {fullName}
                    </div>
                    <div className="text-xs text-black">{email}</div>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    onManageProfile();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className='text-base font-medium'>Manage Profile</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    onChangePassword();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span className='text-base font-medium'>Change Password</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className='text-base font-medium'>Log out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
