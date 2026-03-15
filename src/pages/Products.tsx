import {useMemo, useState} from 'react';
import type {Product} from '../types';
import {getProducts} from '../services/productService';
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
                        <Card key={product.id} product={product}/>
                    ))
                ) : (
                    <p className="no-products">Nu există produse disponibile.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
