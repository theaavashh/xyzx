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
    const settings = (await prisma.$queryRaw`
      SELECT "amountUnit", "rewardValue" 
      FROM "reward_settings" 
      WHERE "isActive" = true 
      ORDER BY "createdAt" DESC 
      LIMIT 1
    `) as any[];

    let amountUnit = 100;
    let rewardValue = 1;

    if (settings.length > 0) {
      const setting = settings[0];
      amountUnit = setting.amountUnit;
      rewardValue = setting.rewardValue;
    }

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
    const existingReward = (await prisma.$queryRaw`
      SELECT id FROM "user_rewards" 
      WHERE "orderId" = ${orderId} AND "type" = 'EARNED'
    `) as any[];

    if (existingReward.length > 0) return;

    const points = await calculateRewards(orderAmount);
    if (points <= 0) return;

    await prisma.$queryRaw`
      INSERT INTO "user_rewards" ("userId", "orderId", points, type, description, "createdAt", "updatedAt") 
      VALUES (${userId}, ${orderId}, ${points}, 'EARNED', 'Rewards earned from order', NOW(), NOW())
    `;
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
    await prisma.$queryRaw`
      INSERT INTO "user_rewards" ("userId", points, type, description, "createdAt", "updatedAt") 
      VALUES (${userId}, ${points}, 'EARNED', ${description}, NOW(), NOW())
    `;
  } catch (error) {
    logger.error('Error adding manual reward', { userId, points }, error as Error);
    throw error;
  }
};

const getUserBalance = async (
  userId: string,
): Promise<{ totalEarned: number; totalRedeemed: number; balance: number }> => {
  try {
    const earnedResult = (await prisma.$queryRaw`
      SELECT COALESCE(SUM("points"), 0) as total_earned
      FROM "user_rewards" 
      WHERE "userId" = ${userId} AND "type" = 'EARNED' AND "isActive" = true
    `) as any[];

    const redeemedResult = (await prisma.$queryRaw`
      SELECT COALESCE(SUM("points"), 0) as total_redeemed
      FROM "user_rewards" 
      WHERE "userId" = ${userId} AND "type" = 'REDEEMED' AND "isActive" = true
    `) as any[];

    const totalEarned = Number(earnedResult[0]?.total_earned || 0);
    const totalRedeemed = Number(redeemedResult[0]?.total_redeemed || 0);

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
