import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import { asyncHandler, sendBadRequest, sendSuccess } from '../utils';

export const getUserRewardBalance: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const [earnedResult, redeemedResult] = await Promise.all([
      prisma.userReward.aggregate({
        _sum: { points: true },
        where: { userId, type: 'EARNED', isActive: true },
      }),
      prisma.userReward.aggregate({
        _sum: { points: true },
        where: { userId, type: 'REDEEMED', isActive: true },
      }),
    ]);

    const totalEarned = earnedResult._sum.points ?? 0;
    const totalRedeemed = redeemedResult._sum.points ?? 0;

    sendSuccess(res, {
      totalEarned,
      totalRedeemed,
      balance: totalEarned - totalRedeemed,
    });
  },
);

export const getUserRewardHistory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const type = req.query.type as string | undefined;
    const page = (req.query.page as string) || '1';
    const limit = (req.query.limit as string) || '10';

    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { userId };
    if (type) where.type = type;

    const [rewards, total] = await Promise.all([
      prisma.userReward.findMany({
        where,
        include: {
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

export const getPublicRewardSettings: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await prisma.rewardSettings.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: { amountUnit: true, rewardValue: true },
    });

    sendSuccess(res, settings ?? { amountUnit: 100, rewardValue: 1 });
  },
);

export const calculateRewards: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const amount = req.query.amount as string | undefined;

    if (!amount || isNaN(Number(amount))) {
      sendBadRequest(res, 'Valid amount is required');
      return;
    }

    const settings = await prisma.rewardSettings.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const amountUnit = settings?.amountUnit ?? 100;
    const rewardValue = settings?.rewardValue ?? 1;
    const calculatedRewards = Math.floor((Number(amount) / amountUnit) * rewardValue);

    sendSuccess(res, {
      amount: Number(amount),
      amountUnit,
      rewardValue,
      calculatedRewards,
    });
  },
);
