import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/mockData';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState('');

  const parsedId = Number(id);
  const product = !id || Number.isNaN(parsedId) ? null : getProductById(parsedId) || null;

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    addToCart(product);
    setFeedback('Produsul a fost adăugat în coș.');
  };

  if (!product) {
    return (
      <div className="product-detail">
        <p>Produsul nu a fost găsit.</p>
        <Button onClick={() => navigate('/products')}>
          Înapoi la Produse
        </Button>
      </div>
    );
  }

  return (
    <div className="product-detail ">
      <Button onClick={() => navigate('/products')} variant="secondary">
        ← Înapoi la Produse
      </Button>

      <div className="detail-container">
        <div className="detail-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="detail-price-stock">
            <span className="detail-price">{product.price} MDL</span>
            <span className={`detail-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `În stoc: ${product.stock} buc` : 'Stoc epuizat'}
            </span>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="simple-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Adaugă în coș
            </button>
            {feedback && <span className="cart-feedback">{feedback}</span>}
          </div>

          <div className="detail-description">
            <h3>Descriere</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-specs">
            <h3>Specificații</h3>
            <ul>
              <li><strong>ID Produs:</strong> {product.id}</li>
              <li><strong>Categorie:</strong> {product.category}</li>
              <li><strong>Preț:</strong> {product.price} MDL</li>
              <li><strong>Disponibilitate:</strong> {product.stock > 0 ? 'În stoc' : 'Indisponibil'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
