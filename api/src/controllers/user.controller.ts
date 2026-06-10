import type { Request, RequestHandler, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from '../utils';
import { userService } from '../services/user.service';
import { emailService } from '../services/email.service';
import { logger } from '../utils/logger';

export const getUsers: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const userFilters = {
      search: filters.search,
      role: filters.role as 'user' | 'admin' | undefined,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await userRepository.findUsers(page, limit, userFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getUserById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const user = await userRepository.findUserById(id);

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, user);
  },
);

export const createUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const emailExists = await userRepository.existsByEmail(email);
    if (emailExists) {
      sendConflict(res, 'User with this email already exists');
      return;
    }

    const user = await userRepository.createUser({
      name,
      email,
      password,
      role: role as 'user' | 'admin' | undefined,
    });

    sendCreated(res, user, 'User created successfully');
  },
);

export const updateProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendUnauthorized(res, 'Not authenticated');
      return;
    }

    const { name, email } = req.body;

    if (email) {
      const emailExists = await userRepository.existsByEmail(email);
      if (emailExists) {
        const currentUser = await userRepository.findUserById(userId);
        if (currentUser && currentUser.email !== email) {
          sendConflict(res, 'User with this email already exists');
          return;
        }
      }
    }

    const user = await userRepository.updateUser(userId, {
      name: name as string | undefined,
      email: email as string | undefined,
    });

    sendSuccess(res, user, 'Profile updated successfully');
  },
);

export const updateUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, email, password, role, isActive } = req.body;

    if (!id) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const exists = await userRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'User not found');
      return;
    }

    if (email) {
      const emailExists = await userRepository.existsByEmail(email);
      if (emailExists) {
        const currentUser = await userRepository.findUserById(id);
        if (currentUser && currentUser.email !== email) {
          sendConflict(res, 'User with this email already exists');
          return;
        }
      }
    }

    const user = await userRepository.updateUser(id, {
      name: name as string | undefined,
      email: email as string | undefined,
      password: password as string | undefined,
      role: role as 'user' | 'admin' | undefined,
      isActive: isActive as boolean | undefined,
    });

    sendSuccess(res, user, 'User updated successfully');
  },
);

export const deleteUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;

    if (!id) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    if (userId === id) {
      sendBadRequest(res, 'You cannot delete your own account');
      return;
    }

    const exists = await userRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'User not found');
      return;
    }

    await userRepository.deleteUser(id);

    sendSuccess(res, null, 'User deleted successfully');
  },
);

export const toggleUserStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;

    if (!id) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    if (userId === id) {
      sendBadRequest(res, 'You cannot deactivate your own account');
      return;
    }

    try {
      const user = await userRepository.toggleUserStatus(id);

      sendSuccess(
        res,
        user,
        `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'User not found');
    }
  },
);

export const updateUserRole: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { role } = req.body;
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;

    if (!id) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    if (!role || !['user', 'admin'].includes(role)) {
      sendBadRequest(res, 'Invalid role. Must be either "user" or "admin"');
      return;
    }

    if (userId === id) {
      sendBadRequest(res, 'You cannot change your own role');
      return;
    }

    try {
      const user = await userRepository.updateUserRole(id, role);

      sendSuccess(res, user, 'User role updated successfully');
    } catch {
      sendNotFound(res, 'User not found');
    }
  },
);

export const createPublicUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      sendConflict(res, 'User with this email already exists');
      return;
    }

    const newUser = await userService.createUser(name, email, password);

    try {
      await emailService.sendWelcomeEmail(email, name);
    } catch (emailError) {
      logger.error('Failed to send welcome email', { email, name }, emailError as Error);
    }

    sendCreated(
      res,
      {
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      },
      'Account created successfully',
    );
  },
);
