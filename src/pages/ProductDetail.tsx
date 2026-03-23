import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [quantity, setQuantity] = useState(1);

  const parsedId = Number(id);
  const product = !id || Number.isNaN(parsedId) ? null : getProductById(parsedId) || null;
  const maxQuantity = product?.stock ?? 1;

  const canAdd = useMemo(() => Boolean(product && product.stock > 0), [product]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    if (!user) {
      const shouldLogin = window.confirm(
          'Pentru a adăuga produsul în coș trebuie să fii autentificat. Vrei să mergi la login?'
      );
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    addToCart(product, quantity);
    setFeedback(`Produsul a fost adăugat în coș (${quantity} buc).`);
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
        <div className="btn btn-pink product-back-btn">
          <button
              type="button"
              className="nav-btn nav-btn-button"
              onClick={() => navigate('/products')}
          >
            ← Înapoi la Produse
          </button>
        </div>

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
              <div className="quantity-row">
                <label htmlFor="quantity">Cantitate</label>
                <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      setQuantity(Math.max(1, Math.min(next, maxQuantity)));
                    }}
                    disabled={!canAdd}
                />
                <Link to={`/product/${product.id}`} className="simple-view-details-btn">
                  Vezi detalii
                </Link>
              </div>

              <button
                  type="button"
                  className="simple-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={!canAdd}
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
                <li><strong>Marcă:</strong> {product.brand || 'Necunoscut'}</li>
                <li><strong>Model:</strong> {product.model || 'Necunoscut'}</li>
                <li><strong>Categorie:</strong> {product.category}</li>
                <li><strong>Preț:</strong> {product.price} MDL</li>
                <li><strong>Disponibilitate:</strong> {product.stock > 0 ? 'În stoc' : 'Stoc epuizat'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;