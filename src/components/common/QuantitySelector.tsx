type Props = {
  value: number;
  onChange: (value: number) => void;
  onAddClick?: (value: number) => void;
  addButtonLabel?: string;
  showAddButton?: boolean;
  min?: number;
  max?: number;
};

const QuantitySelector = ({
  value,
  onChange,
  onAddClick,
  addButtonLabel = 'Adaugă',
  showAddButton = false,
  min = 1,
  max = 99,
}: Props) => {
  const decrement = () => { if (value > min) onChange(value - 1); };
  const increment = () => { if (value < max) onChange(value + 1); };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        style={{
          width: '36px', height: '36px', borderRadius: '8px',
          border: '1px solid rgba(15,23,42,0.15)', background: '#fff',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          fontWeight: 700, fontSize: '1.1rem',
        }}
      >
        −
      </button>
      <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        style={{
          width: '36px', height: '36px', borderRadius: '8px',
          border: '1px solid rgba(15,23,42,0.15)', background: '#fff',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          fontWeight: 700, fontSize: '1.1rem',
        }}
      >
        +
      </button>
      {showAddButton && onAddClick && (
        <button
          type="button"
          onClick={() => onAddClick(value)}
          style={{
            marginLeft: '8px', padding: '8px 18px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg,#d63384,#f06595)', color: '#fff',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          {addButtonLabel}
        </button>
      )}
    </div>
  );
};

export default QuantitySelector;
