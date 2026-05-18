import { mockReviews } from '../data/reviewData';
import type { Review, ReviewStats } from '../types';

export const getReviewsByProductId = (productId: number): Review[] =>
  mockReviews.filter(r => r.productId === productId);

export const getReviewStats = (productId: number): ReviewStats | null => {
  const reviews = getReviewsByProductId(productId);
  if (reviews.length === 0) return null;

  const total = reviews.length;
  const sum   = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg   = sum / total;

  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => { dist[r.rating as 1 | 2 | 3 | 4 | 5]++; });

  const recommended = reviews.filter(r => r.rating >= 4).length;

  return {
    average:             Math.round(avg * 10) / 10,
    total,
    distribution:        dist,
    recommendedPercent:  Math.round((recommended / total) * 100),
  };
};

export type ReviewSort = 'newest' | 'highest' | 'lowest';

export const sortReviews = (reviews: Review[], sort: ReviewSort): Review[] =>
  [...reviews].sort((a, b) => {
    if (sort === 'newest')  return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

export const formatReviewDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
};
