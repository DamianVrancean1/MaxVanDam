import { Link } from 'react-router-dom';
import '../styles/About.css';

export default function About() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                   
                    <h1>Auto Parts</h1>
                    <p>
                        Auto Parts e o aplicație dedicată gestionării eficiente a stocului pentru un
                        depozit auto modern. Scopul nostru este să oferim o evidență clară a
                        pieselor, categoriilor, furnizorilor și mișcărilor de stoc.
                    </p>

                    <div className="about-actions">
                        <Link to="/login" className="about-btn primary">
                            Autentificare
                        </Link>
                        <Link to="/" className="about-btn secondary">
                            Înapoi la pagina principală
                        </Link>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="about-card">
                    <h2>Cine suntem</h2>
                    <p>
                        Auto Parts este o soluție web pentru administrarea unui depozit auto,
                        creată pentru a simplifica activitatea angajaților și a administratorilor.
                        Prin această aplicație, utilizatorii pot urmări rapid piesele disponibile,
                        stocurile reduse și istoricul mișcărilor din depozit.
                    </p>
                </div>

                <div className="about-card">
                    <h2>Ce oferim</h2>
                    <ul>
                        <li>gestionarea pieselor auto din stoc</li>
                        <li>organizarea produselor pe categorii</li>
                        <li>urmărirea intrărilor și ieșirilor de produse</li>
                        <li>monitorizarea stocurilor reduse</li>
                        <li>administrarea utilizatorilor și a rolurilor</li>
                    </ul>
                </div>

                <div className="about-card">
                    <h2>Misiunea noastră</h2>
                    <p>
                        Dorim să transformăm procesul de gestionare a stocului într-unul clar,
                        rapid și sigur. Aplicația ajută la reducerea erorilor, la o organizare
                        mai bună a depozitului și la luarea unor decizii rapide pe baza datelor
                        disponibile în timp real.
                    </p>
                </div>
            </section>

            <section className="about-stats">
                <div className="stat-box">
                    <h3>1000+</h3>
                    <p>Piese gestionate</p>
                </div>
                <div className="stat-box">
                    <h3>50+</h3>
                    <p>Categorii active</p>
                </div>
                <div className="stat-box">
                    <h3>24/7</h3>
                    <p>Acces la sistem</p>
                </div>
            </section>
        </div>
    );
}