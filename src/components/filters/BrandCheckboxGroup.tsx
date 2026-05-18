import { PART_BRANDS } from '../../types/filters';

interface BrandCheckboxGroupProps {
  selected: string[];
  onToggle: (brand: string) => void;
}

const BrandCheckboxGroup = ({ selected, onToggle }: BrandCheckboxGroupProps) => (
  <div className="flt-checkbox-group">
    {PART_BRANDS.map(brand => {
      const checked = selected.includes(brand);
      return (
        <label key={brand} className={`flt-checkbox-row${checked ? ' flt-checkbox-row--checked' : ''}`}>
          <span className={`flt-checkbox-box${checked ? ' flt-checkbox-box--checked' : ''}`} aria-hidden="true">
            {checked && (
              <svg viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <input
            type="checkbox"
            className="flt-checkbox-input"
            checked={checked}
            onChange={() => onToggle(brand)}
            aria-label={brand}
          />
          <span className="flt-checkbox-label">{brand}</span>
        </label>
      );
    })}
  </div>
);

export default BrandCheckboxGroup;
