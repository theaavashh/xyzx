import {
  Activity as ActivityIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Settings,
  ShoppingCart,
  User,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { ActivityItem, ApiResponse } from '@/types';
import { authHeaders } from '@/utils/authHeaders';

interface RecentActivityProps {
  limit?: number;
  showRefresh?: boolean;
  autoRefresh?: boolean;
}

interface RecentActivityApiResponse {
  data: ActivityItem[];
}

const fetchRecentActivity = async (limit: number): Promise<ActivityItem[]> => {
  const response = await fetch(
    `/api/v1/analytics/recent-activity?limit=${limit}`,
    {
      credentials: 'include',
      headers: authHeaders(),
    },
  );
  if (!response.ok) throw new Error('Failed to fetch activities');
  const data: ApiResponse<ActivityItem[]> = await response.json();
  return (data.data ?? data).map((activity) => ({
    ...activity,
    timestamp: new Date(activity.timestamp),
  }));
};

const RecentActivity: React.FC<RecentActivityProps> = ({
  limit = 10,
  showRefresh = true,
  autoRefresh = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: () => fetchRecentActivity(limit),
    refetchInterval: autoRefresh ? 60000 : false,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    const iconClass = 'w-4 h-4';

    switch (type) {
      case 'order':
        return <ShoppingCart className={iconClass} />;
      case 'user':
        return <User className={iconClass} />;
      case 'product':
        return <Package className={iconClass} />;
      case 'settings':
        return <Settings className={iconClass} />;
      default:
        return <ActivityIcon className={iconClass} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'user':
        return 'bg-green-100 text-green-600';
      case 'product':
        return 'bg-purple-100 text-purple-600';
      case 'settings':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-amber-100 text-amber-600';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
            Recent Activity
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
          <p>Failed to load activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
            Recent Activity
          </h2>
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ActivityIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
                {getStatusIcon(activity.type)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;

