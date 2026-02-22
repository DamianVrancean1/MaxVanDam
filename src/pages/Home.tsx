import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bine ai venit la Piese Auto</h1>
          <p>Găsește piese de calitate pentru mașina ta</p>
          <Link to="/products" className="hero-btn">
            Vezi Produsele
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">✓</div>
            <h3>Calitate Garantată</h3>
            <p>Toate piesele sunt testate și certificate</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Livrare Rapidă</h3>
            <p>Livrăm în 24-48 de ore</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>Prețuri Competitive</h3>
            <p>Cele mai bune oferte de pe piață</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Categorii Populare</h2>
        <div className="categories-grid">
          <div className="category-card">
            <h3>Frane</h3>
            <p>Placuțe, discuri și componente</p>
          </div>
          <div className="category-card">
            <h3>Filtre</h3>
            <p>Ulei, aer, combustibil</p>
          </div>
          <div className="category-card">
            <h3>Suspensie</h3>
            <p>Amortizoare și componente</p>
          </div>
          <div className="category-card">
            <h3>Motor</h3>
            <p>Piese și accesorii motor</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
