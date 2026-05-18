import type { ProductFilters } from '../../types/filters';
import { hasActiveFilters } from '../../types/filters';

interface ActiveFiltersBarProps {
  filters: ProductFilters;
  onRemove: (key: keyof ProductFilters, value?: string) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

const ActiveFiltersBar = ({
  filters,
  onRemove,
  onReset,
  totalCount,
  filteredCount,
}: ActiveFiltersBarProps) => {
  if (!hasActiveFilters(filters)) return null;

  return (
    <div className="flt-active-bar">
      <div className="flt-active-chips">
        {filters.search && (
          <Chip label={`"${filters.search}"`} onRemove={() => onRemove('search')} />
        )}
        {filters.category !== 'Toate' && (
          <Chip label={filters.category} onRemove={() => onRemove('category')} />
        )}
        {filters.minPrice !== null && (
          <Chip label={`Min ${filters.minPrice} MDL`} onRemove={() => onRemove('minPrice')} />
        )}
        {filters.maxPrice !== null && (
          <Chip label={`Max ${filters.maxPrice} MDL`} onRemove={() => onRemove('maxPrice')} />
        )}
        {filters.brands.map(b => (
          <Chip key={b} label={b} onRemove={() => onRemove('brands', b)} />
        ))}
        {filters.inStockOnly && (
          <Chip label="În stoc" onRemove={() => onRemove('inStockOnly')} />
        )}
        {filters.compatibleBrand && (
          <Chip
            label={`Compatibil: ${filters.compatibleBrand}${filters.compatibleModel ? ' ' + filters.compatibleModel : ''}`}
            onRemove={() => { onRemove('compatibleBrand'); onRemove('compatibleModel'); }}
          />
        )}
      </div>

      <div className="flt-active-meta">
        <span className="flt-active-count">{filteredCount} / {totalCount}</span>
        <button type="button" className="flt-active-reset" onClick={onReset}>
          Șterge filtrele
        </button>
      </div>
    </div>
  );
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flt-chip">
    {label}
    <button type="button" className="flt-chip-remove" onClick={onRemove} aria-label={`Elimină filtrul ${label}`}>
      ×
    </button>
  </span>
);

export default ActiveFiltersBar;
