import { Link } from 'react-router-dom';
import '../styles/Home.css';
import hero1 from "../img/hero1.jpg";


const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Date curate. Stoc precis.</h1>
          <p>Piese de calitate pentru mașina ta!</p>
          <Link to="/products" className="hero-btn">
            Vezi Produsele
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="box">
            <span></span>
            <div className="content">
              <h2>Vizibilitate inventar</h2>
              <p>Vizualizezi disponibilitatea pieselor în timp real.</p>
              <a href="#">Read More</a>
            </div>
          </div>
          <div className="box">
            <span></span>
            <div className="content">
              <h2>Informații Detaliate</h2>
              <p>Specificații complete pentru fiecare piesă.</p>
              <a href="#">Read More</a>
            </div>
          </div>
          <div className="box">
            <span></span>
            <div className="content">
              <h2>Organizare Inteligentă</h2>
              <p>Găsești rapid orice piesă din depozit.</p>
              <a href="#">Read More</a>
            </div>
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
