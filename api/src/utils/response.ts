import type { Response } from 'express';
import type { PaginationMeta, ApiResponse, ValidationError } from '../types/api';

export { type PaginationMeta, type ApiResponse, type ValidationError };

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  pagination?: PaginationMeta,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(pagination && { pagination }),
  };
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully',
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

export const sendError = (
  res: Response,
  message: string = 'Internal server error',
  statusCode: number = 500,
  errors?: ValidationError[],
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(response);
};

export const sendBadRequest = (
  res: Response,
  message: string = 'Bad request',
  errors?: ValidationError[],
): void => {
  sendError(res, message, 400, errors);
};

export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized',
): void => {
  sendError(res, message, 401);
};

export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden',
): void => {
  sendError(res, message, 403);
};

export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found',
): void => {
  sendError(res, message, 404);
};

export const sendConflict = (
  res: Response,
  message: string = 'Resource already exists',
): void => {
  sendError(res, message, 409);
};

export const sendTooManyRequests = (
  res: Response,
  message: string = 'Too many requests',
): void => {
  sendError(res, message, 429);
};

export const sendServiceUnavailable = (
  res: Response,
  message: string = 'Service temporarily unavailable',
): void => {
  sendError(res, message, 503);
};

export const sendUnprocessableEntity = (
  res: Response,
  message: string = 'Validation failed',
  errors?: ValidationError[],
): void => {
  sendError(res, message, 422, errors);
};