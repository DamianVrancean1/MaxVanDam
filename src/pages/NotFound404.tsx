import {Link} from 'react-router-dom';
import '../styles/ErrorPage.css';

const NotFound404 = () => {
    return (
        <div className="error-page">
            <div className="error-card">
                <p className="error-code">404</p>
                <h1>Pagină Negăsită</h1>
                <p>Pagina pe care o cauți nu există sau a fost mutată.</p>

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

export default NotFound404;

