import { Link } from 'react-router-dom';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';
import '../styles/About.css';

const handleTagClick = (e: React.MouseEvent<HTMLSpanElement>) => {
  // Simple click handler for future interactions if needed
  const span = e.currentTarget;
  console.log('Tag clicked:', span.textContent);
};

const handleStatClick = (e: React.MouseEvent<HTMLElement>) => {
  // Simple click handler for stats articles
  const article = e.currentTarget;
  const strong = article.querySelector('strong');
  if (strong) {
    console.log('Stat clicked:', strong.textContent);
  }
};

const challengeCards = [
  {
    title: 'Excel în depozit',
    points: [
      'Erori umane frecvente la introducerea datelor.',
      'Lipsa sincronizării între angajați și schimburi.',
      'Gestionare dificilă când volumul de produse crește.'
    ]
  },
  {
    title: 'Sisteme vechi precum 1C',
    points: [
      'Interfață învechită, greu de învățat și folosit rapid.',
      'Acces online limitat și lucru dificil de la distanță.',
      'Lipsa unei experiențe moderne, centralizate și flexibile.'
    ]
  }
];

const solutionFeatures = [
  'Adăugare, editare și ștergere produse în câteva click-uri.',
  'Vizibilitate clară pe stocuri, praguri critice și mișcări.',
  'Roluri și permisiuni clare: admin / user.',
  'Rapoarte și statistici pentru decizii operaționale mai bune.',
  'Sistem bun pentru firme mici, medii și mari.'
];

