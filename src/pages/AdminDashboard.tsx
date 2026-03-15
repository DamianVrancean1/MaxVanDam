import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { getProducts, deleteProduct } from '../services/productService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>(() => getProducts());

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const categories = new Set(products.map(p => p.category)).size;

    return {
      totalProducts: products.length,
      totalStock,
      totalValue,
      categories
    };
  }, [products]);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Ești sigur că vrei să ștergi acest produs?');
    if (!confirmed) {
      return;
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      window.alert('Produsul nu a putut fi șters.');
      return;
    }

    setProducts(prev => prev.filter(product => product.id !== id));
  };

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
          <p className="stat-value">{stats.totalValue.toFixed(2)} MDL</p>
        </div>

        <div className="stat-card">
          <h3>Categorii</h3>
          <p className="stat-value">{stats.categories}</p>
        </div>
      </div>

      <div className="actions">
        <Link to="/add-product" className="admin-btn">
          + Adaugă Produs Nou
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
              <th>Preț (MDL)</th>
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
                  <div className="table-actions">
                    <Link to={`/product/${product.id}`} className="view-link">
                      Vezi
                    </Link>
                    <Link to={`/edit-product/${product.id}`} className="edit-link">
                      Editează
                    </Link>
                    <button
                      type="button"
                      className="delete-link"
                      onClick={() => handleDelete(product.id)}
                    >
                      Șterge
                    </button>
                  </div>
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
