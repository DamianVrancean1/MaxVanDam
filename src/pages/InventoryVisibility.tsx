import { Link } from 'react-router-dom';
import '../styles/InventoryVisibility.css';

const InventoryVisibility = () => {
  return (
    <div className="inventory-visibility-page">
      <section className="inventory-hero">
        <div className="inventory-hero-content">
          <p className="inventory-eyebrow">Management depozit</p>
          <h1>Vizibilitate inventar</h1>
          <p>
            Monitorizezi stocul in timp real, vezi rapid piesele critice si iei decizii operationale
            mai rapide pentru depozit.
          </p>
          <Link to="/products" className="inventory-cta">
            Vezi produsele
          </Link>
        </div>
      </section>

      <section className="inventory-features">
        <article className="inventory-card">
          <h2>Stoc in timp real</h2>
          <p>Disponibilitate actualizata continuu pentru fiecare piesa, pe fiecare locatie.</p>
        </article>

        <article className="inventory-card">
          <h2>Alerte automate</h2>
          <p>
            Esti notificat cand o piesa ajunge sub pragul minim, astfel incat sa eviti lipsa de stoc.
          </p>
        </article>

        <article className="inventory-card">
          <h2>Trasabilitate completa</h2>
          <p>
            Urmaresti intrari, iesiri si transferuri intre depozite pentru control operational clar.
          </p>
        </article>
      </section>
    </div>
  );
};

export default InventoryVisibility;

