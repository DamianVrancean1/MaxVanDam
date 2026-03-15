import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const products = getProducts();
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const categories = new Set(products.map(product => product.category)).size;

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
          <h3>Ultimele produse</h3>
          <Link to="/admin/products" className="admin-inline-link">Vezi toate</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Categorie</th>
                <th>Preț</th>
                <th>Stoc</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(-6).reverse().map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price} RON</td>
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
