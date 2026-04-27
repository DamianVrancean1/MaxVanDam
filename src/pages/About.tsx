import '../styles/Home.css';

const About = () => {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Despre noi</h1>
      <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        MaxVanDam este un magazin specializat în piese auto de calitate pentru cele mai populare mărci
        europene — BMW, Audi, Mercedes-Benz și Volkswagen. Oferim produse originale și aftermarket
        certificate, cu livrare rapidă și suport tehnic dedicat.
      </p>
      <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        Cu un depozit de peste 4.000 de referințe și o platformă modernă de gestionare a inventarului,
        ne asigurăm că găsești piesa potrivită la cel mai bun preț.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {[
          { label: 'Produse în stoc', value: '4,000+' },
          { label: 'Mărci auto acoperite', value: '4' },
          { label: 'Ani de experiență', value: '12' },
          { label: 'Clienți mulțumiți', value: '8,500+' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#f9fafb', borderRadius: '16px', padding: '1.5rem',
            textAlign: 'center', border: '1px solid #e5e7eb',
          }}>
            <strong style={{ display: 'block', fontSize: '2rem', color: '#d63384' }}>{stat.value}</strong>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
