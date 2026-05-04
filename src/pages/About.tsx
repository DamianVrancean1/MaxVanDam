import '../styles/Home.css';

const About = () => {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem', color: '#ffffff' }}>Despre noi</h1>
      <p style={{ color: 'white', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        MaxVanDam este o aplicatie care ajuta depozitele sa fie mai organizate si sa lucreze mai usor.
        Este facuta pentru firmele care au multe piese auto si lucreaza cu marci precum BMW, Audi, Mercedes-Benz si Volkswagen. Cu aceasta aplicatie poti sa vezi rapid ce produse ai in depozit,
        ce s-a vandut si ce mai trebuie comandat. Totul este mai simplu si mai clar, fara sa pierzi timp
        sau sa faci greseli.
            MaxVanDam te ajuta sa tii evidenta stocului, sa organizezi produsele si sa
        lucrezi mai eficient in fiecare zi. Este usor de folosit si potrivit pentru orice depozit care
        vrea sa fie mai bine pus la punct.
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
