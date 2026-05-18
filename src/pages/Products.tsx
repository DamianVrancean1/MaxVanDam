import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '../types';
import { getProducts, searchProducts } from '../services/productService';
import { getPriceRange, useProductFilters } from '../hooks/useProductFilters';
import { useDebounce } from '../hooks/useDebounce';
import type { ProductFilters } from '../types/filters';
import Card from '../components/common/Card';
import PriceRangeFilter from '../components/filters/PriceRangeFilter';
import BrandCheckboxGroup from '../components/filters/BrandCheckboxGroup';
import StockToggle from '../components/filters/StockToggle';
import CompatibilitySelector from '../components/filters/CompatibilitySelector';
import ActiveFiltersBar from '../components/filters/ActiveFiltersBar';
import { hasActiveFilters } from '../types/filters';
import '../styles/Products.css';
import '../styles/Filters.css';

const allProducts = getProducts();

const Products = () => {
  const { filters, setFilter, resetFilters, toggleBrand } = useProductFilters();
  const debouncedFilters = useDebounce(filters, 400);

  const [results, setResults] = useState<Product[]>(allProducts);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    searchProducts(debouncedFilters).then(data => {
      if (controller.signal.aborted) return;
      setResults(data);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [debouncedFilters]);

  // Close sidebar when a filter is applied on mobile
  const closeSidebarOnMobile = useCallback(() => {
    if (window.innerWidth <= 1024) setSidebarOpen(false);
  }, []);

  const priceRange = useMemo(() => getPriceRange(allProducts), []);

  const categories = useMemo(
    () => ['Toate', ...Array.from(new Set(allProducts.map(p => p.category)))],
    []
  );

  // Count per category — considers all other active filters except category itself
  const categoryCounts = useMemo(() => {
    const countsMap: Record<string, number> = {};
    const filtersWithoutCat = { ...filters, category: 'Toate' };
    const base = allProducts.filter(p => {
      if (filters.search) {
        const t = filters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(t) && !(p.brand ?? '').toLowerCase().includes(t)) return false;
      }
      if (filters.minPrice !== null && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;
      if (filters.brands.length && (!p.brand || !filters.brands.includes(p.brand))) return false;
      if (filters.inStockOnly && p.stock <= 0) return false;
      void filtersWithoutCat;
      return true;
    });
    base.forEach(p => { countsMap[p.category] = (countsMap[p.category] ?? 0) + 1; });
    countsMap['Toate'] = base.length;
    return countsMap;
  }, [filters]);

  const handleRemoveFilter = useCallback((key: keyof ProductFilters, value?: string) => {
    if (key === 'brands' && value) {
      setFilter('brands', filters.brands.filter(b => b !== value));
    } else if (key === 'search')        setFilter('search', '');
    else if (key === 'category')        setFilter('category', 'Toate');
    else if (key === 'minPrice')        setFilter('minPrice', null);
    else if (key === 'maxPrice')        setFilter('maxPrice', null);
    else if (key === 'inStockOnly')     setFilter('inStockOnly', false);
    else if (key === 'compatibleBrand') setFilter('compatibleBrand', '');
    else if (key === 'compatibleModel') setFilter('compatibleModel', '');
  }, [filters.brands, setFilter]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.search)              n++;
    if (filters.category !== 'Toate') n++;
    if (filters.minPrice !== null)   n++;
    if (filters.maxPrice !== null)   n++;
    n += filters.brands.length;
    if (filters.inStockOnly)         n++;
    if (filters.compatibleBrand)     n++;
    return n;
  }, [filters]);

  return (
    <div className="products-page ix-dashboard-layout">

      {/* Mobile filter toggle */}
      <div className="prd-mobile-bar">
        <button
          type="button"
          className={`prd-mobile-toggle${sidebarOpen ? ' prd-mobile-toggle--open' : ''}`}
          onClick={() => setSidebarOpen(v => !v)}
          aria-expanded={sidebarOpen}
          aria-controls="products-sidebar"
        >
          <svg viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <rect x="0" y="0" width="20" height="2" rx="1" fill="currentColor" />
            <rect x="3" y="6" width="14" height="2" rx="1" fill="currentColor" />
            <rect x="6" y="12" width="8" height="2" rx="1" fill="currentColor" />
          </svg>
          Filtre
          {activeCount > 0 && (
            <span className="prd-mobile-badge">{activeCount}</span>
          )}
        </button>
        <span className="prd-mobile-count">
          {loading ? 'Se caută...' : `${results.length} rezultate`}
        </span>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="prd-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="products-sidebar"
        className={`ix-sidebar${sidebarOpen ? ' prd-sidebar--open' : ''}`}
        aria-label="Filtre catalog"
      >
        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Catalog</span>
          <input
            type="text"
            placeholder="Caută produs, brand..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="search-input"
            aria-label="Caută în catalog"
          />
        </div>

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Categorie</span>
          <div className="category-filters" role="list">
            {categories.map(cat => {
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  role="listitem"
                  onClick={() => { setFilter('category', cat); closeSidebarOnMobile(); }}
                  className={`category-btn${filters.category === cat ? ' active' : ''}`}
                  aria-pressed={filters.category === cat}
                >
                  {cat}
                  {cat !== 'Toate' && (
                    <span className="category-btn-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <p className="flt-section-title">Preț (MDL)</p>
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            absoluteMin={priceRange.min}
            absoluteMax={priceRange.max}
            onChange={(min, max) => {
              setFilter('minPrice', min);
              setFilter('maxPrice', max);
            }}
          />
        </div>

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <p className="flt-section-title">Brand piese</p>
          <BrandCheckboxGroup selected={filters.brands} onToggle={toggleBrand} />
        </div>

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <StockToggle
            checked={filters.inStockOnly}
            onChange={val => { setFilter('inStockOnly', val); closeSidebarOnMobile(); }}
          />
        </div>

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <p className="flt-section-title">Compatibilitate vehicul</p>
          <CompatibilitySelector
            compatibleBrand={filters.compatibleBrand}
            compatibleModel={filters.compatibleModel}
            onBrandChange={val => setFilter('compatibleBrand', val)}
            onModelChange={val => { setFilter('compatibleModel', val); closeSidebarOnMobile(); }}
          />
        </div>

        <div className="ix-sidebar-divider" />

        {hasActiveFilters(filters) && (
          <div className="ix-sidebar-section">
            <button
              type="button"
              className="prd-clear-btn"
              onClick={() => { resetFilters(); setSidebarOpen(false); }}
            >
              Șterge toate filtrele
            </button>
          </div>
        )}

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Status Depozit</span>
          <div className="ix-sidebar-stats">
            <div className="ix-stat-row">
              <span className="ix-stat-label">Total produse</span>
              <span className="ix-stat-value">{allProducts.length}</span>
            </div>
            <div className="ix-stat-row">
              <span className="ix-stat-label">{loading ? 'Se caută...' : 'Filtrate'}</span>
              <span className="ix-stat-value">{loading ? '—' : results.length}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT PANEL */}
      <div className="ix-content-panel">
        <div className="ix-panel-header">
          <h1>Produse Disponibile</h1>
          <div className="ix-badge">
            {loading ? 'Se caută...' : `${results.length} rezultate`}
          </div>
        </div>

        <ActiveFiltersBar
          filters={filters}
          onRemove={handleRemoveFilter}
          onReset={resetFilters}
          totalCount={allProducts.length}
          filteredCount={results.length}
        />

        <div className={`products-grid ix-product-grid${loading ? ' prd-loading' : ''}`}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="prd-skeleton" aria-hidden="true" />
            ))
          ) : results.length > 0 ? (
            results.map(product => (
              <Card key={product.id} product={product} />
            ))
          ) : (
            <div className="no-products" role="status">
              <span className="no-products-icon" aria-hidden="true">⊘</span>
              <p>Nu există produse pentru filtrele selectate.</p>
              <button type="button" className="category-btn" onClick={resetFilters}>
                Șterge toate filtrele
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Products;
