export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'user';
}
