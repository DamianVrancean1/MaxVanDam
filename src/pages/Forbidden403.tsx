import {Link} from 'react-router-dom';
import '../styles/ErrorPage.css';

const Forbidden403 = () => {
    return (
        <div className="error-page">
            <div className="error-card">
                <p className="error-code">403</p>
                <h1>Acces Interzis</h1>
                <p>Nu ai permisiunea necesară pentru a accesa această resursă.</p>

                <div className="error-actions">
                    <Link to="/" className="error-btn primary">
                        Înapoi Acasă
                    </Link>
                    <Link to="/products" className="error-btn secondary">
                        Vezi Produse
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Forbidden403;

