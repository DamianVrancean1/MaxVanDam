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

const PRODUCTS_STORAGE_KEY = 'mockProducts';
const PRODUCTS_VERSION_KEY = 'mockProductsVersion';
const PRODUCTS_DATA_VERSION = 'v3-format-products-100';
const MIN_PRODUCTS_COUNT = 100;

const brandModels = [
  { brand: 'BMW', models: ['Seria 3', 'Seria 5', 'X3', 'X5'] },
  { brand: 'Audi', models: ['A3', 'A4', 'A6', 'Q5'] },
  { brand: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'GLC', 'GLE'] },
  { brand: 'Volkswagen', models: ['Golf', 'Passat', 'Tiguan', 'Touareg'] }
] as const;

const categories = [
  { name: 'Filtre de aer', part: 'Filtru aer', min: 80, max: 180, image: 'Air+Filter' },
  { name: 'Filtre de ulei', part: 'Filtru ulei', min: 40, max: 120, image: 'Oil+Filter' },
  { name: 'Filtre de combustibil', part: 'Filtru combustibil', min: 75, max: 175, image: 'Fuel+Filter' },
  { name: 'Filtre de habitaclu', part: 'Filtru habitaclu', min: 55, max: 145, image: 'Cabin+Filter' },
  { name: 'Sistem de frânare', part: 'Plăcuțe de frână față', min: 170, max: 520, image: 'Brake+Pads' },
  { name: 'Sistem de frânare', part: 'Plăcuțe de frână spate', min: 160, max: 470, image: 'Brake+Pads' },
  { name: 'Sistem de frânare', part: 'Discuri de frână față', min: 300, max: 980, image: 'Brake+Discs' },
  { name: 'Sistem de frânare', part: 'Discuri de frână spate', min: 270, max: 860, image: 'Brake+Discs' },
  { name: 'Suspensie', part: 'Amortizor față', min: 230, max: 720, image: 'Shock+Absorber' },
  { name: 'Suspensie', part: 'Amortizor spate', min: 220, max: 680, image: 'Shock+Absorber' },
  { name: 'Suspensie', part: 'Arc suspensie', min: 160, max: 430, image: 'Coil+Spring' },
  { name: 'Transmisie', part: 'Kit ambreiaj', min: 680, max: 1900, image: 'Clutch+Kit' },
  { name: 'Electric', part: 'Baterie', min: 420, max: 980, image: 'Car+Battery' },
  { name: 'Motor', part: 'Bujii', min: 30, max: 110, image: 'Spark+Plug' },
  { name: 'Motor', part: 'Bobine de inducție', min: 110, max: 320, image: 'Ignition+Coil' },
  { name: 'Răcire', part: 'Pompa de apă', min: 210, max: 560, image: 'Water+Pump' },
  { name: 'Alimentare', part: 'Pompa de combustibil', min: 260, max: 760, image: 'Fuel+Pump' },
  { name: 'Răcire', part: 'Radiator', min: 380, max: 1150, image: 'Radiator' },
  { name: 'Motor', part: 'Curea de distribuție', min: 140, max: 430, image: 'Timing+Belt' },
  { name: 'Motor', part: 'Curea de accesorii', min: 70, max: 220, image: 'Serpentine+Belt' },
  { name: 'Senzori', part: 'Senzor ABS', min: 120, max: 320, image: 'ABS+Sensor' },
  { name: 'Senzori', part: 'Senzor de temperatură', min: 60, max: 190, image: 'Temperature+Sensor' },
  { name: 'Rulare', part: 'Rulment roată', min: 130, max: 360, image: 'Wheel+Bearing' },
  { name: 'Suspensie', part: 'Braț de suspensie', min: 220, max: 620, image: 'Control+Arm' },
  { name: 'Direcție', part: 'Capăt de bară', min: 80, max: 270, image: 'Tie+Rod+End' },
  { name: 'Suspensie', part: 'Bieletă antiruliu', min: 75, max: 230, image: 'Sway+Bar+Link' },
  { name: 'Răcire', part: 'Termostat', min: 110, max: 310, image: 'Thermostat' },
  { name: 'Motor', part: 'Garnitură capac supape', min: 60, max: 210, image: 'Gasket' },
  { name: 'Electric', part: 'Alternator', min: 620, max: 1650, image: 'Alternator' },
  { name: 'Electric', part: 'Electromotor', min: 560, max: 1520, image: 'Starter+Motor' },
  { name: 'Motor', part: 'Turbocompresor', min: 1500, max: 4200, image: 'Turbocharger' },
  { name: 'Alimentare', part: 'Injectoare', min: 260, max: 980, image: 'Injector' }
] as const;

