import { useMemo, useState } from 'react';
import {
  getTestimonials,
  getTestimonialStats,
  sortTestimonials,
} from '../../services/testimonialService';
import StarRating from '../reviews/StarRating';
import TestimonialCard from './TestimonialCard';

const INITIAL_VISIBLE = 6;

const TestimonialsSection = () => {
  const [showAll, setShowAll] = useState(false);

  const all      = useMemo(() => sortTestimonials(getTestimonials(), 'featured'), []);
  const stats    = useMemo(() => getTestimonialStats(), []);
  const featured = useMemo(() => all.filter(t => t.featured), [all]);
  const regular  = useMemo(() => all.filter(t => !t.featured), [all]);

  const visibleRegular = showAll ? regular : regular.slice(0, INITIAL_VISIBLE);
  const hiddenCount    = regular.length - INITIAL_VISIBLE;

  if (all.length === 0) return null;

  return (
    <section className="about-section tst-section about-fade-in about-fade-delay-4">
      <div className="about-section-head">
        <h2>Ce spun clienții noștri</h2>
        <p>
          Companii care au renunțat la Excel și 1C în favoarea MaxVanDam —
          experiențe reale, în cuvintele lor.
        </p>
      </div>

      {stats && (
        <div className="tst-stats-bar">
          <div className="tst-stat">
            <StarRating rating={stats.average} size="sm" showValue />
            <span className="tst-stat-label">rating mediu</span>
          </div>
          <div className="tst-stat-divider" aria-hidden="true" />
          <div className="tst-stat">
            <span className="tst-stat-value">{stats.total}</span>
            <span className="tst-stat-label">testimoniale verificate</span>
          </div>
          <div className="tst-stat-divider" aria-hidden="true" />
          <div className="tst-stat">
            <span className="tst-stat-value">{stats.recommendedPercent}%</span>
            <span className="tst-stat-label">recomandă MaxVanDam</span>
          </div>
        </div>
      )}

      {featured.length > 0 && (
        <>
          <div className="tst-row-label">
            <span>Experiențe evidențiate</span>
          </div>
          <div className="tst-grid tst-grid--featured">
            {featured.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </>
      )}

      {regular.length > 0 && (
        <>
          <div className="tst-row-label">
            <span>Toate testimonialele</span>
          </div>
          <div className="tst-grid">
            {visibleRegular.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </>
      )}

      {!showAll && hiddenCount > 0 && (
        <div className="tst-show-more">
          <button
            type="button"
            className="tst-show-more-btn"
            onClick={() => setShowAll(true)}
          >
            Citește mai multe testimoniale
            <span className="tst-show-more-count">+{hiddenCount}</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
