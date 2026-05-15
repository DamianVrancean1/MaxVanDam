import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Bell,
  Settings, BookOpen, Search, ChevronRight, MoreHorizontal,
  RefreshCw, Download, ArrowLeft,
} from "lucide-react";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Analytics from "./Analytics";
import Comenzi from "./Comenzi";
import Alerte from "./Alerte";
import Setari from "./Setari";
import Documentatie from "./Documentatie";
import "./demo.css";

/* ── sidebar ── */
const Sidebar = () => (
  <aside className="dm-sidebar">
    <div className="dm-brand">
      <div className="dm-brand-logo">MV</div>
      <div className="dm-brand-name">
        <strong>MaxVanDam</strong>
        <span>Admin Panel</span>
      </div>
    </div>

    <nav className="dm-nav">
      <p className="dm-nav-section">Overview</p>

      <NavLink
        to="/ui-demo/dashboard"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <LayoutDashboard className="dm-nav-icon" />
        Dashboard
      </NavLink>

      <NavLink
        to="/ui-demo/analytics"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <BarChart3 className="dm-nav-icon" />
        Analytics
      </NavLink>

      <p className="dm-nav-section">Management</p>

      <NavLink
        to="/ui-demo/inventory"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <Package className="dm-nav-icon" />
        Inventar
      </NavLink>

      <NavLink
        to="/ui-demo/comenzi"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <ShoppingCart className="dm-nav-icon" />
        Comenzi
      </NavLink>

      <NavLink
        to="/ui-demo/alerte"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <Bell className="dm-nav-icon" />
        Alerte
        <span className="dm-nav-badge">8</span>
      </NavLink>

      <p className="dm-nav-section">System</p>

      <NavLink
        to="/ui-demo/setari"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <Settings className="dm-nav-icon" />
        Setări
      </NavLink>

      <NavLink
        to="/ui-demo/documentatie"
        className={({ isActive }) => `dm-nav-link${isActive ? " active" : ""}`}
      >
        <BookOpen className="dm-nav-icon" />
        Documentație
      </NavLink>
    </nav>

    <div className="dm-sidebar-footer">
      <Link
        to="/"
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0.5rem 0.625rem", marginBottom: "0.5rem",
          borderRadius: "var(--radius-sm)", textDecoration: "none",
          fontSize: 12.5, fontWeight: 500, color: "var(--t-tertiary)",
          border: "1px solid var(--s-border)",
          transition: "background 0.15s, color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = "var(--s-hover)";
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--t-secondary)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--s-border-2)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--t-tertiary)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--s-border)";
        }}
      >
        <ArrowLeft size={13} />
        Înapoi la site
      </Link>
      <div className="dm-user-row">
        <div className="dm-user-avatar">AD</div>
        <div className="dm-user-info">
          <strong>Admin Demo</strong>
          <span>admin@maxvandam.md</span>
        </div>
        <MoreHorizontal className="dm-user-dots" style={{ width: 14, height: 14 }} />
      </div>
    </div>
  </aside>
);

/* ── topbar ── */
const Topbar = ({ title }: { title: string }) => (
  <header className="dm-topbar">
    <div className="dm-breadcrumb">
      <a href="/ui-demo/dashboard">MaxVanDam</a>
      <ChevronRight size={13} className="dm-breadcrumb-sep" />
      <span className="dm-breadcrumb-cur">{title}</span>
    </div>

    <div className="dm-search">
      <Search size={13} style={{ color: "var(--t-tertiary)", flexShrink: 0 }} />
      <input placeholder="Caută produse, SKU..." readOnly />
      <div className="dm-search-kbd">
        <kbd>⌘</kbd><kbd>K</kbd>
      </div>
    </div>

    <div className="dm-topbar-actions">
      <button className="dm-icon-btn" title="Reîncarcă"><RefreshCw size={15} /></button>
      <button className="dm-icon-btn" title="Notificări" style={{ position: "relative" }}>
        <Bell size={15} />
        <span className="dm-notif-dot" />
      </button>
      <button className="dm-icon-btn" title="Export"><Download size={15} /></button>
      <div className="dm-topbar-avatar" title="Profil">AD</div>
    </div>
  </header>
);

/* ── shell ── */
const DemoLayout = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="dm-main-wrap">
    <Topbar title={title} />
    <main className="dm-page">{children}</main>
  </div>
);

/* ── app root ── */
const DemoApp = () => (
  <div className="dm-app">
    <Sidebar />
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"    element={<DemoLayout title="Dashboard">   <Dashboard />    </DemoLayout>} />
      <Route path="inventory"    element={<DemoLayout title="Inventar">    <Inventory />    </DemoLayout>} />
      <Route path="analytics"    element={<DemoLayout title="Analytics">   <Analytics />    </DemoLayout>} />
      <Route path="comenzi"      element={<DemoLayout title="Comenzi">     <Comenzi />      </DemoLayout>} />
      <Route path="alerte"       element={<DemoLayout title="Alerte">      <Alerte />       </DemoLayout>} />
      <Route path="setari"       element={<DemoLayout title="Setări">      <Setari />       </DemoLayout>} />
      <Route path="documentatie" element={<DemoLayout title="Documentație"><Documentatie /> </DemoLayout>} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </div>
);

export default DemoApp;
