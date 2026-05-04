import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import QuantitySelector from './QuantitySelector';
import '../../styles/Card.css';

interface CardProps {
  product: Product;
}

const Card = ({ product }: CardProps) => {
  const { user } = useAuth();
  const { items, addToCart } = useCart();
  const isUserLoggedIn = user?.role === 'user';

  const currentInCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const maxAddable = Math.max(product.stock - currentInCart, 0);
  const canAdd = maxAddable > 0;

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    setSelectedQuantity((previous) => {
      const upperBound = Math.max(maxAddable, 1);
      return Math.max(1, Math.min(previous, upperBound));
    });
  }, [maxAddable]);

  const handleAddToCart = (qty: number) => {
    if (!canAdd) {
      return;
    }
    addToCart(product, qty);
  };

  return (
    <div className="card">
      <img src={product.imageUrl} alt={product.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-category">{product.category}</p>
        <p className="card-description">{product.description}</p>
        <div className="card-footer">
          <span className="card-price">{product.price} MDL</span>
          <span className="card-stock">Stoc: {product.stock}</span>
        </div>

        <div className="card-actions">
          <Link to={`/product/${product.id}`} className="card-link">
            Vezi detalii
          </Link>

          {isUserLoggedIn ? (
            <QuantitySelector
                value={selectedQuantity}
                onChange={setSelectedQuantity}
                maxQuantity={maxAddable}
                onAddClick={handleAddToCart}
                addButtonLabel="🛒 Adauga in cos"
                showAddButton={canAdd}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Card;
