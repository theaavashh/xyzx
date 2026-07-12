import { prisma } from '../lib/database';
import { logger } from '../utils/logger';

interface RewardService {
  calculateRewards(amount: number): Promise<number>;
  addOrderReward(
    orderId: string,
    userId: string,
    orderAmount: number,
  ): Promise<void>;
  addManualReward(
    userId: string,
    points: number,
    description: string,
  ): Promise<void>;
  getUserBalance(
    userId: string,
  ): Promise<{ totalEarned: number; totalRedeemed: number; balance: number }>;
}

const calculateRewards = async (amount: number): Promise<number> => {
  try {
    const setting = await prisma.rewardSettings.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const amountUnit = setting?.amountUnit ?? 100;
    const rewardValue = setting?.rewardValue ?? 1;

    return Math.floor((amount / amountUnit) * rewardValue);
  } catch (error) {
    logger.error('Error calculating rewards', undefined, error as Error);
    return 0;
  }
};

const addOrderReward = async (
  orderId: string,
  userId: string,
  orderAmount: number,
): Promise<void> => {
  try {
    const existingReward = await prisma.userReward.findFirst({
      where: { orderId, type: 'EARNED' },
    });

    if (existingReward) return;

    const points = await calculateRewards(orderAmount);
    if (points <= 0) return;

    await prisma.userReward.create({
      data: {
        userId,
        orderId,
        points,
        type: 'EARNED',
        description: 'Rewards earned from order',
      },
    });
  } catch (error) {
    logger.error('Error adding order reward', { orderId, userId }, error as Error);
    throw error;
  }
};

const addManualReward = async (
  userId: string,
  points: number,
  description: string,
): Promise<void> => {
  try {
    await prisma.userReward.create({
      data: {
        userId,
        points,
        type: 'EARNED',
        description,
      },
    });
  } catch (error) {
    logger.error('Error adding manual reward', { userId, points }, error as Error);
    throw error;
  }
};

const getUserBalance = async (
  userId: string,
): Promise<{ totalEarned: number; totalRedeemed: number; balance: number }> => {
  try {
    const [earnedResult, redeemedResult] = await Promise.all([
      prisma.userReward.aggregate({
        where: { userId, type: 'EARNED', isActive: true },
        _sum: { points: true },
      }),
      prisma.userReward.aggregate({
        where: { userId, type: 'REDEEMED', isActive: true },
        _sum: { points: true },
      }),
    ]);

    const totalEarned = earnedResult._sum.points ?? 0;
    const totalRedeemed = redeemedResult._sum.points ?? 0;

    return { totalEarned, totalRedeemed, balance: totalEarned - totalRedeemed };
  } catch (error) {
    logger.error('Error getting user balance', { userId }, error as Error);
    throw error;
  }
};

export const rewardService: RewardService = {
  calculateRewards,
  addOrderReward,
  addManualReward,
  getUserBalance,
};
