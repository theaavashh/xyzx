import type { Request } from 'express';

export interface ParsedQuery {
  page: number;
  limit: number;
  skip: number;
  filters: Record<string, string | undefined>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const parseQuery = (req: Request): ParsedQuery => {
  const query = req.query as Record<string, string | undefined>;

  const page = query.page || '1';
  const limit = query.limit || '10';
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc';

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const knownKeys = ['page', 'limit', 'search', 'sortBy', 'sortOrder'];
  const filters: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(query)) {
    if (!knownKeys.includes(key)) {
      filters[key] = value;
    }
  }

  return {
    page: pageNum,
    limit: limitNum,
    skip,
    filters,
    sortBy,
    sortOrder,
  };
};
