import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts } from '../../services/productService';
import { useAxios } from '../../context/AxiosContext';
import type { Product } from '../../types';

const ProductsPage = () => {
  const axios = useAxios();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(axios).then(setProducts);
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Ștergi produsul selectat?');
    if (!confirmed) return;
    await deleteProduct(axios, id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <section className="admin-card">
      <div className="admin-section-header">
        <div>
          <span className="admin-eyebrow">Catalog produse</span>
          <h2>Administrare produse</h2>
        </div>
        <Link to="/admin/products/new" className="admin-primary-link">Produs nou</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume</th>
              <th>Brand</th>
              <th>Categorie</th>
              <th>Locație depozit</th>
              <th>Preț</th>
              <th>Stoc</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand || '-'}</td>
                <td>{product.category}</td>
                <td>{product.warehouseLocation}</td>
                <td>{product.price} MDL</td>
                <td>{product.stock}</td>
                <td>
                  <div className="admin-actions">
                    <Link to={`/admin/products/${product.id}/edit`} className="admin-action-link">
                      Editează
                    </Link>
                    <button
                      type="button"
                      className="admin-action-button danger"
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
    </section>
  );
};

export default ProductsPage;
