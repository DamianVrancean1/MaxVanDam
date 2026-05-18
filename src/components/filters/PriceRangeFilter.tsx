interface PriceRangeFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  absoluteMin: number;
  absoluteMax: number;
  onChange: (min: number | null, max: number | null) => void;
}

const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  absoluteMin,
  absoluteMax,
  onChange,
}: PriceRangeFilterProps) => {
  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : Number(e.target.value);
    onChange(val, maxPrice);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : Number(e.target.value);
    onChange(minPrice, val);
  };

  return (
    <div className="flt-price-range">
      <div className="flt-price-row">
        <div className="flt-price-field">
          <label className="flt-price-label">Min</label>
          <div className="flt-price-input-wrap">
            <span className="flt-price-currency">MDL</span>
            <input
              type="number"
              className="flt-price-input"
              placeholder={String(absoluteMin)}
              value={minPrice ?? ''}
              min={0}
              max={absoluteMax}
              onChange={handleMin}
            />
          </div>
        </div>
        <span className="flt-price-sep">—</span>
        <div className="flt-price-field">
          <label className="flt-price-label">Max</label>
          <div className="flt-price-input-wrap">
            <span className="flt-price-currency">MDL</span>
            <input
              type="number"
              className="flt-price-input"
              placeholder={String(absoluteMax)}
              value={maxPrice ?? ''}
              min={0}
              max={999999}
              onChange={handleMax}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
