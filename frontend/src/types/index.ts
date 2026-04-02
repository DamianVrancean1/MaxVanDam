// Types and Interfaces for the application

export type UserRole = 'admin' | 'user' | 'moderator';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  email: string;
  createdAt?: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface Product {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  category: string;
  price: number;
  stock: number;
  warehouseLocation: string;
  shortDescription?: string;
  image?: string;
  compatibility?: string[];
  description: string;
  imageUrl: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
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
export interface InventoryNotification {
  id: number;
  productId: number;
  productName: string;
  message: string;
  createdAt: string;
  read: boolean;
}