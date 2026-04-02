import { Link } from 'react-router-dom';
import '../styles/SubscriptionsInfo.css';

function SubscriptionsInfo() {
  return (
    <div className="subscriptions-info-page">
      <Link to="/" className="back-btn">← Înapoi la pagina principală</Link>

      <section className="hero">
        <div className="hero-content">
          <h1>Vrei să scapi de haosul din depozit? Autoparts e soluția</h1>
          <p>
            Cu abonamentele Autoparts, ai acces la platforma noastră completă pentru organizarea depozitului tău de piese auto. Beneficiezi de instrumente moderne pentru managementul inventarului, vizibilitate în timp real, alerte automate și organizare inteligentă, astfel încât să poți gestiona eficient stocurile și să crești productivitatea afacerii tale.
          </p>
        </div>
      </section>

      <section className="subscriptions-plans">
        <h2>Abonamente disponibile</h2>

        <div className="plans-container">
          <article className="plan-card">
            <h3>Abonament Lunar</h3>
            <div className="plan-price">2000 MDL / lună</div>
            <ul>
              <li>Acces la vizibilitate inventar în timp real</li>
              <li>Alerte automate pentru stoc scăzut</li>
              <li>Organizare inteligentă a pieselor</li>
              <li>Rapoarte lunare de performanță</li>
            </ul>
            <button className="plan-btn">Alege Abonament Lunar</button>
          </article>

          <article className="plan-card featured">
            <h3>Abonament Anual</h3>
            <div className="plan-price">10000 MDL / an</div>
            <div className="plan-badge">Cel mai popular</div>
            <ul>
              <li>Toate beneficiile abonamentului lunar</li>
              <li>Reducere de 20% față de lunar</li>
              <li>Suport prioritar</li>
              <li>Training gratuit pentru echipă</li>
              <li>Integrare cu sisteme ERP</li>
            </ul>
            <button className="plan-btn">Alege Abonament Anual</button>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Piese Auto</h3>
            <p>Depozitul tău de piese auto de încredere</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: pieseauto@gmail.com</p>
            <p>Telefon: 068 520 577</p>
          </div>
          <div className="footer-section">
            <h3>Program</h3>
            <p>Luni - Vineri: 8:00 - 18:00</p>
            <p>Sâmbătă: 9:00 - 14:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Piese Auto. Toate drepturile rezervate.</p>
          <p>Created by MaxVanDam</p>
        </div>
      </footer>
    </div>
  );
}

export default SubscriptionsInfo;
