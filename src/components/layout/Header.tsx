import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🚗 Piese Auto</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Acasă</Link>
          <Link to="/products" className="nav-link">Produse</Link>
          
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <Link to="/add-product" className="nav-link">Adaugă Produs</Link>
            </>
          )}
        </nav>

        <div className="auth-section">
          {user ? (
            <>
              <span className="user-info">
                {user.username} ({user.role})
              </span>
              <button onClick={handleLogout} className="liquid-morph-element logout-btn">
                <span>Deconectare</span>
              </button>
            </>
          ) : (
              <Link to="/login" className="liquid-morph-element login-link">
                <span>Autentificare</span>
              </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
