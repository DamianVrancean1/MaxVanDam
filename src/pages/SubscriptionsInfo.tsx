import { useState } from 'react';
import { Link } from 'react-router-dom';
import QuantitySelector from '../components/common/QuantitySelector';
import '../styles/SubscriptionsInfo.css';

const SubscriptionsInfo = () => {
  const [quantity, setQuantity] = useState(1);

  const handleAddSubscription = (qty: number) => {
    alert(`Ați adăugat ${qty} abonament(e) în coș.`);
  };

  return (
    <div className="subscriptions-info-page">
      <Link to="/" className="sub-back-btn">← Înapoi la pagina principală</Link>

      <section className="sub-hero">
        <div className="sub-hero-content">
          <h1>Vrei să scapi de haosul din depozit? Autoparts e soluția</h1>
          <p>
            Cu abonamentele Autoparts, ai acces la platforma noastră completă pentru organizarea
            depozitului tău de piese auto. Beneficiezi de instrumente moderne pentru managementul
            inventarului, vizibilitate în timp real, alerte automate și organizare inteligentă.
          </p>
        </div>
      </section>

      <section className="sub-plans">
        <h2>Abonamente disponibile</h2>

        <div className="sub-quantity-row">
          <label>Selectează cantitate:</label>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            onAddClick={handleAddSubscription}
            addButtonLabel="Adaugă în coș"
            showAddButton={true}
          />
        </div>

        <div className="sub-plans-grid">
          <article className="sub-plan-card">
            <h3>Abonament Lunar</h3>
            <div className="sub-plan-price">2000 MDL / lună</div>
            <ul>
              <li>Acces la vizibilitate inventar în timp real</li>
              <li>Alerte automate pentru stoc scăzut</li>
              <li>Organizare inteligentă a pieselor</li>
              <li>Rapoarte lunare de performanță</li>
            </ul>
            <button className="sub-plan-btn" type="button">
              Alege {quantity} Abonament Lunar
            </button>
          </article>

          <article className="sub-plan-card sub-plan-featured">
            <h3>Abonament Anual</h3>
            <div className="sub-plan-price">10000 MDL / an</div>
            <div className="sub-plan-badge">Cel mai popular</div>
            <ul>
              <li>Toate beneficiile abonamentului lunar</li>
              <li>Reducere de 20% față de lunar</li>
              <li>Suport prioritar</li>
              <li>Training gratuit pentru echipă</li>
              <li>Integrare cu sisteme ERP</li>
            </ul>
            <button className="sub-plan-btn" type="button">
              Alege {quantity} Abonament Anual
            </button>
          </article>
        </div>
      </section>

      <footer className="sub-footer">
        <div className="sub-footer-content">
          <div className="sub-footer-section">
            <h3>Piese Auto</h3>
            <p>Depozitul tău de piese auto de încredere</p>
          </div>
          <div className="sub-footer-section">
            <h3>Contact</h3>
            <p>Email: pieseauto@gmail.com</p>
            <p>Telefon: 068 520 577</p>
          </div>
          <div className="sub-footer-section">
            <h3>Program</h3>
            <p>Luni - Vineri: 8:00 - 18:00</p>
            <p>Sâmbătă: 9:00 - 14:00</p>
          </div>
        </div>
        <div className="sub-footer-bottom">
          <p>© 2026 Piese Auto. Toate drepturile rezervate.</p>
          <p>Created by MaxVanDam</p>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionsInfo;
