import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SmartOrganizationShowcase.css';

type PickItem = {
  id: number;
  sku: string;
  product: string;
  location: string;
  zone: string;
  priority: 'high' | 'medium' | 'low';
};

type TaskItem = {
  id: number;
  operator: string;
  action: 'Picking' | 'Reorganizare' | 'Verificare';
  eta: string;
  status: 'In progres' | 'In asteptare' | 'Finalizat';
};

const navItems = ['Dashboard', 'Produse', 'Organizare Inteligenta', 'Adauga produs', 'Profil'] as const;

const zoneUtilization = [
  { zone: 'Z1', load: 82, label: 'Fast moving' },
  { zone: 'Z2', load: 67, label: 'General stock' },
  { zone: 'Z3', load: 48, label: 'Bulk items' },
  { zone: 'Z4', load: 91, label: 'High traffic' },
  { zone: 'Z5', load: 36, label: 'Reserve' },
  { zone: 'Z6', load: 54, label: 'Returns' },
] as const;

const pickList: PickItem[] = [
  { id: 1, sku: 'SKU-3012', product: 'Filtru aer BMW Seria 3', location: 'Z1 / R-04A', zone: 'Z1', priority: 'high' },
  { id: 2, sku: 'SKU-1881', product: 'Set placute frana Audi A4', location: 'Z4 / R-12D', zone: 'Z4', priority: 'high' },
  { id: 3, sku: 'SKU-4420', product: 'Filtru ulei Mercedes C-Class', location: 'Z2 / R-08B', zone: 'Z2', priority: 'medium' },
  { id: 4, sku: 'SKU-5511', product: 'Pompa apa Ford Focus', location: 'Z3 / R-02E', zone: 'Z3', priority: 'low' },
  { id: 5, sku: 'SKU-9970', product: 'Senzor ABS Volkswagen Passat', location: 'Z5 / R-10A', zone: 'Z5', priority: 'medium' },
];

const taskQueue: TaskItem[] = [
  { id: 1, operator: 'operator.a', action: 'Picking', eta: '12 min', status: 'In progres' },
  { id: 2, operator: 'operator.b', action: 'Reorganizare', eta: '18 min', status: 'In asteptare' },
  { id: 3, operator: 'operator.c', action: 'Verificare', eta: '7 min', status: 'Finalizat' },
  { id: 4, operator: 'operator.d', action: 'Picking', eta: '9 min', status: 'In progres' },
];

const alerts = [
  'Produs SKU-1881 in zona aglomerata (Z4). Recomandare: relocare in Z2.',
  'Raf Z1/R-04A depaseste 85% ocupare.',
  'Ruta picking poate fi optimizata cu 14% prin reordonare.',
] as const;

const activityLog = [
  { id: 1, event: 'Mutare produs SKU-3012 din Z4 in Z1', user: 'coordonator.log', time: '10:22' },
  { id: 2, event: 'Scanare locatie Z2/R-08B validata', user: 'operator.b', time: '09:58' },
  { id: 3, event: 'Task picking #P-892 finalizat', user: 'operator.a', time: '09:31' },
  { id: 4, event: 'Avertizare congestie activata in Z4', user: 'system', time: '09:10' },
] as const;

const SmartOrganizationShowcase = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPickList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pickList;

    return pickList.filter((item) => {
      return (
        item.sku.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className={`smart-dashboard ${isDarkTheme ? 'smart-theme-dark' : 'smart-theme-light'}`}>
      <aside className="smart-sidebar">
        <div className="smart-brand">
          <span className="smart-brand-badge">MV</span>
          <div>
            <p>Admin Panel</p>
            <span>Demo UI - Organizare Inteligenta</span>
          </div>
        </div>

        <nav className="smart-nav" aria-label="Navigatie demo organizare inteligenta">
          {navItems.map((item) => (
            <span key={item} className={`smart-nav-link ${item === 'Organizare Inteligenta' ? 'active' : ''}`}>
              {item}
            </span>
          ))}
        </nav>
      </aside>

      <section className="smart-main">
        <header className="smart-topbar">
          <div>
            <span className="smart-demo-pill">DEMO / SHOWCASE UI</span>
            <h1>Organizare Inteligenta</h1>
            <p>
              Gasesti rapid orice piesa din depozit prin localizare clara, task-uri prioritizate
              si trasee de picking optimizate.
            </p>
          </div>

          <div className="smart-topbar-actions">
            <Link to="/" className="smart-secondary-btn">Inapoi la site</Link>
            <button
              type="button"
              className={`smart-switch ${isDarkTheme ? 'is-on' : ''}`}
              role="switch"
              aria-checked={isDarkTheme}
              aria-label="Comuta tema demo"
              onClick={() => setIsDarkTheme((prev) => !prev)}
            >
              <span>{isDarkTheme ? 'Dark' : 'Light'}</span>
              <span className="smart-switch-track">
                <span className="smart-switch-thumb" />
              </span>
            </button>
            <button type="button" className="smart-primary-btn">Optimizeaza traseu</button>
          </div>
        </header>

        <section className="smart-kpi-grid">
          <article className="smart-card smart-kpi-card">
            <span>Timp mediu gasire piesa</span>
            <strong>38s</strong>
            <small>-21% fata de luna trecuta</small>
          </article>
          <article className="smart-card smart-kpi-card">
            <span>Precizie localizare</span>
            <strong>98.4%</strong>
            <small>Validare prin scanare raft</small>
          </article>
          <article className="smart-card smart-kpi-card">
            <span>Task-uri finalizate azi</span>
            <strong>127</strong>
            <small>4 operatori activi</small>
          </article>
          <article className="smart-card smart-kpi-card">
            <span>Zone cu congestie</span>
            <strong>2</strong>
            <small>Z1 si Z4 necesita echilibrare</small>
          </article>
        </section>

        <div className="smart-grid-two">
          <section className="smart-card">
            <div className="smart-card-head">
              <h2>Smart Search</h2>
              <span className="smart-muted">SKU / denumire / locatie</span>
            </div>
            <input
              className="smart-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Ex: SKU-3012, filtru aer, Z1 / R-04A"
              aria-label="Cauta rapid piese in depozit"
            />

            <div className="smart-table-wrap">
              <table className="smart-table">
                <thead>
                  <tr>
                    <th>Produs</th>
                    <th>Cod</th>
                    <th>Locatie</th>
                    <th>Prioritate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPickList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product}</td>
                      <td>{item.sku}</td>
                      <td>{item.location}</td>
                      <td>
                        <span className={`priority-badge ${item.priority}`}>{item.priority}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="smart-card">
            <div className="smart-card-head">
              <h2>Harta depozit (2D)</h2>
              <span className="smart-muted">Grad ocupare pe zone</span>
            </div>

            <div className="zone-grid">
              {zoneUtilization.map((zone) => (
                <article key={zone.zone} className="zone-card">
                  <div className="zone-card-head">
                    <strong>{zone.zone}</strong>
                    <span>{zone.load}%</span>
                  </div>
                  <div className="zone-progress">
                    <span style={{ width: `${zone.load}%` }} />
                  </div>
                  <p>{zone.label}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="smart-grid-two">
          <section className="smart-card">
            <div className="smart-card-head">
              <h2>Task Queue operatori</h2>
            </div>
            <div className="smart-table-wrap">
              <table className="smart-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Actiune</th>
                    <th>ETA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {taskQueue.map((task) => (
                    <tr key={task.id}>
                      <td>{task.operator}</td>
                      <td>{task.action}</td>
                      <td>{task.eta}</td>
                      <td>
                        <span className={`task-status ${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="smart-card">
            <div className="smart-card-head">
              <h2>Alerte organizare</h2>
            </div>
            <ul className="smart-alert-list">
              {alerts.map((alert) => (
                <li key={alert}>{alert}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="smart-card">
          <div className="smart-card-head">
            <h2>Jurnal activitate</h2>
          </div>
          <div className="smart-table-wrap">
            <table className="smart-table">
              <thead>
                <tr>
                  <th>Eveniment</th>
                  <th>Utilizator</th>
                  <th>Ora</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.map((event) => (
                  <tr key={event.id}>
                    <td>{event.event}</td>
                    <td>{event.user}</td>
                    <td>{event.time}</td>
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

export default SmartOrganizationShowcase;

