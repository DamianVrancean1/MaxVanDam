import { Link } from 'react-router-dom';
import '../styles/ErrorPage.css';

const Unauthorized401 = () => {
  return (
    <div className="error-page">
      <div className="error-card">
        <p className="error-code">401</p>
        <h1>Neautorizat</h1>
        <p>Trebuie să te autentifici pentru a accesa această pagină.</p>

        <div className="error-actions">
          <Link to="/login" className="error-btn primary">
            Mergi la Login
          </Link>
          <Link to="/" className="error-btn secondary">
            Înapoi Acasă
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized401;

