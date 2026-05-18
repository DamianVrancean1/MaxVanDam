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
}

export interface AuthContextType {
  user: User | null;
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
  warehouseLocation?: string;
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

export interface Testimonial {
  id: number;
  authorName: string;
  company: string;
  role: string;
  location?: string;
  rating: number;    // 1–5
  title: string;
  body: string;
  date: string;      // 'YYYY-MM-DD'
  featured?: boolean;
}

export interface TestimonialStats {
  average: number;
  total: number;
  recommendedPercent: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
