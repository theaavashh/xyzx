import { useMemo } from 'react';
import type { User } from '@/contexts/AuthContextTanStack';

export const useUserProfile = (user: User | null) => {
  const userInitials = useMemo(() => {
    if (!user) return 'A';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user?.username || 'Admin';
  }, [user]);

  return { userInitials, fullName };
};
