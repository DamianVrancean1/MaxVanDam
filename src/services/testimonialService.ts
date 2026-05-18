import { mockTestimonials } from '../data/testimonialData';
import type { Testimonial, TestimonialStats } from '../types';

export const getTestimonials = (): Testimonial[] => mockTestimonials;

export type TestimonialSort = 'newest' | 'highest' | 'featured';

export const sortTestimonials = (
  testimonials: Testimonial[],
  sort: TestimonialSort,
): Testimonial[] =>
  [...testimonials].sort((a, b) => {
    if (sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sort === 'highest')  return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

export const getTestimonialStats = (): TestimonialStats | null => {
  const t = mockTestimonials;
  if (t.length === 0) return null;
  const avg         = t.reduce((s, r) => s + r.rating, 0) / t.length;
  const recommended = t.filter(r => r.rating >= 4).length;
  return {
    average:            Math.round(avg * 10) / 10,
    total:              t.length,
    recommendedPercent: Math.round((recommended / t.length) * 100),
  };
};

export const formatTestimonialDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
};
