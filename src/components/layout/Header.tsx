import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "../../styles/Header.css";
import logo from "../../img/logo2.png";

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo" aria-label="Acasă">
            <img src={logo} alt="logo" className="logo-img" />
          </Link>

          <nav className="nav">
            <div className="btn btn-pink">
              <Link to="/" className="nav-btn">
                Acasă
              </Link>
            </div>

            <div className="btn btn-pink">
              <Link to="/about" className="nav-btn">
                Despre noi
              </Link>
            </div>

            {user && (
              <div className="btn btn-pink">
                <Link to="/products" className="nav-btn">
                  Produse
                </Link>
              </div>
            )}

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

          <div className="auth-section">
            {user ? (
                <>
                  <div className="btn btn-pink">
                    <Link to="/cart" className="nav-btn user-info">
                      Status:{user.username}
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
      </header>
  );
};

export default Header;