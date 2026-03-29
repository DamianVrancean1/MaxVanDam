import { Link } from "react-router-dom";

function SubscriptionsPage() {
  return (
    <div className="subscriptions-page">
      <section className="subscriptions-hero-main">
        <div className="subscriptions-hero-main-content">
          <h1>Date curate. Stoc precis.</h1>
          <p>
            Cu abonamentele Autoparts, ai acces la platforma noastră completă pentru organizarea depozitului tău de piese auto. Beneficiezi de instrumente moderne pentru managementul inventarului, vizibilitate în timp real, alerte automate și organizare inteligentă, astfel încât să poți gestiona eficient stocurile și să crești productivitatea afacerii tale.
          </p>
        </div>
      </section>

      <section className="subscriptions-hero">
        <div className="subscriptions-hero-content">
          <Link to="/home" className="back-btn">← Înapoi la Acasă</Link>
          <h1>Vrei să scapi de haosul din depozit? Autoparts e soluția</h1>
          <p>
            Cu abonamentele noastre, poți să îți structurezi depozitul de piese auto în mod eficient,
            accesând instrumente avansate de management al inventarului și organizare inteligentă.
          </p>
          <Link to="/home" className="skip-btn">Sari peste deocamdata</Link>
        </div>
      </section>

      {/* ...existing code for subscriptions content... */}
    </div>
  );
}

export default SubscriptionsPage;
