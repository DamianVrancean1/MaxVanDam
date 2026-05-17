import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, PackagePlus, Users, CreditCard,
  User, Search, ChevronRight,
  RefreshCw, Bell, Download, ArrowLeft, LogOut, ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardPage from './layouts/DashboardPage';
import ProductsPage from './layouts/ProductsPage';
import ProductFormPage from './layouts/ProductFormPage';
import ProfilePage from './layouts/ProfilePage';
import UsersPage from './layouts/UsersPage';
import AdminSubscriptionsPage from '../pages/AdminSubscriptionsPage';
import AdminComenzi from './pages/AdminComenzi';
import './admin.css';

/* ── helpers ── */
const initials = (username: string) =>
  username.slice(0, 2).toUpperCase();

/* ── sidebar ── */
const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const { user } = useAuth();

  return (
    <aside className="dm-sidebar">
      {/* Brand */}
      <div className="dm-brand">
        <div className="dm-brand-logo">MV</div>
        <div className="dm-brand-name">
          <strong>MaxVanDam</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="dm-nav">
        <p className="dm-nav-section">Overview</p>

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <LayoutDashboard className="dm-nav-icon" />
          Dashboard
        </NavLink>

        <p className="dm-nav-section">Catalog</p>

        <NavLink
          to="/admin/products"
          end
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <Package className="dm-nav-icon" />
          Produse
        </NavLink>

        <NavLink
          to="/admin/products/new"
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <PackagePlus className="dm-nav-icon" />
          Adaugă produs
        </NavLink>

        <p className="dm-nav-section">Administrare</p>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <Users className="dm-nav-icon" />
          Utilizatori
        </NavLink>

        <NavLink
          to="/admin/subscriptions"
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <CreditCard className="dm-nav-icon" />
          Abonamente
        </NavLink>

        <NavLink
          to="/admin/comenzi"
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <ShoppingCart className="dm-nav-icon" />
          Comenzi
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) => `dm-nav-link${isActive ? ' active' : ''}`}
        >
          <User className="dm-nav-icon" />
          Profil
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="dm-sidebar-footer">
        {/* Back to site */}
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.5rem 0.625rem', marginBottom: '0.5rem',
            borderRadius: 'var(--radius-sm)', textDecoration: 'none',
            fontSize: 12.5, fontWeight: 500, color: 'var(--t-tertiary)',
            border: '1px solid var(--s-border)',
            transition: 'background 0.15s, color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = 'var(--s-hover)';
            el.style.color = 'var(--t-secondary)';
            el.style.borderColor = 'var(--s-border-2)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = 'transparent';
            el.style.color = 'var(--t-tertiary)';
            el.style.borderColor = 'var(--s-border)';
          }}
        >
          <ArrowLeft size={13} />
          Înapoi la site
        </Link>

        {/* User row */}
        <div className="dm-user-row">
          <div className="dm-user-avatar">
            {user ? initials(user.username) : 'AD'}
          </div>
          <div className="dm-user-info">
            <strong>{user?.username ?? 'Admin'}</strong>
            <span>{user?.email ?? ''}</span>
          </div>
          <button
            title="Deconectare"
            onClick={onLogout}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--t-tertiary)', padding: 2, lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-red)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--t-tertiary)'; }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

/* ── topbar ── */
const Topbar = ({ title }: { title: string }) => {
  const { user } = useAuth();

  return (
    <header className="dm-topbar">
      <div className="dm-breadcrumb">
        <span style={{ color: 'var(--t-tertiary)', fontSize: 13 }}>MaxVanDam</span>
        <ChevronRight size={13} className="dm-breadcrumb-sep" />
        <span className="dm-breadcrumb-cur">{title}</span>
      </div>

      <div className="dm-search">
        <Search size={13} style={{ color: 'var(--t-tertiary)', flexShrink: 0 }} />
        <input placeholder="Caută produse, utilizatori..." readOnly />
        <div className="dm-search-kbd">
          <kbd>⌘</kbd><kbd>K</kbd>
        </div>
      </div>

      <div className="dm-topbar-actions">
        <button className="dm-icon-btn" title="Reîncarcă" onClick={() => window.location.reload()}>
          <RefreshCw size={15} />
        </button>
        <button className="dm-icon-btn" title="Notificări" style={{ position: 'relative' }}>
          <Bell size={15} />
          <span className="dm-notif-dot" />
        </button>
        <button className="dm-icon-btn" title="Export">
          <Download size={15} />
        </button>
        <div className="dm-topbar-avatar" title={user?.username ?? 'Admin'}>
          {user ? initials(user.username) : 'AD'}
        </div>
      </div>
    </header>
  );
};

/* ── page title map ── */
const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':    'Dashboard',
  '/admin/products':     'Produse',
  '/admin/products/new': 'Adaugă produs',
  '/admin/users':        'Utilizatori',
  '/admin/subscriptions':'Abonamente',
  '/admin/comenzi':      'Comenzi',
  '/admin/profile':      'Profil',
};

const getTitle = (pathname: string): string => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes('/edit'))  return 'Editează produs';
  return 'Admin';
};

/* ── shell ── */
const AdminShell = ({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) => {
  const { pathname } = useLocation();

  return (
    <div className="dm-app admin-app">
      <Sidebar onLogout={onLogout} />
      <div className="dm-main-wrap">
        <Topbar title={getTitle(pathname)} />
        <main className="dm-page">{children}</main>
      </div>
    </div>
  );
};

/* ── app root ── */
const AdminApp = () => {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin()) {
    return <Navigate to="/403" replace />;
  }

  return (
    <AdminShell onLogout={logout}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"      element={<DashboardPage />} />
        <Route path="products"       element={<ProductsPage />} />
        <Route path="products/new"   element={<ProductFormPage mode="create" />} />
        <Route path="products/:id/edit" element={<ProductFormPage mode="edit" />} />
        <Route path="users"          element={<UsersPage />} />
        <Route path="subscriptions"  element={<AdminSubscriptionsPage />} />
        <Route path="comenzi"        element={<AdminComenzi />} />
        <Route path="profile"        element={<ProfilePage />} />
        <Route path="*"              element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminShell>
  );
};

export default AdminApp;
