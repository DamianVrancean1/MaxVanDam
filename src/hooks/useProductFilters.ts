import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import {
  type ProductFilters,
  EMPTY_FILTERS,
  filtersToParams,
  paramsToFilters,
} from '../types/filters';

// Apply all filters client-side (used when API returns data or as fallback).
export function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  return products.filter(p => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const inName  = p.name.toLowerCase().includes(term);
      const inBrand = p.brand?.toLowerCase().includes(term) ?? false;
      const inDesc  = p.description?.toLowerCase().includes(term) ?? false;
      if (!inName && !inBrand && !inDesc) return false;
    }

    if (filters.category !== 'Toate' && p.category !== filters.category) return false;

    if (filters.minPrice !== null && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;

    if (filters.brands.length > 0) {
      if (!p.brand || !filters.brands.includes(p.brand)) return false;
    }

    if (filters.inStockOnly && p.stock <= 0) return false;

    if (filters.compatibleBrand || filters.compatibleModel) {
      const compat = p.compatibility ?? [];
      const needle = [filters.compatibleBrand, filters.compatibleModel]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matches = compat.some(c => c.toLowerCase().includes(needle));
      if (!matches) return false;
    }

    return true;
  });
}

// Returns current price range across a product list.
export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (!products.length) return { min: 0, max: 5000 };
  const prices = products.map(p => p.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseProductFiltersReturn {
  filters: ProductFilters;
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  resetFilters: () => void;
  toggleBrand: (brand: string) => void;
}

export function useProductFilters(): UseProductFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>(() =>
    paramsToFilters(searchParams)
  );

  // Debounce timer ref — avoids rapid URL rewrites on fast typing
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync filters → URL (debounced 300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = filtersToParams(filters);
      setSearchParams(next, { replace: true });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters, setSearchParams]);

  const setFilter = useCallback(<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const toggleBrand = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  }, []);

  return { filters, setFilter, resetFilters, toggleBrand };
}
