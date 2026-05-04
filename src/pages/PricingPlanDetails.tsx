import { Link, Navigate, useParams } from 'react-router-dom';
import { getPricingPlanById } from '../data/pricingPlans';
import '../styles/Pricing.css';

const PricingPlanDetails = () => {
  const { planId } = useParams();
  const plan = getPricingPlanById(planId ?? '');

  if (!plan) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="pricing-page">
      <div className="pricing-bg" aria-hidden />

      <section className="pricing-single-card details-enter">
        <header className="single-head">
          <p className="single-tag">Detalii abonament</p>
          <h1>{plan.title}</h1>
          <p className="subtitle">Informatii clare despre acest plan, fara alte optiuni care sa te distraga.</p>
        </header>

        <div className="single-price-block">
          <strong>{plan.monthly} MDL / luna</strong>
          <span>Total: {plan.total.toLocaleString('ro-RO')} MDL</span>
          <span className="first-free">Prima luna este gratuita</span>
        </div>

        <section className="single-features">
          <h2>Beneficii incluse</h2>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <div className="single-actions">
          <Link to={`/pricing/${plan.id}/contact`} className="choose-btn single-btn-link">
            Contact pentru acest plan
          </Link>
          <Link to="/pricing" className="learn-more">
            Inapoi la abonamente
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPlanDetails;

