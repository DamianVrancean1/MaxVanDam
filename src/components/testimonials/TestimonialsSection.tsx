import { useMemo } from 'react';
import {
  getTestimonials,
  getTestimonialStats,
  sortTestimonials,
} from '../../services/testimonialService';
import StarRating from '../reviews/StarRating';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = useMemo(
    () => sortTestimonials(getTestimonials(), 'featured'),
    [],
  );
  const stats = useMemo(() => getTestimonialStats(), []);

  if (testimonials.length === 0) return null;

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

      <div className="tst-grid">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
