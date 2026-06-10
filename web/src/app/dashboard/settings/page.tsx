'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { User, Mail, Key, Bell, Edit3, CheckCircle, X } from 'lucide-react';
import { useUpdateProfile, useChangePassword } from '@/lib/dashboard/hooks';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
  });

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    updateProfile.mutate({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      username: profileForm.username,
    }, { onSuccess: () => setIsEditing(false) });
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }
    changePassword.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }, { onSuccess: () => setShowPasswordForm(false) });
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-medium">
              {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-900 capitalize">
                {user?.firstName || user?.username}
              </h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-first-name" className="block text-xs text-gray-400 uppercase tracking-wide mb-1">First Name</label>
                <input id="edit-first-name" type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
              <div>
                <label htmlFor="edit-last-name" className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Last Name</label>
                <input id="edit-last-name" type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
              <div>
                <label htmlFor="edit-username" className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Username</label>
                <input id="edit-username" type="text" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>
            </div>
            <button onClick={handleSaveProfile} disabled={updateProfile.isPending} className="px-5 py-2 bg-[#D4AF37] text-white rounded-lg text-sm font-medium hover:bg-[#C4A030] transition-colors disabled:opacity-50">
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-3.5 w-3.5 text-gray-300" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Username</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-3.5 w-3.5 text-gray-300" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Email</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                {user?.emailVerified && <CheckCircle className="h-3.5 w-3.5 text-green-500" />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Security</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Key className="h-4 w-4 text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-400">Change your password</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            {showPasswordForm ? 'Cancel' : 'Change'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50/50 rounded-lg">
            <div>
              <label htmlFor="current-password" className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Current Password</label>
              <input id="current-password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-xs text-gray-400 uppercase tracking-wide mb-1">New Password</label>
              <input id="new-password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Confirm Password</label>
              <input id="confirm-password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <button onClick={handleChangePassword} disabled={changePassword.isPending} className="px-5 py-2 bg-[#D4AF37] text-white rounded-lg text-sm font-medium hover:bg-[#C4A030] transition-colors disabled:opacity-50">
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-3">
          {[
            { key: 'orderUpdates' as const, label: 'Order updates', desc: 'Status changes and shipping info' },
            { key: 'promotions' as const, label: 'Promotions', desc: 'Exclusive deals and offers' },
            { key: 'newArrivals' as const, label: 'New arrivals', desc: 'Latest product launches' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => toggleNotification(item.key)}
                  className="sr-only peer"
                  aria-label={`Toggle ${item.label} notifications`}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
