import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { consumeCartItemsFromStock } from '../services/productService';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();

  const isEmpty = items.length === 0;

  const handleExport = () => {
    if (isEmpty) {
      return;
    }

    consumeCartItemsFromStock(
        items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
    );

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      totalItems,
      totalPrice,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        lineTotal: item.product.price * item.quantity
      }))
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cart-export.json';
    link.click();
    URL.revokeObjectURL(url);

    clearCart();
    window.alert('Comanda a fost exportată și stocurile au fost actualizate.');
  };

  const totalLabel = useMemo(() => totalPrice.toFixed(2), [totalPrice]);

  return (
      <div className="cart-page">
        <h1>Coșul Meu</h1>

        {isEmpty ? (
            <div className="cart-empty">
              <p>Coșul este gol.</p>
              <button
                  type="button"
                  className="simple-view-products-btn"
                  onClick={() => navigate('/products')}
              >
                Vezi Produse
              </button>
            </div>
        ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {items.map(item => (
                    <div className="cart-item" key={item.product.id}>
                      <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />

                      <div className="cart-item-info">
                        <h3>{item.product.name}</h3>
                        <p>{item.product.category}</p>
                        <p className="cart-item-price">{item.product.price} MDL / buc</p>
                      </div>

                      <div className="cart-quantity-controls">
                        <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-line-total">{(item.product.price * item.quantity).toFixed(2)} MDL</div>

                      <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.product.id)}
                      >
                        Șterge
                      </button>
                    </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Sumar</h2>
                <p>
                  Produse în coș: <strong>{totalItems}</strong>
                </p>
                <p>
                  Total final: <strong>{totalLabel} MDL</strong>
                </p>

                <div className="cart-summary-actions">
                  <button
                      type="button"
                      className="simple-export-btn"
                      onClick={handleExport}
                      disabled={isEmpty}
                  >
                    Exportă
                  </button>
                  <button
                      type="button"
                      className="simple-clear-cart-btn"
                      onClick={clearCart}
                  >
                    Golește coșul
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Cart;