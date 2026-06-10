import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Browser Navigation Blocking Middleware
 * Prevents direct browser access to API routes while allowing legitimate API requests
 */

export const blockBrowserNavigation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Allow health check endpoint from browsers
    if (req.path === '/health') {
      return next();
    }

    // Check Sec-Fetch-Mode header (modern approach - Chrome, Edge, Safari)
    const secFetchMode = req.get('Sec-Fetch-Mode');

    if (secFetchMode) {
      // Block browser navigation attempts
      if (secFetchMode === 'navigate') {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      // Allow API requests (cors, no-cors, same-origin)
      if (['cors', 'no-cors', 'same-origin'].includes(secFetchMode)) {
        return next();
      }
    }

    // Fallback to Accept header analysis (for older browsers or when Sec-Fetch-Mode is missing)
    const acceptHeader = req.get('Accept');

    if (acceptHeader) {
      // Parse Accept header to determine priority
      const acceptTypes = acceptHeader
        .split(',')
        .map((type) => type.trim().split(';')[0]) // Remove quality values
        .filter((type) => type); // Remove empty strings

      // If text/html is the highest priority, it's likely a browser navigation
      if (acceptTypes[0] === 'text/html') {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      // If application/json or */* is prioritized, it's likely an API request
      if (
        acceptTypes.includes('application/json') ||
        acceptTypes.includes('*/*')
      ) {
        return next();
      }
    }

    // Default behavior: Allow the request (for API tools, mobile apps, etc.)
    // This maintains backward compatibility with non-browser clients
    next();
  } catch (error) {
    logger.error('Browser navigation block error', undefined, error as Error);
    // Fail open - allow the request in case of middleware errors
    next();
  }
};
