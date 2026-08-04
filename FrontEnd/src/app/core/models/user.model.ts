export type UserRole = 'passenger' | 'driver' | 'admin' | 'dispatcher';
export type UserStatus = 'active' | 'blocked' | 'inactive';

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  avatarUrl?: string | null;
  role: UserRole;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}