const howItWorks = [
  {
    step: '01',
    title: 'Configurăm depozitul',
    text: 'Definești structura locației, categoriile și regulile de lucru pentru echipă.'
  },
  {
    step: '02',
    title: 'Importăm stocul',
    text: 'Migrăm datele existente și pornești cu un inventar clar, fără tabele haotice.'
  },
  {
    step: '03',
    title: 'Lucrați simultan',
    text: 'Mai mulți utilizatori operează în același timp, cu actualizări instant în platformă.'
  },
  {
    step: '04',
    title: 'Optimizezi continuu',
    text: 'Monitorizezi KPI, alerte și rapoarte pentru a reduce pierderile de timp.'
  }
];

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero about-fade-in">
        <div className="about-hero-content">
          <span className="about-badge">Digitalizare depozite auto | Din 2024</span>
          <h1>MaxVanDam: Infrastructura digitală a succesului tău logistic.</h1>
          <p>
            O platformă online modernă pentru managementul stocurilor, logistică și inventar, construită să înlocuiască Excel și sistemele mai vechi. Controlezi operațiunile în timp real, de oriunde, în siguranță.
          </p>
          <div className="about-hero-actions">
            <Link to="/pricing" className="about-btn about-btn-primary">
              Solicită demo
            </Link>
            <Link to="/inventory-visibility" className="about-btn about-btn-secondary">
              Vezi platforma
            </Link>
          </div>
        </div>
        <div className="about-hero-media">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
            alt="Depozit modern cu rafturi de piese auto si flux logistic digital"
            loading="lazy"
          />
        </div>
      </section>

      <section className="about-stats about-fade-in about-fade-delay-1" aria-label="Indicatori platforma">
        <article onClick={handleStatClick}>
          <strong>5x</strong>
          <span>Mai rapid decât sistemele clasice în Excel</span>
        </article>
        <article onClick={handleStatClick}>
          <strong>24/7</strong>
          <span>Acces online de pe PC, tabletă și telefon</span>
        </article>
        <article onClick={handleStatClick}>
          <strong>99.9%</strong>
          <span>Disponibilitate pentru operațiuni continue</span>
        </article>
        <article onClick={handleStatClick}>
          <strong>100%</strong>
          <span>Date centralizate cu backup automat</span>
        </article>
      </section>

      <section className="about-section about-fade-in about-fade-delay-2">
        <div className="about-section-head">
          <h2>Cine suntem?</h2>
          <p>
            MaxVanDam este o companie tech lansată în 2024, creată pentru a rezolva probleme reale observate în depozitele auto. Am pornit ca o inițiativă tehnică orientată spre digitalizare, 
            organizare și optimizare, iar astăzi dezvoltăm o platformă cloud gândită pentru eficiență operațională, claritate și control total de oriunde asupra stocului actual.
          </p>
          <p>
            Suntem specializați în software și optimizare de procese, concentrată
            pe rezultate concrete: mai puține erori, mai multă viteză și decizii mai bune pentru business-ul tău.
          </p>
        </div>
      </section>

      <section className="about-section about-fade-in about-fade-delay-2">
        <div className="about-section-head">
          <h2>Problema din industrie</h2>
          <p>
            Multe depozite auto încă depind de metode vechi: evidență pe hârtie, 1C sau Excel (unele dintre cele mai populare alegeri).
            Rezultatul: stocuri neclare, pierderi de timp, coordonare dificilă între echipe și decizii luate pe date incomplete.
          </p>
        </div>
        <div className="about-grid-2">
          {challengeCards.map((card) => (
            <article key={card.title} className="about-card about-card-danger">
              <h3>{card.title}</h3>
              <ul>
                {card.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-fade-in about-fade-delay-3">
        <div className="about-section-head">
          <h2>Solutia MaxVanDam</h2>
          <p>
            O aplicație complet online, modernă și intuitivă, care elimină munca pe 
            hârtie și aduce toate operațiunile într-un singur sistem centralizat, în timp real.
          </p>
        </div>
        <div className="about-solution-layout">
          <article className="about-card about-card-accent">
            <h3>Ce poți face în platformă?</h3>
            <ul>
              {solutionFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
          <article className="about-image-card">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
              alt="Ecran cu dashboard de analiza si management operational"
              loading="lazy"
            />
          </article>
        </div>
      </section>

      <section className="about-section about-fade-in about-fade-delay-3">
        <div className="about-section-head">
          <h2>Avantaje competitive</h2>
        </div>
        <div className="about-adv-grid">
          <article className="about-card">
            <h3>Mai rapid decât Excel</h3>
            <p>Automatizezi procese repetitive și reduci erorile manuale.</p>
          </article>
          <article className="about-card">
            <h3>Mai simplu decât 1C</h3>
            <p>Interfață modernă, ușor de folosit de orice membru al echipei.</p>
          </article>
          <article className="about-card">
            <h3>Online și securizat</h3>
            <p>Acces complet din orice locație, cu autentificare și autorizare pe roluri.</p>
          </article>
          <article className="about-card">
            <h3>Backup automat</h3>
            <p>Date protejate și recuperabile, fără riscul de a pierde informații importante.</p>
          </article>
        </div>
      </section>

      <section className="about-section about-fade-in about-fade-delay-4">
        <div className="about-section-head">
          <h2>Cum funcționează?</h2>
          <p>Implementare simplă, adoptare rapida, impact imediat.</p>
        </div>
        <div className="about-steps-grid">
          {howItWorks.map((item) => (
            <article key={item.step} className="about-step-card">
              <span className="about-step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-fade-in about-fade-delay-4">
        <div className="about-section-head">
          <h2>Pentru cine este platforma?</h2>
          <p>
            MaxVanDam este potrivită pentru depozite auto, magazine de piese, distribuitori și companii care 
            gestionează volume mari de stocuri și au nevoie de control operațional clar.
          </p>
        </div>
        <div className="about-tags">
          <span onClick={handleTagClick}>Depozite auto</span>
          <span onClick={handleTagClick}>Magazine de piese auto</span>
          <span onClick={handleTagClick}>Distribuitori regionali</span>
          <span onClick={handleTagClick}>IMM-uri</span>
          <span onClick={handleTagClick}>Companii mari</span>
        </div>
      </section>

      <section className="about-section about-tech about-fade-in about-fade-delay-5">
        <div>
          <h2>Tehnologie și securitate</h2>
          <p>
            Datele sunt salvate pe servere securizate, cu backup automat și protecție împotriva pierderilor. 
            Sistemul de autentificare și autorizare (user/admin) controlează accesul pe bază de roluri, iar modificările sunt trasabile pentru transparență completă.
          </p>
          <ul>
            <li>Infrastructură cloud </li>
            <li>Actualizări in timp real pentru toți utilizatorii</li>
            <li>Lucru simultan pentru echipe multiple</li>
            <li>Protecție ridicată pentru datele operaționale</li>
          </ul>
        </div>
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80"
          alt="Servere moderne simbolizand securitatea datelor in cloud"
          loading="lazy"
        />
      </section>

      <TestimonialsSection />

      <section className="about-cta about-fade-in about-fade-delay-5">
        <h2>Pregătit să renunți la Excel și să treci la un depozit inteligent și ușor de utilizat?</h2>
        <p>
          MaxVanDam funcționează pe bază de abonament și poate fi testat prin trial/demo. Contactează-ne și 
          îți arătăm cum poți implementa rapid un flux modern de gestionare a stocurilor.
        </p>
        <div className="about-hero-actions">
          <Link to="/pricing" className="about-btn about-btn-primary">
            Alege un abonament
          </Link>
          <Link to="/pricing/1-an/contact" className="about-btn about-btn-secondary">
            Contacteaza echipa
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
