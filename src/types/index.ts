// Types and Interfaces for the application

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
  email: string;
}

export interface StoredUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  email: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  role: string;
  email: string;
  createdAt: string;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAdmin: () => boolean;
}

export interface Product {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  category: string;
  price: number;
  stock: number;
  shortDescription?: string;
  image?: string;
  compatibility?: string[];
  description: string;
  imageUrl: string;
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
