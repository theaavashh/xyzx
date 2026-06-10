import type { NextFunction, Request, Response } from 'express';
import { type ZodIssue, type ZodSchema, z } from 'zod';

export interface ValidationSource {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export const formatZodErrors = (issues: ZodIssue[]): ValidationError[] => {
  return issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
};

export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = source === 'query'
      ? req.query
      : source === 'params'
        ? req.params
        : req.body;

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors = formatZodErrors(result.error.issues);

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    if (source === 'body') {
      req.body = result.data as any;
    } else if (source === 'query') {
      Object.assign(req.query, result.data as any);
    } else if (source === 'params') {
      Object.assign(req.params, result.data as any);
    }

    next();
  };
};

export const validateBody = (schema: ZodSchema) => validate(schema, 'body');
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');

export const validateAll = (schemas: ValidationSource) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error.issues));
      } else {
        req.body = result.data as any;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error.issues));
      } else {
        Object.assign(req.query, result.data as any);
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error.issues));
      } else {
        Object.assign(req.params, result.data as any);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
};

export const uuidSchema = z.string().uuid('Invalid UUID format');
export const emailSchema = z.string().email('Invalid email address');
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const idParamSchema = z.object({ id: uuidSchema });
export const slugParamSchema = z.object({ slug: z.string().min(1).max(200) });
export const searchSchema = z.object({ q: z.string().min(1).max(200) });

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type SlugParam = z.infer<typeof slugParamSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
