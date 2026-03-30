import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartContextType, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'cartItems';

const CartContext = createContext<CartContextType | undefined>(undefined);

const normalizeQuantity = (value: number, fallback = 1): number => {
    if (!Number.isFinite(value)) {
        return fallback;
    }

    return Math.trunc(value);
};

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

    const persist = (nextItemsOrUpdater: CartItem[] | ((previousItems: CartItem[]) => CartItem[])) => {
        setItems((previousItems) => {
            const nextItems = typeof nextItemsOrUpdater === 'function'
                ? nextItemsOrUpdater(previousItems)
                : nextItemsOrUpdater;

            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
            return nextItems;
        });
    };

    const addToCart = (product: Product, quantity = 1) => {
        if (product.stock <= 0) {
            return;
        }

        const requested = normalizeQuantity(quantity, 1);
        const safeQuantity = Math.max(1, Math.min(requested, product.stock));

        persist((previousItems) => {
            const existingItem = previousItems.find(item => item.product.id === product.id);

            if (!existingItem) {
                return [...previousItems, { product, quantity: safeQuantity }];
            }

            return previousItems.map(item =>
                item.product.id === product.id
                    ? {
                        ...item,
                        quantity: Math.min(item.quantity + safeQuantity, product.stock)
                    }
                    : item
            );
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        const requested = normalizeQuantity(quantity, 0);

        persist((previousItems) => {
            if (requested <= 0) {
                return previousItems.filter(item => item.product.id !== productId);
            }

            return previousItems
                .map(item => {
                    if (item.product.id !== productId) {
                        return item;
                    }

                    const clamped = Math.max(1, Math.min(requested, item.product.stock));
                    return { ...item, quantity: clamped };
                })
                .filter(item => item.quantity > 0);
        });
    };

    const removeFromCart = (productId: number) => {
        persist((previousItems) => previousItems.filter(item => item.product.id !== productId));
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