const enginesByBrand: Record<string, string[]> = {
  BMW: ['320d', '330i', '520d', '530i', 'xDrive20d', 'xDrive30d'],
  Audi: ['30 TDI', '35 TFSI', '40 TFSI', '45 TDI', '50 TDI'],
  'Mercedes-Benz': ['C200', 'C220d', 'E220d', 'E300', 'GLC220d', 'GLE350d'],
  Volkswagen: ['1.5 TSI', '2.0 TDI', '2.0 TSI', '3.0 V6 TDI', '1.6 TDI']
};

const createSeedProducts = (): Product[] => {
  const generated: Product[] = [];

  for (let i = 0; i < MIN_PRODUCTS_COUNT; i += 1) {
    const brandGroup = brandModels[i % brandModels.length];
    const model = brandGroup.models[Math.floor(i / brandModels.length) % brandGroup.models.length];
    const category = categories[i % categories.length];
    const engines = enginesByBrand[brandGroup.brand];

    const min = category.min;
    const max = category.max;
    const rawPrice = min + ((i * 43) % Math.max(max - min, 1));
    const price = Math.round(rawPrice / 5) * 5;
    const stock = 5 + ((i * 13) % 90);

    const engineA = engines[i % engines.length];
    const engineB = engines[(i + 2) % engines.length];

    const name = `${category.part} ${brandGroup.brand} ${model}`;
    const shortDescription = `${category.part} pentru ${brandGroup.brand} ${model}, calitate OEM pentru utilizare zilnică.`;
    const image = '';
    const compatibility = [
      `${brandGroup.brand} ${model} ${engineA}`,
      `${brandGroup.brand} ${model} ${engineB}`
    ];

    generated.push({
      id: i + 1,
      name,
      brand: brandGroup.brand,
      model,
      category: category.name,
      price,
      stock,
      shortDescription,
      image,
      compatibility,
      // Backward compatibility for current UI
      description: shortDescription,
      imageUrl: image
    });
  }

  return generated;
};

export const products: Product[] = createSeedProducts();

const readProductsFromStorage = (): Product[] => {
  const savedVersion = localStorage.getItem(PRODUCTS_VERSION_KEY);
  const rawProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!rawProducts || savedVersion !== PRODUCTS_DATA_VERSION) {
    return [...products];
  }

  try {
    const parsedProducts = JSON.parse(rawProducts) as Product[];
    if (!Array.isArray(parsedProducts) || parsedProducts.length < MIN_PRODUCTS_COUNT) {
      return [...products];
    }

    return parsedProducts.map(product => ({
      ...product,
      shortDescription: product.shortDescription || product.description,
      image: product.image ?? product.imageUrl,
      compatibility: product.compatibility || [],
      description: product.description || product.shortDescription || '',
      imageUrl: product.imageUrl ?? product.image ?? ''
    }));
  } catch {
    return [...products];
  }
};

const persistProducts = (value: Product[] = mockProducts) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(value));
  localStorage.setItem(PRODUCTS_VERSION_KEY, PRODUCTS_DATA_VERSION);
};

// Mock Products - auto parts
export const mockProducts: Product[] = readProductsFromStorage();

if (
  !localStorage.getItem(PRODUCTS_STORAGE_KEY) ||
  localStorage.getItem(PRODUCTS_VERSION_KEY) !== PRODUCTS_DATA_VERSION ||
  mockProducts.length < MIN_PRODUCTS_COUNT
) {
  persistProducts(mockProducts);
}

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
  const maxId = mockProducts.length > 0 ? Math.max(...mockProducts.map(p => p.id)) : 0;
  const newProduct: Product = {
    ...product,
    brand: product.brand || 'BMW',
    model: product.model || 'Seria 3',
    shortDescription: product.shortDescription || product.description,
    image: product.image ?? product.imageUrl,
    compatibility: product.compatibility || ['BMW Seria 3 320d'],
    description: product.description || product.shortDescription || '',
    imageUrl: product.imageUrl ?? product.image ?? '',
    id: maxId + 1
  };

  mockProducts.push(newProduct);
  persistProducts();
  return newProduct;
};

// Function to update product (simulating API call)
export const updateProduct = (
  id: number,
  productData: Omit<Product, 'id'>
): Product | undefined => {
  const productIndex = mockProducts.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return undefined;
  }

  mockProducts[productIndex] = {
    ...productData,
    id,
    brand: productData.brand || 'BMW',
    model: productData.model || 'Seria 3',
    shortDescription: productData.shortDescription || productData.description,
    image: productData.image ?? productData.imageUrl,
    compatibility: productData.compatibility || ['BMW Seria 3 320d'],
    description: productData.description || productData.shortDescription || '',
    imageUrl: productData.imageUrl ?? productData.image ?? ''
  };

  persistProducts();
  return mockProducts[productIndex];
};

// Function to delete product (simulating API call)
export const deleteProduct = (id: number): boolean => {
  const productIndex = mockProducts.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return false;
  }

  mockProducts.splice(productIndex, 1);
  persistProducts();
  return true;
};
