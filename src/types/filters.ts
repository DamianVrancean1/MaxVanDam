// ── Filter state ──────────────────────────────────────────────────────────────

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  brands: string[];
  inStockOnly: boolean;
  compatibleBrand: string;
  compatibleModel: string;
}

export const EMPTY_FILTERS: ProductFilters = {
  search: '',
  category: 'Toate',
  minPrice: null,
  maxPrice: null,
  brands: [],
  inStockOnly: false,
  compatibleBrand: '',
  compatibleModel: '',
};

// ── Brand / model catalog for filter UI ──────────────────────────────────────

export interface BrandEntry {
  brand: string;
  models: string[];
}

export const VEHICLE_BRANDS: BrandEntry[] = [
  { brand: 'BMW',           models: ['Seria 1', 'Seria 3', 'Seria 5', 'X1', 'X3', 'X5'] },
  { brand: 'Audi',          models: ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'] },
  { brand: 'Mercedes-Benz', models: ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE'] },
  { brand: 'Volkswagen',    models: ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg'] },
  { brand: 'Toyota',        models: ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Prius'] },
  { brand: 'Ford',          models: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Explorer'] },
  { brand: 'Skoda',         models: ['Fabia', 'Octavia', 'Superb', 'Karoq', 'Kodiaq'] },
  { brand: 'Renault',       models: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Koleos'] },
];

// Brand names list derived from above — used for checkbox group
export const PART_BRANDS = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen'] as const;
export type PartBrand = typeof PART_BRANDS[number];

// ── URL param keys ────────────────────────────────────────────────────────────

export const FILTER_PARAMS = {
  search:          'search',
  category:        'category',
  minPrice:        'minPrice',
  maxPrice:        'maxPrice',
  brands:          'brands',
  inStockOnly:     'inStock',
  compatibleBrand: 'cbrand',
  compatibleModel: 'cmodel',
} as const;

// ── Serialization helpers ─────────────────────────────────────────────────────

export function filtersToParams(filters: ProductFilters): URLSearchParams {
  const p = new URLSearchParams();

  if (filters.search)                    p.set(FILTER_PARAMS.search,          filters.search);
  if (filters.category !== 'Toate')      p.set(FILTER_PARAMS.category,        filters.category);
  if (filters.minPrice !== null)         p.set(FILTER_PARAMS.minPrice,        String(filters.minPrice));
  if (filters.maxPrice !== null)         p.set(FILTER_PARAMS.maxPrice,        String(filters.maxPrice));
  if (filters.brands.length)            p.set(FILTER_PARAMS.brands,          filters.brands.join(','));
  if (filters.inStockOnly)              p.set(FILTER_PARAMS.inStockOnly,     '1');
  if (filters.compatibleBrand)          p.set(FILTER_PARAMS.compatibleBrand, filters.compatibleBrand);
  if (filters.compatibleModel)          p.set(FILTER_PARAMS.compatibleModel, filters.compatibleModel);

  return p;
}

export function paramsToFilters(params: URLSearchParams): ProductFilters {
  const brandsRaw = params.get(FILTER_PARAMS.brands);
  const minRaw    = params.get(FILTER_PARAMS.minPrice);
  const maxRaw    = params.get(FILTER_PARAMS.maxPrice);

  return {
    search:          params.get(FILTER_PARAMS.search)          ?? '',
    category:        params.get(FILTER_PARAMS.category)        ?? 'Toate',
    minPrice:        minRaw !== null && !isNaN(Number(minRaw)) ? Number(minRaw) : null,
    maxPrice:        maxRaw !== null && !isNaN(Number(maxRaw)) ? Number(maxRaw) : null,
    brands:          brandsRaw ? brandsRaw.split(',').filter(Boolean) : [],
    inStockOnly:     params.get(FILTER_PARAMS.inStockOnly) === '1',
    compatibleBrand: params.get(FILTER_PARAMS.compatibleBrand) ?? '',
    compatibleModel: params.get(FILTER_PARAMS.compatibleModel) ?? '',
  };
}

export function hasActiveFilters(filters: ProductFilters): boolean {
  return (
    !!filters.search ||
    filters.category !== 'Toate' ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    !!filters.compatibleBrand ||
    !!filters.compatibleModel
  );
}
