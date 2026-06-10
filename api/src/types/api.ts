export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const createPaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => {
  const pages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

export type ApiResult<T, E = ApiError> = 
  | { ok: true; data: T }
  | { ok: false; error: E };

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public field?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON(): ApiErrorResponse {
    return {
      success: false,
      message: this.message,
      errors: [{
        message: this.message,
        code: this.code,
        field: this.field,
      }],
    };
  }
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

export const successResponse = <T>(
  data: T,
  message?: string,
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (
  message: string,
  errors?: ApiError[],
  statusCode: number = 400,
): ApiResponse => ({
  success: false,
  message,
  errors,
});

export const createdResponse = <T>(
  data: T,
  message: string = 'Created successfully',
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const paginatedResponse = <T>(
  data: T[],
  meta: PaginationMeta,
): PaginatedResponse<T> => ({
  data,
  pagination: meta,
});