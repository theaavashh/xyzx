import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/database';
import { logger } from '../utils/logger';

// Extend the Express Request interface to include user info
declare global {
  namespace Express {
    interface Request {
      user?: any; // User information decoded from JWT
      apiKey?: string;
    }
  }
}

/**
 * Browser Access Protection Middleware
 * Prevents direct browser access to API endpoints
 * Allows requests from trusted frontend origins only
 * Why: Protects API from unauthorized direct browser access
 */
export const preventDirectBrowserAccess = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  try {
    // Check if request comes from trusted frontend origin
    const referer = req.get('Referer');
    const origin = req.get('Origin');

    // Define trusted frontend origins
    const trustedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || '', // Add your actual frontend URL from env
    ].filter(Boolean); // Remove empty strings

    // Allow requests from trusted origins
    const isTrustedOrigin =
      (referer &&
        trustedOrigins.some((trusted) => referer.startsWith(trusted))) ||
      (origin && trustedOrigins.some((trusted) => origin.startsWith(trusted)));

    if (isTrustedOrigin) {
      return next();
    }

    // Block direct browser access or requests from untrusted origins
    return res.status(403).json({
      success: false,
      message:
        'Direct browser access not allowed. Please use the official application.',
    });
  } catch (error) {
    logger.error('Browser access validation error', undefined, error as Error);
    return res.status(500).json({
      success: false,
      message: 'Access validation error',
    });
  }
};

/**
 * Require Admin Role Middleware
 * Checks if authenticated user has admin role
 * Why: Restricts access to admin-only API routes
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  try {
    // Check if user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    logger.error('Admin check error', undefined, error as Error);
    return res.status(500).json({
      success: false,
      message: 'Admin access validation error',
    });
  }
};

/**
 * JWT Authentication Middleware
 * Validates JWT tokens for user authentication from cookies or Authorization header
 * Why: Ensures only authenticated users can access private API routes
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    // Extract token from Authorization header or cookies
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // If no token in header, check cookies
    if (!token && req.cookies) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify token using secret from environment
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment');
    }

    // Decode the token
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role?: string;
      iat: number;
      exp: number;
    };

    // Check if user still exists and is active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or deactivated',
      });
    }

    // Add user info to request for downstream use
    req.user = { ...decoded, isActive: user.isActive };

    next();
  } catch (error) {
    logger.error('Authentication error', undefined, error as Error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
