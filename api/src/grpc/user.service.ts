import type { handleUnaryCall } from '@grpc/grpc-js';
import { userRepository } from '../repositories/user.repository';
import { logger } from '../utils/logger';
import type { Pagination, ApiError } from './types';

interface User { id: string; name: string; email: string; role: string; isActive: boolean; createdAt: string; updatedAt: string }
interface GetUserRequest { id: string }
interface PaginationRequest { page: number; limit: number; search: string; sortBy: string; sortOrder: string }
interface CreateUserRequest { name: string; email: string; password: string; role: string }
interface UpdateUserRequest { id: string; name?: string; email?: string; password?: string; role?: string; isActive?: boolean }
interface DeleteUserRequest { id: string; userId: string }
interface ToggleUserStatusRequest { id: string; userId: string }
interface UpdateUserRoleRequest { id: string; role: string; userId: string }
interface UserResponse { success: boolean; message: string; data: User | null; error: ApiError | null }
interface ListUsersResponse { success: boolean; message: string; data: User[]; pagination: Pagination | null; error: ApiError | null }

export const getUser: handleUnaryCall<GetUserRequest, UserResponse> = async (call, callback) => {
  try {
    const { id } = call.request;
    if (!id) { callback(null, { success: false, message: 'User ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const user = await userRepository.findUserById(id);
    if (!user) { callback(null, { success: false, message: 'User not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    callback(null, { success: true, message: 'OK', data: user as any, error: null });
  } catch (error) {
    logger.error('gRPC GetUser error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const listUsers: handleUnaryCall<PaginationRequest, ListUsersResponse> = async (call, callback) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = call.request;
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    const filters: any = {};
    if (search) filters.search = search;
    const result = await userRepository.findUsers(currentPage, currentLimit, filters, { sortBy: sortBy || 'createdAt', sortOrder: (sortOrder as 'asc' | 'desc') || 'desc' });
    callback(null, { success: true, message: 'OK', data: result.data as any[], pagination: { page: currentPage, limit: currentLimit, total: result.pagination.total, totalPages: result.pagination.pages }, error: null });
  } catch (error) {
    logger.error('gRPC ListUsers error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: [], pagination: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const createUser: handleUnaryCall<CreateUserRequest, UserResponse> = async (call, callback) => {
  try {
    const { name, email, password } = call.request;
    const role = call.request.role as 'user' | 'admin' | undefined;
    const emailExists = await userRepository.existsByEmail(email);
    if (emailExists) { callback(null, { success: false, message: 'Email already exists', data: null, error: { message: 'Conflict', code: 'CONFLICT', details: {} } }); return; }
    const user = await userRepository.createUser({ name, email, password, role: role || undefined });
    callback(null, { success: true, message: 'User created', data: user as any, error: null });
  } catch (error) {
    logger.error('gRPC CreateUser error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const updateUser: handleUnaryCall<UpdateUserRequest, UserResponse> = async (call, callback) => {
  try {
    const { id, name, email, password, isActive } = call.request;
    const role = call.request.role as 'user' | 'admin' | undefined;
    if (!id) { callback(null, { success: false, message: 'User ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const exists = await userRepository.existsById(id);
    if (!exists) { callback(null, { success: false, message: 'User not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    const user = await userRepository.updateUser(id, { name: name || undefined, email: email || undefined, password: password || undefined, role: role || undefined, isActive: isActive !== undefined ? isActive : undefined });
    callback(null, { success: true, message: 'User updated', data: user as any, error: null });
  } catch (error) {
    logger.error('gRPC UpdateUser error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const deleteUser: handleUnaryCall<DeleteUserRequest, any> = async (call, callback) => {
  try {
    const { id, userId } = call.request;
    if (!id) { callback(null, { success: false, message: 'User ID is required', error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    if (userId === id) { callback(null, { success: false, message: 'Cannot delete yourself', error: { message: 'Forbidden', code: 'FORBIDDEN', details: {} } }); return; }
    const exists = await userRepository.existsById(id);
    if (!exists) { callback(null, { success: false, message: 'User not found', error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    await userRepository.deleteUser(id);
    callback(null, { success: true, message: 'User deleted', error: null });
  } catch (error) {
    logger.error('gRPC DeleteUser error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const toggleUserStatus: handleUnaryCall<ToggleUserStatusRequest, UserResponse> = async (call, callback) => {
  try {
    const { id, userId } = call.request;
    if (!id) { callback(null, { success: false, message: 'User ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    if (userId === id) { callback(null, { success: false, message: 'Cannot deactivate yourself', data: null, error: { message: 'Forbidden', code: 'FORBIDDEN', details: {} } }); return; }
    const user = await userRepository.toggleUserStatus(id);
    callback(null, { success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user as any, error: null });
  } catch {
    callback(null, { success: false, message: 'User not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } });
  }
};

export const updateUserRole: handleUnaryCall<UpdateUserRoleRequest, UserResponse> = async (call, callback) => {
  try {
    const { id, userId } = call.request;
    const role = call.request.role as 'user' | 'admin';
    if (!id) { callback(null, { success: false, message: 'User ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    if (!role || !['user', 'admin'].includes(role)) { callback(null, { success: false, message: 'Invalid role', data: null, error: { message: 'Invalid role', code: 'INVALID', details: {} } }); return; }
    if (userId === id) { callback(null, { success: false, message: 'Cannot change own role', data: null, error: { message: 'Forbidden', code: 'FORBIDDEN', details: {} } }); return; }
    const user = await userRepository.updateUserRole(id, role);
    callback(null, { success: true, message: 'Role updated', data: user as any, error: null });
  } catch {
    callback(null, { success: false, message: 'User not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } });
  }
};

export const userHandlers = {
  GetUser: getUser,
  ListUsers: listUsers,
  CreateUser: createUser,
  UpdateUser: updateUser,
  DeleteUser: deleteUser,
  ToggleUserStatus: toggleUserStatus,
  UpdateUserRole: updateUserRole,
};
