import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';
import logo from "../../img/logo1.png";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link liquid-morph-element">Acasă</Link>
          <Link to="/products" className="nav-link liquid-morph-element">Produse</Link>
          
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="nav-link liquid-morph-element">Admin</Link>
              <Link to="/add-product" className="nav-link liquid-morph-element">Adaugă Produs</Link>
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
