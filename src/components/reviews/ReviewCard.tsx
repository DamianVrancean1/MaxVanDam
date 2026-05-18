import { useState } from 'react';
import type { Review } from '../../types';
import { formatReviewDate } from '../../services/reviewService';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  featured?: boolean;
}

const BODY_LIMIT = 220;

const ReviewCard = ({ review, featured = false }: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const isLong   = review.body.length > BODY_LIMIT;
  const bodyText = isLong && !expanded
    ? review.body.slice(0, BODY_LIMIT).trimEnd() + '…'
    : review.body;

  return (
    <article className={`rv-card${featured ? ' rv-card--featured' : ''}`}>
      <header className="rv-card-header">
        <div className="rv-card-meta">
          <span className="rv-author">{review.authorName}</span>
          {review.verified && (
            <span className="rv-verified" title="Cumpărare verificată">✓ Verificat</span>
          )}
          {featured && (
            <span className="rv-badge-helpful">👍 Cea mai utilă</span>
          )}
        </div>
        <time className="rv-date" dateTime={review.date}>
          {formatReviewDate(review.date)}
        </time>
      </header>

      <div className="rv-card-rating">
        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="rv-title">{review.title}</p>

      <p className="rv-body">
        {bodyText}
        {isLong && (
          <button
            className="rv-expand-btn"
            onClick={() => setExpanded(e => !e)}
            type="button"
          >
            {expanded ? ' Arată mai puțin' : ' Citește tot'}
          </button>
        )}
      </p>

      <footer className="rv-card-footer">
        <span className="rv-helpful">
          {review.helpful > 0
            ? `${review.helpful} ${review.helpful === 1 ? 'persoană a găsit util' : 'persoane au găsit util'}`
            : 'Fii primul care votează'}
        </span>
      </footer>
    </article>
  );
};

export default ReviewCard;
