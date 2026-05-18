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

const STARS = [5, 4, 3, 2, 1] as const;

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const [sort,       setSort]       = useState<ReviewSort>('newest');
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const stats   = useMemo(() => getReviewStats(productId),        [productId]);
  const reviews = useMemo(() => getReviewsByProductId(productId), [productId]);

  // Review with the most helpful votes — shown as "featured" when no filter active
  const mostHelpful = useMemo(() => {
    if (reviews.length < 3) return null;
    return reviews.reduce((best, r) => r.helpful > best.helpful ? r : best, reviews[0]);
  }, [reviews]);

  // Count per star for filter buttons
  const starCounts = useMemo(() => {
    const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { map[r.rating]++; });
    return map;
  }, [reviews]);

  const sorted = useMemo(() => {
    const base = starFilter ? reviews.filter(r => r.rating === starFilter) : reviews;
    return sortReviews(base, sort);
  }, [reviews, sort, starFilter]);

  // IDs already shown in featured to exclude from the main list
  const featuredId = !starFilter && mostHelpful ? mostHelpful.id : null;
  const mainList   = sorted.filter(r => r.id !== featuredId);

  const filterLabel = starFilter
    ? `${sorted.length} ${sorted.length === 1 ? 'recenzie' : 'recenzii'} cu ${starFilter}★`
    : '';

  return (
    <section className="rv-section">

      {/* Header — title + sort */}
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

      {/* Rating breakdown */}
      {stats && <RatingBreakdown stats={stats} />}

      {/* Star filters */}
      {reviews.length > 2 && (
        <div className="rv-filters" role="group" aria-label="Filtrează după număr de stele">
          <button
            className={`rv-filter-btn${starFilter === null ? ' rv-filter-btn--active' : ''}`}
            onClick={() => setStarFilter(null)}
          >
            Toate
            <span className="rv-filter-count">{reviews.length}</span>
          </button>

          {STARS.map(star => (
            <button
              key={star}
              className={`rv-filter-btn${starFilter === star ? ' rv-filter-btn--active' : ''}`}
              onClick={() => setStarFilter(s => s === star ? null : star)}
              disabled={starCounts[star] === 0}
            >
              {star}★
              <span className="rv-filter-count">{starCounts[star]}</span>
            </button>
          ))}
        </div>
      )}

      {filterLabel && (
        <p className="rv-filter-label">{filterLabel}</p>
      )}

      {/* Most helpful — shown only when no star filter is active */}
      {!starFilter && mostHelpful && (
        <div className="rv-featured-wrap">
          <ReviewCard review={mostHelpful} featured />
        </div>
      )}

      {/* Main list */}
      {mainList.length > 0 ? (
        <ul className="rv-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {mainList.map((review, i) => (
            <li key={review.id} style={{ animationDelay: `${i * 0.05}s` }} className="rv-list-item">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : (
        !starFilter && (
          <div className="rv-empty">
            Niciun client nu a lăsat încă o recenzie pentru acest produs.
          </div>
        )
      )}

      {/* No results for the selected filter */}
      {starFilter && sorted.length === 0 && (
        <div className="rv-empty">
          Nu există recenzii cu {starFilter}★ pentru acest produs.
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
