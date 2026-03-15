import type { Product } from '../types';
import { products as seedProducts } from '../data/mockData';

const PRODUCTS_STORAGE_KEY = 'mockProducts';
const PRODUCTS_VERSION_KEY = 'mockProductsVersion';
const PRODUCTS_DATA_VERSION = 'v5-images-by-position';
const MIN_PRODUCTS_COUNT = 100;

const normalizeProduct = (product: Product): Product => ({
  ...product,
  brand: product.brand || 'BMW',
  model: product.model || 'Seria 3',
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

