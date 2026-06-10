export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_ALREADY_EXISTS: 'PRODUCT_ALREADY_EXISTS',
  PRODUCT_SLUG_EXISTS: 'PRODUCT_SLUG_EXISTS',

  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  CATEGORY_ALREADY_EXISTS: 'CATEGORY_ALREADY_EXISTS',
  CATEGORY_HAS_CHILDREN: 'CATEGORY_HAS_CHILDREN',
  CATEGORY_CANNOT_DELETE: 'CATEGORY_CANNOT_DELETE',

  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  CONTENT_ALREADY_EXISTS: 'CONTENT_ALREADY_EXISTS',

  BANNER_NOT_FOUND: 'BANNER_NOT_FOUND',
  HERO_BANNER_NOT_FOUND: 'HERO_BANNER_NOT_FOUND',
  FEATURED_SECTION_NOT_FOUND: 'FEATURED_SECTION_NOT_FOUND',

  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_ALREADY_EXISTS: 'ORDER_ALREADY_EXISTS',
  ORDER_CANNOT_CANCEL: 'ORDER_CANNOT_CANCEL',
  ORDER_INVALID_STATUS: 'ORDER_INVALID_STATUS',

  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_CANNOT_DELETE_SELF: 'USER_CANNOT_DELETE_SELF',
  USER_CANNOT_DEACTIVATE_SELF: 'USER_CANNOT_DEACTIVATE_SELF',
  USER_CANNOT_CHANGE_OWN_ROLE: 'USER_CANNOT_CHANGE_OWN_ROLE',
  USER_INVALID_ROLE: 'USER_INVALID_ROLE',

  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',

  DATABASE_ERROR: 'DATABASE_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',

  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  IP_BLOCKED: 'IP_BLOCKED',

  PAYMENT_ERROR: 'PAYMENT_ERROR',
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',

  REWARD_ERROR: 'REWARD_ERROR',
  REWARD_INSUFFICIENT_POINTS: 'REWARD_INSUFFICIENT_POINTS',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiException extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;
}

export const createApiError = (
  error: ApiError,
  statusCode?: number,
): ApiException => {
  const err = new Error(error.message) as ApiException;
  err.name = 'ApiException';
  err.code = error.code;
  err.statusCode = statusCode ?? HTTP_STATUS.INTERNAL_ERROR;
  err.details = error.details;
  return err;
};

export const createNotFoundError = (
  message: string,
  code: ErrorCode = ERROR_CODES.NOT_FOUND,
): ApiException => createApiError({ code, message }, HTTP_STATUS.NOT_FOUND);

export const createBadRequestError = (
  message: string,
  details?: unknown,
): ApiException =>
  createApiError(
    { code: ERROR_CODES.BAD_REQUEST, message, details },
    HTTP_STATUS.BAD_REQUEST,
  );

export const createUnauthorizedError = (
  message: string = 'Unauthorized',
): ApiException =>
  createApiError(
    { code: ERROR_CODES.UNAUTHORIZED, message },
    HTTP_STATUS.UNAUTHORIZED,
  );

export const createForbiddenError = (
  message: string = 'Forbidden',
): ApiException =>
  createApiError(
    { code: ERROR_CODES.FORBIDDEN, message },
    HTTP_STATUS.FORBIDDEN,
  );

export const createConflictError = (
  message: string,
  code: ErrorCode = ERROR_CODES.CONFLICT,
): ApiException => createApiError({ code, message }, HTTP_STATUS.CONFLICT);

export const createValidationError = (
  message: string,
  details?: unknown,
): ApiException =>
  createApiError(
    { code: ERROR_CODES.VALIDATION_ERROR, message, details },
    HTTP_STATUS.BAD_REQUEST,
  );
