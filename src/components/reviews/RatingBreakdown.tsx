import type { ReviewStats } from '../../types';
import StarRating from './StarRating';

interface RatingBreakdownProps {
  stats: ReviewStats;
}

const RatingBreakdown = ({ stats }: RatingBreakdownProps) => {
  const rows = ([5, 4, 3, 2, 1] as const).map(star => ({
    star,
    count: stats.distribution[star],
    pct:   stats.total > 0
      ? Math.round((stats.distribution[star] / stats.total) * 100)
      : 0,
  }));

  return (
    <div className="rv-breakdown">
      <div className="rv-breakdown-summary">
        <span className="rv-avg-number">{stats.average.toFixed(1)}</span>
        <StarRating rating={stats.average} size="md" />
        <span className="rv-avg-count">{stats.total} {stats.total === 1 ? 'recenzie' : 'recenzii'}</span>
        <span className="rv-recommend">{stats.recommendedPercent}% recomandă</span>
      </div>

      <div className="rv-breakdown-bars">
        {rows.map(({ star, count, pct }) => (
          <div key={star} className="rv-bar-row">
            <span className="rv-bar-label">{star}★</span>
            <div className="rv-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="rv-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="rv-bar-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBreakdown;
