import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartContextType, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'cartItems';

const CartContext = createContext<CartContextType | undefined>(undefined);

const getStoredCart = (): CartItem[] => {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => getStoredCart());

  const persist = (nextItems: CartItem[]) => {
    setItems(nextItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  };

  const addToCart = (product: Product) => {
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      const nextItems = items.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, product.stock)
            }
          : item
      );
      persist(nextItems);
      return;
    }

    persist([...items, { product, quantity: 1 }]);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const nextItems = items
      .map(item => {
        if (item.product.id !== productId) {
          return item;
        }

        const clamped = Math.max(1, Math.min(quantity, item.product.stock));
        return { ...item, quantity: clamped };
      })
      .filter(item => item.quantity > 0);

    persist(nextItems);
  };

  const removeFromCart = (productId: number) => {
    const nextItems = items.filter(item => item.product.id !== productId);
    persist(nextItems);
  };

  const clearCart = () => {
    persist([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

