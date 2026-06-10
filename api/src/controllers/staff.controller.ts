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
} from '../utils';
import { logger } from '../utils/logger';

export const getStaff: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const staffFilters = {
      role: 'admin' as const,
      search: filters.search,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await userRepository.findUsers(page, limit, staffFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getStaffById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Staff ID is required');
      return;
    }

    const user = await userRepository.findUserById(id);

    if (!user) {
      sendNotFound(res, 'Staff member not found');
      return;
    }

    sendSuccess(res, user);
  },
);

export const createStaff: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, permissions } = req.body;

    const emailExists = await userRepository.existsByEmail(email);
    if (emailExists) {
      sendConflict(res, 'A user with this email already exists');
      return;
    }

    const user = await userRepository.createUser({
      name,
      email,
      password,
      role: 'admin',
      permissions: permissions ?? [],
    });

    sendCreated(res, user, 'Staff member created successfully');
  },
);

export const updateStaff: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, email, password, permissions } = req.body;

    if (!id) {
      sendBadRequest(res, 'Staff ID is required');
      return;
    }

    const exists = await userRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Staff member not found');
      return;
    }

    if (email) {
      const emailExists = await userRepository.existsByEmail(email);
      if (emailExists) {
        const currentUser = await userRepository.findUserById(id);
        if (currentUser && currentUser.email !== email) {
          sendConflict(res, 'A user with this email already exists');
          return;
        }
      }
    }

    const user = await userRepository.updateUser(id, {
      name: name as string | undefined,
      email: email as string | undefined,
      password: password as string | undefined,
      permissions: permissions as string[] | undefined,
    });

    sendSuccess(res, user, 'Staff member updated successfully');
  },
);

export const deleteStaff: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;

    if (!id) {
      sendBadRequest(res, 'Staff ID is required');
      return;
    }

    if (userId === id) {
      sendBadRequest(res, 'You cannot delete your own account');
      return;
    }

    const exists = await userRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Staff member not found');
      return;
    }

    await userRepository.deleteUser(id);

    sendSuccess(res, null, 'Staff member deleted successfully');
  },
);

export const toggleStaffStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;

    if (!id) {
      sendBadRequest(res, 'Staff ID is required');
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
        `Staff member ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Staff member not found');
    }
  },
);

export const updateStaffPermissions: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { permissions } = req.body;

    if (!id) {
      sendBadRequest(res, 'Staff ID is required');
      return;
    }

    if (!Array.isArray(permissions)) {
      sendBadRequest(res, 'Permissions must be an array');
      return;
    }

    const exists = await userRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Staff member not found');
      return;
    }

    const user = await userRepository.updateUser(id, { permissions });

    sendSuccess(res, user, 'Permissions updated successfully');
  },
);
