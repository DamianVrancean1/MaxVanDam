interface StockToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const StockToggle = ({ checked, onChange }: StockToggleProps) => (
  <label className={`flt-toggle${checked ? ' flt-toggle--on' : ''}`}>
    <span className="flt-toggle-track" aria-hidden="true">
      <span className="flt-toggle-thumb" />
    </span>
    <input
      type="checkbox"
      className="flt-toggle-input"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      aria-label="Doar produse în stoc"
    />
    <span className="flt-toggle-text">Doar în stoc</span>
  </label>
);

export default StockToggle;
