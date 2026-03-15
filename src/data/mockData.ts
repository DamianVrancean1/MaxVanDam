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

const MIN_PRODUCTS_COUNT = 100;

const brandModels = [
  { brand: 'BMW', models: ['Seria 3', 'Seria 5', 'X3', 'X5'] },
  { brand: 'Audi', models: ['A3', 'A4', 'A6', 'Q5'] },
  { brand: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'GLC', 'GLE'] },
  { brand: 'Volkswagen', models: ['Golf', 'Passat', 'Tiguan', 'Touareg'] }
] as const;

const categories = [
  { name: 'Filtre de aer', part: 'Filtru aer', min: 80, max: 180 },
  { name: 'Filtre de ulei', part: 'Filtru ulei', min: 40, max: 120 },
  { name: 'Filtre de combustibil', part: 'Filtru combustibil', min: 75, max: 175 },
  { name: 'Filtre de habitaclu', part: 'Filtru habitaclu', min: 55, max: 145 },
  { name: 'Sistem de frânare', part: 'Plăcuțe de frână față', min: 170, max: 520 },
  { name: 'Sistem de frânare', part: 'Plăcuțe de frână spate', min: 160, max: 470 },
  { name: 'Sistem de frânare', part: 'Discuri de frână față', min: 300, max: 980 },
  { name: 'Sistem de frânare', part: 'Discuri de frână spate', min: 270, max: 860 },
  { name: 'Suspensie', part: 'Amortizor față', min: 230, max: 720 },
  { name: 'Suspensie', part: 'Amortizor spate', min: 220, max: 680 },
  { name: 'Suspensie', part: 'Arc suspensie', min: 160, max: 430 },
  { name: 'Transmisie', part: 'Kit ambreiaj', min: 680, max: 1900 },
  { name: 'Electric', part: 'Baterie', min: 420, max: 980 },
  { name: 'Motor', part: 'Bujii', min: 30, max: 110 },
  { name: 'Motor', part: 'Bobine de inducție', min: 110, max: 320 },
  { name: 'Răcire', part: 'Pompa de apă', min: 210, max: 560 },
  { name: 'Alimentare', part: 'Pompa de combustibil', min: 260, max: 760 },
  { name: 'Răcire', part: 'Radiator', min: 380, max: 1150 },
  { name: 'Motor', part: 'Curea de distribuție', min: 140, max: 430 },
  { name: 'Motor', part: 'Curea de accesorii', min: 70, max: 220 },
  { name: 'Senzori', part: 'Senzor ABS', min: 120, max: 320 },
  { name: 'Senzori', part: 'Senzor de temperatură', min: 60, max: 190 },
  { name: 'Rulare', part: 'Rulment roată', min: 130, max: 360 },
  { name: 'Suspensie', part: 'Braț de suspensie', min: 220, max: 620 },
  { name: 'Direcție', part: 'Capăt de bară', min: 80, max: 270 },
  { name: 'Suspensie', part: 'Bieletă antiruliu', min: 75, max: 230 },
  { name: 'Răcire', part: 'Termostat', min: 110, max: 310 },
  { name: 'Motor', part: 'Garnitură capac supape', min: 60, max: 210 },
  { name: 'Electric', part: 'Alternator', min: 620, max: 1650 },
  { name: 'Electric', part: 'Electromotor', min: 560, max: 1520 },
  { name: 'Motor', part: 'Turbocompresor', min: 1500, max: 4200 },
  { name: 'Alimentare', part: 'Injectoare', min: 260, max: 980 }
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

    const shortDescription = `${category.part} pentru ${brandGroup.brand} ${model}, calitate OEM pentru utilizare zilnică.`;

    generated.push({
      id: i + 1,
      name: `${category.part} ${brandGroup.brand} ${model}`,
      brand: brandGroup.brand,
      model,
      category: category.name,
      price,
      stock,
      shortDescription,
      image: '',
      compatibility: [
        `${brandGroup.brand} ${model} ${engineA}`,
        `${brandGroup.brand} ${model} ${engineB}`
      ],
      description: shortDescription,
      imageUrl: ''
    });
  }

  return generated;
};

export const products: Product[] = createSeedProducts();

