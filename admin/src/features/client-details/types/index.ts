export interface Client {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ClientsResponse {
  success: boolean;
  data: Client[];
  pagination: PaginationInfo;
  message?: string;
}

export interface UseClientsQueryParams {
  page: number;
  limit: number;
  searchQuery: string;
  statusFilter: string;
  sortBy?: string;
  sortOrder?: string;
}
