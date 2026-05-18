import { useMemo } from 'react';
import { getProducts } from '../services/productService';
import { applyFilters, getPriceRange, useProductFilters } from '../hooks/useProductFilters';
import type { ProductFilters } from '../types/filters';
import Card from '../components/common/Card';
import PriceRangeFilter from '../components/filters/PriceRangeFilter';
import BrandCheckboxGroup from '../components/filters/BrandCheckboxGroup';
import StockToggle from '../components/filters/StockToggle';
import CompatibilitySelector from '../components/filters/CompatibilitySelector';
import ActiveFiltersBar from '../components/filters/ActiveFiltersBar';
import '../styles/Products.css';
import '../styles/Filters.css';

const allProducts = getProducts();

const Products = () => {
  const { filters, setFilter, resetFilters, toggleBrand } = useProductFilters();

  const priceRange = useMemo(() => getPriceRange(allProducts), []);

  const categories = useMemo(
    () => ['Toate', ...Array.from(new Set(allProducts.map(p => p.category)))],
    []
  );

  const filteredProducts = useMemo(
    () => applyFilters(allProducts, filters),
    [filters]
  );

  const handleRemoveFilter = (key: keyof ProductFilters, value?: string) => {
    if (key === 'brands' && value) {
      setFilter('brands', filters.brands.filter(b => b !== value));
    } else if (key === 'search')          setFilter('search', '');
    else if (key === 'category')          setFilter('category', 'Toate');
    else if (key === 'minPrice')          setFilter('minPrice', null);
    else if (key === 'maxPrice')          setFilter('maxPrice', null);
    else if (key === 'inStockOnly')       setFilter('inStockOnly', false);
    else if (key === 'compatibleBrand')   setFilter('compatibleBrand', '');
    else if (key === 'compatibleModel')   setFilter('compatibleModel', '');
  };

  return (
    <div className="products-page ix-dashboard-layout">

      {/* SIDEBAR */}
      <aside className="ix-sidebar">

        {/* Search */}
        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Catalog</span>
          <input
            type="text"
            placeholder="Caută produs, brand..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="ix-sidebar-divider" />

        {/* Category */}
        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Categorie</span>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter('category', cat)}
                className={`category-btn${filters.category === cat ? ' active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="ix-sidebar-divider" />

        {/* Price range */}
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

        {/* Brand */}
        <div className="ix-sidebar-section">
          <p className="flt-section-title">Brand piese</p>
          <BrandCheckboxGroup selected={filters.brands} onToggle={toggleBrand} />
        </div>

        <div className="ix-sidebar-divider" />

        {/* Stock */}
        <div className="ix-sidebar-section">
          <StockToggle
            checked={filters.inStockOnly}
            onChange={val => setFilter('inStockOnly', val)}
          />
        </div>

        <div className="ix-sidebar-divider" />

        {/* Compatibility */}
        <div className="ix-sidebar-section">
          <p className="flt-section-title">Compatibilitate vehicul</p>
          <CompatibilitySelector
            compatibleBrand={filters.compatibleBrand}
            compatibleModel={filters.compatibleModel}
            onBrandChange={val => setFilter('compatibleBrand', val)}
            onModelChange={val => setFilter('compatibleModel', val)}
          />
        </div>

        <div className="ix-sidebar-divider" />

        {/* Stats */}
        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Status Depozit</span>
          <div className="ix-sidebar-stats">
            <div className="ix-stat-row">
              <span className="ix-stat-label">Total produse</span>
              <span className="ix-stat-value">{allProducts.length}</span>
            </div>
            <div className="ix-stat-row">
              <span className="ix-stat-label">Filtrate</span>
              <span className="ix-stat-value">{filteredProducts.length}</span>
            </div>
          </div>
        </div>

      </aside>

      {/* CONTENT PANEL */}
      <div className="ix-content-panel">
        <div className="ix-panel-header">
          <h1>Produse Disponibile</h1>
          <div className="ix-badge">{filteredProducts.length} rezultate</div>
        </div>

        <ActiveFiltersBar
          filters={filters}
          onRemove={handleRemoveFilter}
          onReset={resetFilters}
          totalCount={allProducts.length}
          filteredCount={filteredProducts.length}
        />

        <div className="products-grid ix-product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card key={product.id} product={product} />
            ))
          ) : (
            <p className="no-products">Nu există produse pentru filtrele selectate.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Products;
