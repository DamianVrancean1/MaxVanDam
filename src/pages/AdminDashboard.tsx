import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { getProducts } from '../data/mockData';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    categories: 0
  });

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);

    // Calculate statistics
    const totalStock = allProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const categories = new Set(allProducts.map(p => p.category)).size;

    setStats({
      totalProducts: allProducts.length,
      totalStock,
      totalValue,
      categories
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Panou de Control Admin</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Produse</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Stoc Total</h3>
          <p className="stat-value">{stats.totalStock}</p>
        </div>
        
        <div className="stat-card">
          <h3>Valoare Stoc</h3>
          <p className="stat-value">{stats.totalValue.toFixed(2)} RON</p>
        </div>
        
        <div className="stat-card">
          <h3>Categorii</h3>
          <p className="stat-value">{stats.categories}</p>
        </div>
      </div>

      <div className="actions">
        <Link to="/add-product" className="admin-btn">
          ➕ Adaugă Produs Nou
        </Link>
      </div>

      <div className="products-table-container">
        <h2>Lista Produse</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume</th>
              <th>Categorie</th>
              <th>Preț (RON)</th>
              <th>Stoc</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                <td>
                  <Link to={`/product/${product.id}`} className="view-link">
                    Vezi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
