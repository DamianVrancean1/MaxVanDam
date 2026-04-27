import { Link } from 'react-router-dom';

const SubscriptionsPage = () => {
  return (
    <div className="subscriptions-page">
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg,#1b2030,#232a3f)', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Date curate. Stoc precis.</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
          Cu abonamentele Autoparts, ai acces la platforma noastră completă pentru organizarea
          depozitului tău de piese auto. Instrumente moderne, vizibilitate în timp real, alerte
          automate și organizare inteligentă.
        </p>
      </section>

      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <Link to="/" style={{
          display: 'inline-block', marginBottom: '2rem', padding: '10px 20px',
          background: 'linear-gradient(135deg,#d63384,#f06595)', color: '#fff',
          borderRadius: '12px', textDecoration: 'none', fontWeight: 700,
        }}>
          ← Înapoi la Acasă
        </Link>
        <h2 style={{ marginBottom: '1rem' }}>Vrei să scapi de haosul din depozit?</h2>
        <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Cu abonamentele noastre, îți poți structura depozitul eficient, accesând instrumente
          avansate de management al inventarului.
        </p>
        <Link to="/subscriptions-info" style={{
          padding: '12px 28px', background: 'linear-gradient(135deg,#d63384,#f06595)',
          color: '#fff', borderRadius: '14px', textDecoration: 'none', fontWeight: 700,
        }}>
          Vezi abonamentele
        </Link>
      </section>
    </div>
  );
};

export default SubscriptionsPage;
