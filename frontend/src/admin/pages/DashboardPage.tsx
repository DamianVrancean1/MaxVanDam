import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getInventoryNotifications, markNotificationAsRead } from '../../services/productService';
import { useAxios } from '../../context/AxiosContext';
import { useAuth } from '../../context/AuthContext';
import type { Product, InventoryNotification } from '../../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<InventoryNotification[]>([]);

  useEffect(() => {
    getProducts(axios).then(setProducts);
    getInventoryNotifications(axios).then(setNotifications);
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const categories = new Set(products.map(p => p.category)).size;

  const handleMarkRead = async (id: number) => {
    await markNotificationAsRead(axios, id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="admin-grid">
      <section className="admin-card admin-hero-card">
        <div>
          <span className="admin-eyebrow">Panou nou integrat</span>
          <h2>Bun venit, {user?.username}</h2>
          <p>
            Adminul vechi a fost înlocuit cu o interfață nouă, separată de site-ul public și
            construită în stil dashboard.
          </p>
        </div>
        <Link to="/admin/products" className="admin-primary-link">Gestionează produsele</Link>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>Total produse</span>
          <strong>{products.length}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Stoc total</span>
          <strong>{totalStock}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Categorii</span>
          <strong>{categories}</strong>
        </article>
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <h3>Notificări stoc</h3>
        </div>
        {notifications.length === 0 ? (
          <p>Nu există notificări noi.</p>
        ) : (
          <div className="admin-notifications">
            {notifications.map(n => (
              <article key={n.id} className={`admin-notification ${n.read ? 'read' : ''}`}>
                <div>
                  <strong>{n.productName}</strong>
                  <p>{n.message}</p>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    className="admin-action-link"
                    onClick={() => handleMarkRead(n.id)}
                  >
                    Marchează citit
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h3>Ultimele produse</h3>
          </div>
          <Link to="/admin/products" className="admin-inline-link">Vezi toate</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Categorie</th>
                <th>Locație</th>
                <th>Preț</th>
                <th>Stoc</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(-6).reverse().map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.warehouseLocation}</td>
                  <td>{product.price} MDL</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
