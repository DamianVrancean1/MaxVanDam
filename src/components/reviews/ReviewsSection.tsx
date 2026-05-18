import { useMemo, useState } from 'react';
import type { ReviewSort } from '../../services/reviewService';
import {
  getReviewsByProductId,
  getReviewStats,
  sortReviews,
} from '../../services/reviewService';
import RatingBreakdown from './RatingBreakdown';
import ReviewCard from './ReviewCard';

interface ReviewsSectionProps {
  productId: number;
}

const SORT_LABELS: Record<ReviewSort, string> = {
  newest:  'Cele mai recente',
  highest: 'Rating descrescător',
  lowest:  'Rating crescător',
};

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const [sort, setSort] = useState<ReviewSort>('newest');

  const stats   = useMemo(() => getReviewStats(productId),              [productId]);
  const reviews = useMemo(() => getReviewsByProductId(productId),       [productId]);
  const sorted  = useMemo(() => sortReviews(reviews, sort),             [reviews, sort]);

  return (
    <section className="rv-section">
      <div className="rv-section-header">
        <h3 className="rv-section-title">Recenzii clienți</h3>

        {reviews.length > 1 && (
          <select
            className="rv-sort-select"
            value={sort}
            onChange={e => setSort(e.target.value as ReviewSort)}
            aria-label="Sortează recenziile"
          >
            {(Object.keys(SORT_LABELS) as ReviewSort[]).map(key => (
              <option key={key} value={key}>{SORT_LABELS[key]}</option>
            ))}
          </select>
        )}
      </div>

      {stats ? (
        <RatingBreakdown stats={stats} />
      ) : null}

      {sorted.length > 0 ? (
        <ul className="rv-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sorted.map(review => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rv-empty">
          Niciun client nu a lăsat încă o recenzie pentru acest produs.
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
