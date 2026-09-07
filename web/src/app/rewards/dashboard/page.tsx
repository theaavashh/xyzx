'use client';

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Gift,
  History,
  ShoppingCart,
  Star,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

interface RewardBalance {
  totalEarned: number;
  totalRedeemed: number;
  balance: number;
}

interface RewardHistory {
  id: string;
  orderId: string | null;
  points: number;
  type: 'EARNED' | 'REDEEMED';
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    total: number;
  } | null;
}

export default function RewardsDashboardPage() {
  const [balance, setBalance] = useState<RewardBalance | null>(null);
  const [history, setHistory] = useState<RewardHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<{
          success: boolean;
          data: RewardBalance;
        }>('/api/v1/user-rewards/balance');
        setBalance(response.data);
      } catch (error) {
        console.error('Error fetching reward balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    if (showHistory) {
      const fetchHistory = async () => {
        try {
          setHistoryLoading(true);
          const response = await apiRequest<{
            success: boolean;
            data: RewardHistory[];
            pagination: {
              page: number;
              limit: number;
              total: number;
              pages: number;
            };
          }>(`/api/v1/user-rewards/history?page=${page}&limit=10`);

          setHistory(response.data);
          setTotalPages(response.pagination.pages);
        } catch (error) {
          console.error('Error fetching reward history:', error);
        } finally {
          setHistoryLoading(false);
        }
      };

      fetchHistory();
    }
  }, [showHistory, page]);

  const fetchRewardBalance = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{
        success: boolean;
        data: RewardBalance;
      }>('/api/v1/user-rewards/balance');
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching reward balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewardHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await apiRequest<{
        success: boolean;
        data: RewardHistory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(`/api/v1/user-rewards/history?page=${page}&limit=10`);

      setHistory(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching reward history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (type: string) => {
    return type === 'EARNED'
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (type: string) => {
    return type === 'EARNED' ? (
      <Gift className="w-4 h-4" />
    ) : (
      <ShoppingCart className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-zinc-600">My Rewards</h1>
            </div>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-600">
                Current Balance
              </h3>
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {balance?.balance || 0}
            </div>
            <p className="text-sm text-zinc-600 mt-2">Available points</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-600">
                Total Earned
              </h3>
              <Star className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              +{balance?.totalEarned || 0}
            </div>
            <p className="text-sm text-zinc-600 mt-2">Points earned</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-600">
                Total Redeemed
              </h3>
              <ShoppingCart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              -{balance?.totalRedeemed || 0}
            </div>
            <p className="text-sm text-zinc-600 mt-2">Points used</p>
          </div>
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-zinc-600">
                Reward History
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                View your complete reward transaction history
              </p>
            </div>

            {historyLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-zinc-600 mt-4">Loading history...</p>
              </div>
            ) : history.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4">
                  {history.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${getStatusColor(reward.type)}`}
                        >
                          {getStatusIcon(reward.type)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-600">
                            {reward.description || 'Reward transaction'}
                          </p>
                          {reward.order && (
                            <p className="text-sm text-zinc-600">
                              Order: {reward.order.orderNumber}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-zinc-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(reward.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            reward.type === 'EARNED'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {reward.type === 'EARNED' ? '+' : '-'}
                          {reward.points}
                        </p>
                        <p className="text-sm text-zinc-600">points</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Gift className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-600 mb-2">
                  No reward history yet
                </h3>
                <p className="text-zinc-600">
                  Start earning points by making purchases to see your reward
                  history here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        {!showHistory && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Trophy className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  How to Earn More Points
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>
                    • Make purchases to earn points based on your order total
                  </li>
                  <li>
                    • Points are automatically added to your account after order
                    confirmation
                  </li>
                  <li>
                    • Check back here to track your reward balance and history
                  </li>
                  <li>
                    • Points can be redeemed for discounts on future purchases
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
