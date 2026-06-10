import type { handleUnaryCall } from '@grpc/grpc-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details: Record<string, string>;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  error: ApiError | null;
}
