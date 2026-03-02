import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Header.css";
import logo from "../../img/logo2.png";
  
const Header = () => {
  const { user, logout } = useAuth();

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
              <Link to="/products" className="nav-btn">
                Produse
              </Link>
            </div>

            {user?.role === "admin" && (
                <>
                  <div className="btn btn-pink">
                    <Link to="/admin" className="nav-btn">
                      Admin
                    </Link>
                  </div>

                  <div className="btn btn-pink">
                    <Link to="/add-product" className="nav-btn">
                      Adaugă Produs
                    </Link>
                  </div>
                </>
            )}
          </nav>

          <div className="auth-section">
            {user ? (
                <>
              <span className="user-info">
                {user.username} ({user.role})
              </span>

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