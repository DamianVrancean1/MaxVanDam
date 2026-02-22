import type { User, Product } from '../types';

// Mock Users - admin and regular user
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    email: 'admin@pieseauto.ro'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    role: 'user',
    email: 'user@pieseauto.ro'
  }
];

// Mock Products - auto parts
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Placute Frana Fata',
    category: 'Frane',
    price: 150,
    stock: 25,
    description: 'Placute frana fata pentru diverse modele de autoturisme',
    imageUrl: 'https://via.placeholder.com/300x200?text=Placute+Frana'
  },
  {
    id: 2,
    name: 'Filtru Ulei',
    category: 'Filtre',
    price: 35,
    stock: 50,
    description: 'Filtru ulei motor compatibil cu majoritatea modelelor',
    imageUrl: 'https://via.placeholder.com/300x200?text=Filtru+Ulei'
  },
  {
    id: 3,
    name: 'Discuri Frana',
    category: 'Frane',
    price: 280,
    stock: 15,
    description: 'Set discuri frana pentru axa fata',
    imageUrl: 'https://via.placeholder.com/300x200?text=Discuri+Frana'
  },
  {
    id: 4,
    name: 'Amortizor Fata',
    category: 'Suspensie',
    price: 320,
    stock: 10,
    description: 'Amortizor telescopic fata',
    imageUrl: 'https://via.placeholder.com/300x200?text=Amortizor'
  },
  {
    id: 5,
    name: 'Filtru Aer',
    category: 'Filtre',
    price: 45,
    stock: 40,
    description: 'Filtru aer motor pentru ventilatie optimă',
    imageUrl: 'https://via.placeholder.com/300x200?text=Filtru+Aer'
  },
  {
    id: 6,
    name: 'Bujii',
    category: 'Motor',
    price: 25,
    stock: 60,
    description: 'Set 4 bujii pentru motor',
    imageUrl: 'https://via.placeholder.com/300x200?text=Bujii'
  }
];

// Function to get products (simulating API call)
export const getProducts = (): Product[] => {
  return [...mockProducts];
};

// Function to get product by ID
export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Function to add product (simulating API call)
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Math.max(...mockProducts.map(p => p.id)) + 1
  };
  mockProducts.push(newProduct);
  return newProduct;
};
