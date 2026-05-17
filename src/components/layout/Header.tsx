import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import ThemeToggle from "../common/ThemeToggle";
import "../../styles/Header.css";
import logo from "../../img/logo2.png";
  
const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
  };
  
  return (
      <header className="header ix-header">
        <div className="header-container ix-header-container">

          {/* Logo zone */}
          <div className="ix-header-logo-zone">
            <Link to="/" className="logo" aria-label="Acasă">
              <img src={logo} alt="logo" className="logo-img" />
            </Link>
          </div>

          {/* Navigation zone */}
          <nav className="nav ix-nav-zone">
            <div className="btn btn-pink">
              <Link to="/" className="nav-btn">
                Acasă
              </Link>
            </div>

            {user && (
              <div className="btn btn-pink">
                <Link to="/products" className="nav-btn">
                  Produse
                </Link>
              </div>
            )}

            <div className="btn btn-pink">
              <Link to="/about" className="nav-btn">
                Despre noi
              </Link>
            </div>

            <div className="btn btn-pink">
              <Link to="/pricing" className="nav-btn">
                Abonamente
              </Link>
            </div>

            {user?.role === "admin" && (
                <>
                  <div className="btn btn-pink">
                    <Link to="/admin/dashboard" className="nav-btn">
                      Admin
                    </Link>
                  </div>

                  <div className="btn btn-pink">
                    <Link to="/admin/products/new" className="nav-btn">
                      Adaugă Produs
                    </Link>
                  </div>
                </>
            )}
          </nav>

          {/* Auth + system status zone */}
          <div className="auth-section ix-header-auth-zone">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Live system indicator */}
            <div className="ix-system-status" aria-label="Sistem activ">
              <span className="ix-status-dot" />
              <span>LIVE</span>
            </div>

            {user ? (
                <>
                  <div className="btn btn-pink">
                    <Link to="/cart" className="nav-btn user-info">
                      {user.username} ({user.role})
                      <span className="cart-badge">{totalItems}</span>
                    </Link>
                  </div>

                  <div className="btn btn-pink">
                    <button onClick={handleLogout} className="nav-btn nav-btn-button" type="button">
                      Deconectare
                    </button>
                  </div>
                </>
            ) : (
                <div className="btn btn-pink">
                  <Link to="/login" className="nav-btn">
                    Autentificare
                  </Link>
                </div>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="ix-header-accent" aria-hidden="true" />
      </header>
  );
};

export default Header;
