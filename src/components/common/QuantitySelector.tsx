import { useState, useRef } from 'react';


interface QuantitySelectorProps {
  value: number;
  onChange?: (newQuantity: number) => void;
  maxQuantity?: number;
  onAddClick?: (quantity: number) => void;
  addButtonLabel?: string;
  showAddButton?: boolean;
}

const QuantitySelector = ({
  value,
  onChange,
  maxQuantity,
  onAddClick,
  addButtonLabel = 'Adaugă în coș',
  showAddButton = false,
}: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(value || 1);
  const addLockRef = useRef(false);

  const handleDecrease = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    onChange?.(newQty);
  };

  const handleIncrease = () => {
    const max = maxQuantity || Infinity;
    const newQty = Math.min(quantity + 1, max);
    setQuantity(newQty);
    onChange?.(newQty);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Dacă e gol, revin la 1
    if (rawValue === '') {
      setQuantity(1);
      onChange?.(1);
      return;
    }

    // Acceptez DOAR cifre (regex strict)
    if (!/^\d+$/.test(rawValue)) {
      return; // Ignor input invalid
    }

    const parsed = parseInt(rawValue, 10);
    const max = maxQuantity || Infinity;

    // Validare: între 1 și max
    if (parsed > 0 && parsed <= max) {
      setQuantity(parsed);
      onChange?.(parsed);
    }
  };

  const handleAddClick = () => {
    // Protecție dublă-execuție
    if (addLockRef.current) {
      return;
    }

    addLockRef.current = true;
    onAddClick?.(quantity);

    // Deblochez după microtask
    queueMicrotask(() => {
      addLockRef.current = false;
    });
  };

  return (
    <div className="quantity-selector">
      <div className="quantity-controls">
        <button
            type="button"
            className="quantity-step-btn"
            onClick={handleDecrease}
            aria-label="Scade cantitatea"
        >
          -
        </button>

        <input
            type="text"
            inputMode="numeric"
            className="quantity-input"
            value={quantity}
            onChange={handleInputChange}
            placeholder="1"
            aria-label="Cantitate - introduce doar cifre"
        />

        <button
            type="button"
            className="quantity-step-btn quantity-step-btn-plus"
            onClick={handleIncrease}
            aria-label="Creste cantitatea"
        >
          +
        </button>
      </div>

      {showAddButton && (
          <button
              type="button"
              className="quantity-add-btn"
              onClick={handleAddClick}
              aria-label={addButtonLabel}
          >
            {addButtonLabel}
          </button>
      )}
    </div>
  );
};

export default QuantitySelector;
