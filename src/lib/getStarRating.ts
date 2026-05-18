export function getStarRating(rating: number, maxStars = 5): { filled: string; empty: string } {
  const clamped     = Math.max(0, Math.min(rating, maxStars));
  const filledCount = Math.round(clamped);
  const emptyCount  = maxStars - filledCount;
  return {
    filled: '⭐'.repeat(filledCount),
    empty:  '☆'.repeat(emptyCount),
  };
}
