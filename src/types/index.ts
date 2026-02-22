// Types and Interfaces for the application

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
}

export interface FormErrors {
  [key: string]: string;
}
