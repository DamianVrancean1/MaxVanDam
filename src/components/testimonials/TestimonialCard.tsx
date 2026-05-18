import type { Testimonial } from '../../types';
import StarRating from '../reviews/StarRating';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

const TestimonialCard = ({ testimonial, index = 0 }: TestimonialCardProps) => (
  <article
    className={`tst-card${testimonial.featured ? ' tst-card--featured' : ''}`}
    style={{ animationDelay: `${index * 0.07}s` }}
  >
    {testimonial.featured && (
      <span className="tst-featured-badge">★ Evidențiat</span>
    )}

    <span className="tst-quote" aria-hidden="true">"</span>

    <h4 className={`tst-title${testimonial.featured ? ' tst-title--padded' : ''}`}>
      {testimonial.title}
    </h4>

    <p className="tst-body">{testimonial.body}</p>

    <footer className="tst-footer">
      <StarRating rating={testimonial.rating} size="sm" />
      <div className="tst-author">
        <span className="tst-author-name">{testimonial.authorName}</span>
        <span className="tst-author-meta">
          {testimonial.role}
          <span className="tst-author-sep" aria-hidden="true">·</span>
          {testimonial.company}
        </span>
        {testimonial.location && (
          <span className="tst-location">{testimonial.location}</span>
        )}
      </div>
    </footer>
  </article>
);

export default TestimonialCard;
