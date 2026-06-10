import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getRewardSettings: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    let settings = await prisma.rewardSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      settings = await prisma.rewardSettings.create({
        data: { amountUnit: 100, rewardValue: 1, isActive: true },
      });
    }

    sendSuccess(res, settings);
  },
);

export const updateRewardSettings: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { amountUnit, rewardValue, isActive } = req.body;

    let settings = await prisma.rewardSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (settings) {
      settings = await prisma.rewardSettings.update({
        where: { id: settings.id },
        data: {
          ...(amountUnit !== undefined && { amountUnit }),
          ...(rewardValue !== undefined && { rewardValue }),
          ...(isActive !== undefined && { isActive }),
        },
      });
    } else {
      settings = await prisma.rewardSettings.create({
        data: {
          amountUnit: amountUnit ?? 100,
          rewardValue: rewardValue ?? 1,
          isActive: isActive ?? true,
        },
      });
    }

    sendSuccess(res, settings, 'Reward settings updated successfully');
  },
);

export const getUserRewards: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, type, page = '1', limit = '10', search } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (type && typeof type === 'string') where.type = type;

    if (search) {
      where.OR = [
        { description: { contains: search as string } },
        { user: { name: { contains: search as string } } },
        { user: { email: { contains: search as string } } },
      ];
    }

    const [rewards, total] = await Promise.all([
      prisma.userReward.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          order: { select: { id: true, orderNumber: true, total: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.userReward.count({ where }),
    ]);

    sendSuccess(res, rewards, undefined, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  },
);

export const getRewardAnalytics: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    const dateFilter: Record<string, unknown> = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const whereClause = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const [totalEarned, totalRedeemed, topUsers, monthlyRewards] = await Promise.all([
      prisma.userReward.aggregate({
        _sum: { points: true },
        _count: true,
        where: { type: 'EARNED', ...whereClause },
      }),
      prisma.userReward.aggregate({
        _sum: { points: true },
        _count: true,
        where: { type: 'REDEEMED', ...whereClause },
      }),
      prisma.userReward.groupBy({
        by: ['userId'],
        _sum: { points: true },
        where: { type: 'EARNED', ...whereClause },
        orderBy: { _sum: { points: 'desc' } },
        take: 10,
      }),
      prisma.userReward.groupBy({
        by: ['createdAt'],
        _sum: { points: true },
        _count: true,
        where: { type: 'EARNED', ...whereClause },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    ]);

    sendSuccess(res, {
      totalRewardsGiven: totalEarned._sum.points ?? 0,
      totalRewardsRedeemed: totalRedeemed._sum.points ?? 0,
      totalEarnedTransactions: totalEarned._count,
      totalRedeemedTransactions: totalRedeemed._count,
      topUsers,
      monthlyRewards,
    });
  },
);

export const addManualReward: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, points, description } = req.body;

    if (!userId || !points || !description) {
      sendBadRequest(res, 'User ID, points, and description are required');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const reward = await prisma.userReward.create({
      data: { userId, points, type: 'EARNED', description },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    sendSuccess(res, reward, 'Reward added successfully', 201);
  },
);

export const deleteReward: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.userReward.delete({ where: { id } });

    sendSuccess(res, null, 'Reward deleted successfully');
  },
);
