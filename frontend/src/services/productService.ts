import type { InventoryNotification, Product } from '../types';
import { products as seedProducts } from '../data/mockData';

const PRODUCTS_STORAGE_KEY = 'mockProducts';
const PRODUCTS_VERSION_KEY = 'mockProductsVersion';
const PRODUCTS_DATA_VERSION = 'v6-stock-notifications';
const NOTIFICATIONS_STORAGE_KEY = 'inventoryNotifications';
const MIN_PRODUCTS_COUNT = 100;

const getDefaultWarehouseLocation = (productId: number): string => {
  const row = String.fromCharCode(65 + (Math.max(productId, 1) - 1) % 8);
  const slot = ((Math.max(productId, 1) - 1) % 24) + 1;
  return `${row}-${slot}`;
};

const normalizeProduct = (product: Product): Product => ({
  ...product,
  brand: product.brand || 'BMW',
  model: product.model || 'Seria 3',
  warehouseLocation: product.warehouseLocation || getDefaultWarehouseLocation(product.id),
  shortDescription: product.shortDescription || product.description,
  image: product.image ?? product.imageUrl,
  compatibility: product.compatibility || ['BMW Seria 3 320d'],
  description: product.description || product.shortDescription || '',
  imageUrl: product.imageUrl ?? product.image ?? ''
});

const readProductsFromStorage = (): Product[] => {
  const savedVersion = localStorage.getItem(PRODUCTS_VERSION_KEY);
  const rawProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!rawProducts || savedVersion !== PRODUCTS_DATA_VERSION) {
    return seedProducts.map(normalizeProduct);
  }

  try {
    const parsedProducts = JSON.parse(rawProducts) as Product[];
    if (!Array.isArray(parsedProducts) || parsedProducts.length < MIN_PRODUCTS_COUNT) {
      return seedProducts.map(normalizeProduct);
    }

    return parsedProducts.map(normalizeProduct);
  } catch {
    return seedProducts.map(normalizeProduct);
  }
};

const productsStore: Product[] = readProductsFromStorage();

const persistProducts = () => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsStore));
  localStorage.setItem(PRODUCTS_VERSION_KEY, PRODUCTS_DATA_VERSION);
};

const readNotifications = (): InventoryNotification[] => {
  const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as InventoryNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistNotifications = (notifications: InventoryNotification[]) => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
};

const createInventoryNotification = (product: Product) => {
  const notifications = readNotifications();
  const exists = notifications.some(n => n.productId === product.id && !n.read);

  if (exists) return;

  notifications.unshift({
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    message: `Stoc epuizat pentru produsul "${product.name}"`,
    createdAt: new Date().toISOString(),
    read: false
  });

  persistNotifications(notifications);
};

if (
    !localStorage.getItem(PRODUCTS_STORAGE_KEY) ||
    localStorage.getItem(PRODUCTS_VERSION_KEY) !== PRODUCTS_DATA_VERSION ||
    productsStore.length < MIN_PRODUCTS_COUNT
) {
  persistProducts();
}

export const getProducts = (): Product[] => {
  return [...productsStore];
};

export const getProductById = (id: number): Product | undefined => {
  return productsStore.find(product => product.id === id);
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const maxId = productsStore.length > 0 ? Math.max(...productsStore.map(p => p.id)) : 0;
  const newProduct = normalizeProduct({
    ...product,
    id: maxId + 1
  });

  productsStore.push(newProduct);
  persistProducts();
  return newProduct;
};

export const updateProduct = (
    id: number,
    productData: Omit<Product, 'id'>
): Product | undefined => {
  const productIndex = productsStore.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return undefined;
  }

  productsStore[productIndex] = normalizeProduct({
    ...productData,
    id
  });
  persistProducts();

  return productsStore[productIndex];
};

export const deleteProduct = (id: number): boolean => {
  const productIndex = productsStore.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return false;
  }

  productsStore.splice(productIndex, 1);
  persistProducts();
  return true;
};

export const consumeCartItemsFromStock = (cartItems: { productId: number; quantity: number }[]) => {
  let changed = false;

  cartItems.forEach(({ productId, quantity }) => {
    const product = productsStore.find(item => item.id === productId);
    if (!product) return;

    const nextStock = Math.max(0, product.stock - quantity);
    if (nextStock !== product.stock) {
      product.stock = nextStock;
      changed = true;

      if (product.stock === 0) {
        createInventoryNotification(product);
      }
    }
  });

  if (changed) {
    persistProducts();
  }
};

export const getInventoryNotifications = (): InventoryNotification[] => {
  return readNotifications();
};

export const markNotificationAsRead = (notificationId: number): void => {
  const notifications = readNotifications().map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
  );
  persistNotifications(notifications);
};
