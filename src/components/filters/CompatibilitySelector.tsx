import { useMemo } from 'react';
import { VEHICLE_BRANDS } from '../../types/filters';

interface CompatibilitySelectorProps {
  compatibleBrand: string;
  compatibleModel: string;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
}

const CompatibilitySelector = ({
  compatibleBrand,
  compatibleModel,
  onBrandChange,
  onModelChange,
}: CompatibilitySelectorProps) => {
  const models = useMemo(() => {
    const entry = VEHICLE_BRANDS.find(b => b.brand === compatibleBrand);
    return entry ? entry.models : [];
  }, [compatibleBrand]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onBrandChange(e.target.value);
    onModelChange('');
  };

  return (
    <div className="flt-compat">
      <select
        className="flt-select"
        value={compatibleBrand}
        onChange={handleBrandChange}
        aria-label="Marcă vehicul"
      >
        <option value="">Toate mărcile</option>
        {VEHICLE_BRANDS.map(b => (
          <option key={b.brand} value={b.brand}>{b.brand}</option>
        ))}
      </select>

      <select
        className="flt-select"
        value={compatibleModel}
        onChange={e => onModelChange(e.target.value)}
        disabled={!compatibleBrand}
        aria-label="Model vehicul"
      >
        <option value="">Toate modelele</option>
        {models.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
};

export default CompatibilitySelector;
