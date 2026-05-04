import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardPage from './layouts/DashboardPage';
import ProductsPage from './layouts/ProductsPage';
import ProductFormPage from './layouts/ProductFormPage';
import ProfilePage from './layouts/ProfilePage';
import '../styles/AdminTheme.css';

const AdminShell = ({
  children,
  onExitSite,
}: {
  children: React.ReactNode;
  onExitSite: () => void;
}) => {
  const { pathname } = useLocation();
  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/products', label: 'Produse' },
    { to: '/admin/products/new', label: 'Adaugă produs' },
    { to: '/admin/profile', label: 'Profil' }
  ];

  return (
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-badge">MV</span>
            <div>
              <p>MaxVanDam</p>
              <span>Admin Panel</span>
            </div>
          </div>
          <nav className="admin-nav">
            {navItems.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `admin-nav-link ${isActive || pathname.startsWith(item.to + '/') ? 'active' : ''}`
                    }
                    end={item.to === '/admin/products'}
                >
                  {item.label}
                </NavLink>
            ))}
          </nav>
        </aside>

        <div className="admin-content-wrap">
          <header className="admin-topbar">
            <div>
              <h1>Administrare site</h1>
              <p>Interfață nouă pentru gestionarea produselor și a contului de admin.</p>
            </div>
            <NavLink to="/" className="admin-back-link" onClick={onExitSite}>Înapoi la site</NavLink>
          </header>

          <main className="admin-main">{children}</main>
        </div>
      </div>
  );
};

const AdminApp = () => {
  const { isAdmin, logout } = useAuth();

  const handleExitSite = () => {
    logout();
  };

  if (!isAdmin()) {
    return <Navigate to="/403" replace />;
  }

  return (
      <AdminShell onExitSite={handleExitSite}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage mode="create" />} />
          <Route path="products/:id/edit" element={<ProductFormPage mode="edit" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminShell>
  );
};

export default AdminApp;
