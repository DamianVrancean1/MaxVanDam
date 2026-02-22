import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { getProducts } from '../data/mockData';
import Card from '../components/common/Card';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'Toate') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const categories = ['Toate', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="products-page">
      <h1>Produse Disponibile</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Caută produs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

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

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Card key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">Nu există produse disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
