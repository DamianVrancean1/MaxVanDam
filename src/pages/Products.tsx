import { useMemo, useState } from 'react';
import type { Product } from '../types';
import { getProducts } from '../services/productService';
import Card from '../components/common/Card';
import '../styles/Products.css';

const Products = () => {
  const [products] = useState<Product[]>(() => getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'Toate' || product.category === selectedCategory;
      const matchesSearch =
        !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(
    () => ['Toate', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  return (
    <div className="products-page ix-dashboard-layout">

      {/* SIDEBAR — filters & category navigation */}
      <aside className="ix-sidebar">
        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Catalog</span>
          <input
            type="text"
            placeholder="Caută produs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="ix-sidebar-divider" />

        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Categorie</span>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="ix-sidebar-divider" />

        {/* Stats panel in sidebar */}
        <div className="ix-sidebar-section">
          <span className="ix-sidebar-title">Status Depozit</span>
          <div className="ix-sidebar-stats">
            <div className="ix-stat-row">
              <span className="ix-stat-label">Total produse</span>
              <span className="ix-stat-value">{products.length}</span>
            </div>
            <div className="ix-stat-row">
              <span className="ix-stat-label">Filtrate</span>
              <span className="ix-stat-value">{filteredProducts.length}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT PANEL — products grid */}
      <div className="ix-content-panel">
        <div className="ix-panel-header">
          <h1>Produse Disponibile</h1>
          <div className="ix-badge">{filteredProducts.length} rezultate</div>
        </div>

        <div className="products-grid ix-product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card key={product.id} product={product} />
            ))
          ) : (
            <p className="no-products">Nu există produse disponibile.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Products;
