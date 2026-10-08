import type { Prisma } from '@prisma/client';

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface UserSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends UserPublic {
  password: string;
}

export interface IUserRepository {
  findUsers(
    page: number,
    limit: number,
    filters?: UserFilters,
    sortOptions?: UserSortOptions
  ): Promise<PaginatedResult<UserPublic>>;

  findUserById(id: string): Promise<UserPublic | null>;

  findUserByEmail(email: string): Promise<UserWithPassword | null>;

  createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
    permissions?: string[];
  }): Promise<UserWithPassword>;

  updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'user' | 'admin';
      isActive?: boolean;
      permissions?: string[];
    }
  ): Promise<UserPublic>;

  deleteUser(id: string): Promise<void>;

  toggleUserStatus(id: string): Promise<UserPublic>;

  updateUserRole(id: string, role: 'user' | 'admin'): Promise<UserPublic>;

  existsById(id: string): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;
}

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY';