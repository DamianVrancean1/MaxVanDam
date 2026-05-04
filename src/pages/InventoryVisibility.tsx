import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/InventoryVisibility.css';

type StockStatus = 'in_stock' | 'limited' | 'out';

type DemoStockRow = {
  product: string;
  code: string;
  location: string;
  stock: number;
  status: StockStatus;
};

type DemoAlert = {
  id: number;
  product: string;
  message: string;
};

type DemoActivity = {
  id: number;
  action: 'Intrare' | 'Iesire' | 'Transfer';
  product: string;
  date: string;
  user: string;
};

const statusText: Record<StockStatus, string> = {
  in_stock: 'In stoc',
  limited: 'Stoc limitat',
  out: 'Epuizat',
};

const sidebarItems = [
  'Dashboard',
  'Produse',
  'Vizibilitate inventar',
  'Adauga produs',
  'Profil',
] as const;

const demoStats = [
  { label: 'Stoc total', value: '4,820', meta: 'Unitati active' },
  { label: 'Produse critice', value: '19', meta: 'Necesita verificare' },
  { label: 'Produse epuizate', value: '7', meta: 'Reaprovizionare urgenta' },
  { label: 'Depozite active', value: '3', meta: 'Locatii online' },
] as const;

const demoStockRows: DemoStockRow[] = [
  { product: 'Filtru habitaclu Volkswagen Golf', code: 'SKU-1001', location: 'Z1 / R-03A', stock: 32, status: 'in_stock' },
  { product: 'Filtru combustibil Mercedes C-Class', code: 'SKU-1002', location: 'Z2 / R-11B', stock: 19, status: 'in_stock' },
  { product: 'Filtru ulei Audi A3', code: 'SKU-1003', location: 'Z2 / R-14C', stock: 6, status: 'limited' },
  { product: 'Filtru aer BMW Seria 3', code: 'SKU-1004', location: 'Z3 / R-05A', stock: 83, status: 'in_stock' },
  { product: 'Injectoare Volkswagen Touareg', code: 'SKU-1005', location: 'Z4 / R-18E', stock: 0, status: 'out' },
  { product: 'Turbocompresor Mercedes GLE', code: 'SKU-1006', location: 'Z1 / R-09D', stock: 57, status: 'in_stock' },
  { product: 'Set placute frana BMW X5', code: 'SKU-1007', location: 'Z3 / R-06F', stock: 8, status: 'limited' },
  { product: 'Pompa apa Ford Focus', code: 'SKU-1008', location: 'Z2 / R-15A', stock: 0, status: 'out' },
];

const demoAlerts: DemoAlert[] = [
  { id: 1, product: 'Filtru ulei Audi A3', message: 'Stoc sub prag minim' },
  { id: 2, product: 'Set placute frana BMW X5', message: 'Stoc sub prag minim' },
  { id: 3, product: 'Pompa apa Ford Focus', message: 'Stoc epuizat' },
  { id: 4, product: 'Injectoare Volkswagen Touareg', message: 'Stoc epuizat' },
];

const demoActivity: DemoActivity[] = [
  { id: 1, action: 'Intrare', product: 'Filtru combustibil Mercedes C-Class', date: '29.03.2026 09:12', user: 'operator.a' },
  { id: 2, action: 'Transfer', product: 'Filtru aer BMW Seria 3', date: '29.03.2026 08:40', user: 'coordonator.log' },
  { id: 3, action: 'Iesire', product: 'Filtru ulei Audi A3', date: '29.03.2026 08:05', user: 'operator.b' },
  { id: 4, action: 'Intrare', product: 'Set placute frana BMW X5', date: '29.03.2026 07:31', user: 'operator.a' },
  { id: 5, action: 'Transfer', product: 'Turbocompresor Mercedes GLE', date: '29.03.2026 07:02', user: 'coordonator.log' },
];

const InventoryVisibility = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleExitSite = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`inventory-dashboard ${isDarkTheme ? 'inventory-theme-dark' : 'inventory-theme-light'}`}>
      <aside className="inventory-sidebar">
        <div className="inventory-brand">
          <span className="inventory-brand-badge">MV</span>
          <div>
            <p>Admin Panel</p>
            <span>Demo UI - Management depozit</span>
          </div>
        </div>

        <nav className="inventory-nav" aria-label="Navigatie demo dashboard">
          {sidebarItems.map((item) => (
            <span key={item} className={`inventory-nav-link ${item === 'Vizibilitate inventar' ? 'active' : ''}`}>
              {item}
            </span>
          ))}
        </nav>
      </aside>

      <section className="inventory-main">
        <header className="inventory-topbar">
          <div>
            <div className="inventory-demo-badge-row" aria-label="Demo badge variants preview">
              <span className="inventory-demo-pill inventory-demo-pill-soft" aria-label="Demo showcase badge soft">
                <span className="inventory-demo-icon" aria-hidden="true">UI</span>
                <span className="inventory-demo-label">DEMO / SHOWCASE UI</span>
              </span>
              <span className="inventory-demo-pill inventory-demo-pill-dark" aria-label="Demo showcase badge dark">
                <span className="inventory-demo-icon" aria-hidden="true">UI</span>
                <span className="inventory-demo-label">DARK VARIANT</span>
              </span>
              <button
                type="button"
                className={`inventory-demo-switch ${isDarkTheme ? 'is-on' : ''}`}
                role="switch"
                aria-checked={isDarkTheme}
                aria-label="Comuta tema demo dark/white"
                onClick={() => setIsDarkTheme((previous) => !previous)}
              >
                <span className="inventory-demo-switch-text">{isDarkTheme ? 'Dark theme' : 'White theme'}</span>
                <span className="inventory-demo-switch-track">
                  <span className="inventory-demo-switch-thumb" />
                </span>
              </button>
            </div>
            <h1>Vizibilitate inventar</h1>
            <p>
              Monitorizezi stocul in timp real, vezi rapid piesele critice si iei decizii operationale
              mai rapide pentru depozit.
            </p>
            <p className="inventory-muted">Pagina demonstrativa: exemplu de UI care poate fi oferit clientilor.</p>
          </div>
          <div className="inventory-topbar-actions">
            <button type="button" className="inventory-secondary-btn" onClick={handleExitSite}>Inapoi la site</button>
            <button type="button" className="inventory-primary-btn" aria-label="Demo call to action">
              Vezi produsele
            </button>
          </div>
        </header>

        <section className="inventory-stats-grid" aria-label="Statistici demo inventar">
          {demoStats.map((stat) => (
            <article key={stat.label} className="inventory-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.meta}</small>
            </article>
          ))}
        </section>

        <div className="inventory-content-grid">
          <section className="inventory-panel inventory-panel-large">
            <div className="inventory-panel-head">
              <h2>Stoc in timp real</h2>
              <span className="inventory-muted">Tabel demonstrativ</span>
            </div>

            <div className="inventory-table-wrap">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Produs</th>
                    <th>Cod</th>
                    <th>Locatie</th>
                    <th>Stoc</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoStockRows.map((row) => (
                    <tr key={row.code}>
                      <td>{row.product}</td>
                      <td>{row.code}</td>
                      <td>{row.location}</td>
                      <td>{row.stock}</td>
                      <td>
                        <span className={`stock-badge ${row.status}`}>{statusText[row.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="inventory-panel">
            <div className="inventory-panel-head">
              <h2>Alerte automate</h2>
            </div>
            <div className="inventory-alerts">
              {demoAlerts.map((alert) => (
                <article key={alert.id} className="inventory-alert-item">
                  <span className="alert-dot" aria-hidden="true">!</span>
                  <div>
                    <strong>{alert.product}</strong>
                    <p>{alert.message}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="inventory-panel">
          <div className="inventory-panel-head">
            <h2>Trasabilitate completa</h2>
          </div>

          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Tip actiune</th>
                  <th>Produs</th>
                  <th>Data</th>
                  <th>Utilizator</th>
                </tr>
              </thead>
              <tbody>
                {demoActivity.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`action-badge ${item.action.toLowerCase()}`}>{item.action}</span>
                    </td>
                    <td>{item.product}</td>
                    <td>{item.date}</td>
                    <td>{item.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
};

export default InventoryVisibility;
