import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPricingPlanById } from '../data/pricingPlans';
import { subscriptionService } from '../services/subscriptionService';
import '../styles/Checkout.css';

const CheckoutPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const plan = planId ? getPricingPlanById(planId) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!plan) {
    return (
      <div className="checkout-page">
        <div className="checkout-error">
          <h2>Abonament nu a fost găsit</h2>
          <button onClick={() => navigate('/pricing')} className="checkout-btn">
            Înapoi la Abonamente
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'Prenumele este obligatoriu';
    if (!formData.lastName.trim()) errors.lastName = 'Numele este obligatoriu';
    if (!formData.email.trim()) errors.email = 'Email-ul este obligatoriu';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email invalid';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Telefonul este obligatoriu';
    if (!formData.companyName.trim()) errors.companyName = 'Denumirea companiei este obligatorie';
    if (!formData.cardNumber.trim()) errors.cardNumber = 'Numărul cardului este obligatoriu';
    if (formData.cardNumber.replace(/\s/g, '').length < 13) errors.cardNumber = 'Număr card invalid';
    if (!formData.cardHolderName.trim()) errors.cardHolderName = 'Numele titularului este obligatoriu';
    if (!formData.expiryMonth) errors.expiryMonth = 'Luna expirării este obligatorie';
    if (!formData.expiryYear) errors.expiryYear = 'Anul expirării este obligatoriu';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await subscriptionService.createSubscription({
        planId: plan.id,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        companyName: formData.companyName.trim(),
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolderName: formData.cardHolderName.trim(),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        amount: plan.total,
      });

      setSuccess(true);
      setTimeout(() => navigate('/pricing'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la procesarea plății');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <h2>✓ Abonament creat cu succes!</h2>
          <p>Mulțumim pentru achiziție. Redirectare în 3 secunde...</p>
          <button onClick={() => navigate('/pricing')} className="checkout-btn">
            Înapoi la Abonamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-summary">
          <h2>{plan.title}</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Preț lunar:</span>
              <strong>{plan.monthly} MDL</strong>
            </div>
            <div className="summary-row">
              <span>Durata:</span>
              <strong>{plan.period}</strong>
            </div>
            <div className="summary-row">
              <span>Total:</span>
              <strong className="total-price">{plan.total} MDL</strong>
            </div>
            <p className="summary-note">*Prima lună este gratuită</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Detalii de plată</h3>

          {error && <div className="checkout-error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Prenume *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ana"
              />
              {formErrors.firstName && <span className="form-error">{formErrors.firstName}</span>}
            </div>
            <div className="form-group">
              <label>Nume *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Popescu"
              />
              {formErrors.lastName && <span className="form-error">{formErrors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ana@example.com"
              />
              {formErrors.email && <span className="form-error">{formErrors.email}</span>}
            </div>
            <div className="form-group">
              <label>Telefon *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+373 69 000 000"
              />
              {formErrors.phoneNumber && <span className="form-error">{formErrors.phoneNumber}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Denumirea companiei / SRL *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="SC MaxVanDam SRL"
            />
            {formErrors.companyName && <span className="form-error">{formErrors.companyName}</span>}
          </div>

          <div className="form-divider">
            <span>Informații card</span>
          </div>

          <div className="form-group">
            <label>Numărul cardului *</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                value = value.replace(/(\d{4})/g, '$1 ').trim();
                setFormData((prev) => ({ ...prev, cardNumber: value }));
              }}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
            {formErrors.cardNumber && <span className="form-error">{formErrors.cardNumber}</span>}
          </div>

          <div className="form-group">
            <label>Numele titularului cardului *</label>
            <input
              type="text"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleChange}
              placeholder="ANA POPESCU"
              style={{ textTransform: 'uppercase' }}
            />
            {formErrors.cardHolderName && <span className="form-error">{formErrors.cardHolderName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Luna expirării *</label>
              <select name="expiryMonth" value={formData.expiryMonth} onChange={handleChange}>
                <option value="">Selectează luna</option>
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              {formErrors.expiryMonth && <span className="form-error">{formErrors.expiryMonth}</span>}
            </div>
            <div className="form-group">
              <label>Anul expirării *</label>
              <select name="expiryYear" value={formData.expiryYear} onChange={handleChange}>
                <option value="">Selectează anul</option>
                {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formErrors.expiryYear && <span className="form-error">{formErrors.expiryYear}</span>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="checkout-btn checkout-submit">
            {loading ? 'Se procesează...' : `Plătește ${plan.total} MDL`}
          </button>

          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="checkout-btn checkout-cancel"
          >
            Anulează
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

