import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import '../../styles/Card.css';

interface CardProps {
  product: Product;
}

const Card = ({ product }: CardProps) => {
  return (
    <div className="card">
      <img src={product.imageUrl} alt={product.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-category">{product.category}</p>
        <p className="card-description">{product.description}</p>
        <div className="card-footer">
          <span className="card-price">{product.price} RON</span>
          <span className="card-stock">Stoc: {product.stock}</span>
        </div>
        <Link to={`/product/${product.id}`} className="card-link">
          Vezi detalii
        </Link>
      </div>
    </div>
  );
};

export default Card;
