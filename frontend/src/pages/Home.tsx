import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
      <div className="home">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <h1>Vrei să scapi de haosul din depozit? Autoparts e soluția</h1>
            <p>Piese de calitate pentru mașina ta!</p>
            <Link to="/subscriptions-info" className="hero-btn">
              Abonamente
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="container">
            <div className="box">
              <span></span>
              <div className="content">
                <h2>Vizibilitate inventar</h2>
                <p>Vizualizezi disponibilitatea pieselor in timp real.</p>
                <Link to="/inventory-visibility">Read More</Link>
              </div>
            </div>

            <div className="box">
              <span></span>
              <div className="content">
                <h2>Informații Detaliate</h2>
                <p>Specificații complete pentru fiecare piesă.</p>
                <Link to="/informatii-detaliate">Read More</Link>
              </div>
            </div>

            <div className="box">
              <span></span>
              <div className="content">
                <h2>Organizare Inteligentă</h2>
                <p>Găsești rapid orice piesă din depozit.</p>
                <Link to="/organizare-inteligenta">Read More</Link>
              </div>
            </div>

            <div className="box">
              <span></span>
              <div className="content">
                <h2>Abonamente</h2>
                <p>Structurează depozitul tău de piese auto eficient.</p>
                <Link to="/subscriptions-info">Read More</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES (NEW HOVER CARDS) */}
        <section className="categories">
          <h2>Categorii Populare</h2>

          <div className="categories-cards">
            <div className="category-card-3d">
              <div className="face face1">
                <div className="content">
                  <h3>Frâne</h3>
                  <p>Plăcuțe, discuri și componente</p>
                </div>
              </div>
              <div className="face face2">
                <h2>01</h2>
              </div>
            </div>

            <div className="category-card-3d">
              <div className="face face1">
                <div className="content">
                  <h3>Filtre</h3>
                  <p>Ulei, aer, combustibil</p>
                </div>
              </div>
              <div className="face face2">
                <h2>02</h2>
              </div>
            </div>

            <div className="category-card-3d">
              <div className="face face1">
                <div className="content">
                  <h3>Suspensie</h3>
                  <p>Amortizoare și componente</p>
                </div>
              </div>
              <div className="face face2">
                <h2>03</h2>
              </div>
            </div>

            <div className="category-card-3d ">
              <div className="face face1">
                <div className="content">
                  <h3>Motor</h3>
                  <p>Piese și accesorii motor</p>
                </div>
              </div>
              <div className="face face2">
                <h2>04</h2>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Home;