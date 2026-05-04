import { Link, Navigate, useParams } from 'react-router-dom';
import { getPricingPlanById } from '../data/pricingPlans';
import '../styles/Pricing.css';

const PricingContact = () => {
  const { planId } = useParams();
  const plan = getPricingPlanById(planId ?? '');

  if (!plan) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="pricing-page">
      <div className="pricing-bg" aria-hidden />

      <section className="pricing-single-card contact-enter">
        <header className="single-head">
          <p className="single-tag">Contact vanzari</p>
          <h1>{plan.title}</h1>
          <p className="subtitle">Ai ales un singur plan. Contacteaza-ne pentru activare rapida.</p>
        </header>

        <div className="contact-grid">
          <article className="contact-box">
            <h2>Date companie</h2>
            <p><strong>Telefon:</strong> +373 22 123 456</p>
            <p><strong>Email:</strong> sales@maxvandam.md</p>
            <p><strong>Adresa:</strong> Bulevardul Stefan cel Mare si Sfant 134, Chisinau, Moldova</p>
          </article>

          <article className="contact-box map-box">
            <h2>Locatia biroului (Chisinau - centru)</h2>
            <div className="map-wrapper" aria-label="Harta interactiva oficiu Chisinau">
              <iframe
                title="Harta oficiu MaxVanDam"
                src="https://www.openstreetmap.org/export/embed.html?bbox=28.8265%2C47.0190%2C28.8455%2C47.0335&layer=mapnik&marker=47.0263%2C28.8355"
                loading="lazy"
              />
            </div>
          </article>
        </div>

        <div className="single-actions">
          <Link to={`/pricing/${plan.id}/details`} className="learn-more">
            Vezi detalii plan
          </Link>
          <Link to="/pricing" className="learn-more">
            Inapoi la abonamente
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingContact;

