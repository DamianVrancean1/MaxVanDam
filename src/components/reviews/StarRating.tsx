interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

// Layered-star technique: two rows of ★ stacked — bottom empty (grey),
// top filled (amber) clipped by a % width based on the rating.
const StarRating = ({ rating, size = 'md', showValue = false }: StarRatingProps) => {
  const pct = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <span className={`rv-stars rv-stars-${size}`} aria-label={`${rating} din 5 stele`}>
      <span className="rv-stars-empty" aria-hidden="true">★★★★★</span>
      <span className="rv-stars-filled" style={{ width: `${pct}%` }} aria-hidden="true">★★★★★</span>
      {showValue && <span className="rv-stars-value">{rating.toFixed(1)}</span>}
    </span>
  );
};

export default StarRating;
