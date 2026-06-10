'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Lock, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User } from '@/contexts/AuthContextTanStack';

interface SidebarUserMenuProps {
  user: User | null;
  userInitials: string;
  fullName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onManageProfile: () => void;
}

export function SidebarUserMenu({
  user,
  userInitials,
  fullName,
  isOpen,
  setIsOpen,
  onLogout,
  onChangePassword,
  onManageProfile,
}: SidebarUserMenuProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const email = isClient ? (user?.email ?? '') : '';

  return (
    <div className="px-2 py-2 border-t border-gray-200 flex-shrink-0 space-y-1 relative">
      <div
        className="flex items-center space-x-2 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors py-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-md">
          {userInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800 truncate">
            {fullName}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {email}
          </div>
        </div>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-2 right-2 mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <div className="py-0.5">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    onManageProfile();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-sm text-black hover:bg-gray-100 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-black" />
                  <span>Manage Profile</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    onChangePassword();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-sm text-black hover:bg-gray-100 transition-colors"
                >
                  <Lock className="w-4 h-4 text-black" />
                  <span>Change Password</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
