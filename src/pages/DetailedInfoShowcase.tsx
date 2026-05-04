import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/DetailedInfoShowcase.css';

type QualityTier = 'Premium' | 'Standard' | 'Economic';

type CompatibilityRow = {
  brand: string;
  model: string;
  years: string;
  engine: string;
  body: string;
};

type CrossRefRow = {
  oem: string;
  aftermarket: string;
  brand: string;
  note: string;
};

type RevisionRow = {
  id: number;
  version: string;
  change: string;
  date: string;
  user: string;
};

const sidebarItems = ['Dashboard', 'Produse', 'Informatii Detaliate', 'Adauga produs', 'Profil'] as const;

const kpiCards = [
  { label: 'Fise tehnice complete', value: '1,240', meta: 'Date standardizate' },
  { label: 'Compatibilitati validate', value: '18,900', meta: 'Modele auto mapate' },
  { label: 'Coduri OEM mapate', value: '9,320', meta: 'Cross-reference activ' },
  { label: 'Documente tehnice', value: '3,580', meta: 'PDF, instructiuni, QA' },
] as const;

const compatibilityRows: CompatibilityRow[] = [
  { brand: 'BMW', model: 'Seria 3 (F30)', years: '2012-2018', engine: '2.0d / 2.0i', body: 'Sedan' },
  { brand: 'Audi', model: 'A4 B8', years: '2008-2015', engine: '2.0 TDI', body: 'Sedan/Avant' },
  { brand: 'Mercedes', model: 'C-Class W205', years: '2014-2021', engine: '2.0 CDI', body: 'Sedan' },
  { brand: 'Volkswagen', model: 'Passat B8', years: '2015-2022', engine: '2.0 TDI', body: 'Sedan/Variant' },
  { brand: 'Skoda', model: 'Octavia III', years: '2013-2020', engine: '1.6 TDI / 2.0 TDI', body: 'Liftback' },
];

const crossRefRows: CrossRefRow[] = [
  { oem: '06L115562B', aftermarket: 'HU 7020 z', brand: 'Mann', note: 'Filtru ulei echivalent direct' },
  { oem: '11428575211', aftermarket: 'OX 404D', brand: 'Mahle', note: 'Compatibil BMW diesel' },
  { oem: '03L129620', aftermarket: 'C 35 154', brand: 'Mann', note: 'Filtru aer standard Euro 6' },
  { oem: 'A6510901552', aftermarket: 'PU 10017 z', brand: 'Mann', note: 'Filtru combustibil Mercedes' },
];

const revisions: RevisionRow[] = [
  { id: 1, version: 'v2.4', change: 'Actualizare interval compatibilitate BMW F30', date: '29.03.2026 11:20', user: 'tech.docs' },
  { id: 2, version: 'v2.3', change: 'Adaugat cod alternativ aftermarket', date: '27.03.2026 16:44', user: 'catalog.admin' },
  { id: 3, version: 'v2.2', change: 'Corectie material garnitura + torque', date: '25.03.2026 09:12', user: 'qa.engineer' },
  { id: 4, version: 'v2.1', change: 'Adaugat instructiuni montaj PDF', date: '24.03.2026 14:07', user: 'tech.writer' },
];

const DetailedInfoShowcase = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const qualityTier: QualityTier = 'Premium';

  const handleExitSite = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`detailed-dashboard ${isDarkTheme ? 'detailed-theme-dark' : 'detailed-theme-light'}`}>
      <aside className="detailed-sidebar">
        <div className="detailed-brand">
          <span className="detailed-brand-badge">MV</span>
          <div>
            <p>Admin Panel</p>
            <span>Demo UI - Product Intelligence</span>
          </div>
        </div>

        <nav className="detailed-nav" aria-label="Navigatie demo informatii detaliate">
          {sidebarItems.map((item) => (
            <span key={item} className={`detailed-nav-link ${item === 'Informatii Detaliate' ? 'active' : ''}`}>
              {item}
            </span>
          ))}
        </nav>
      </aside>

      <section className="detailed-main">
        <header className="detailed-topbar">
          <div>
            <span className="detailed-demo-pill">DEMO / SHOWCASE UI</span>
            <h1>Informatii Detaliate</h1>
            <p>
              Specificatii complete pentru fiecare piesa, compatibilitate, coduri OEM si recomandari
              tehnice pentru decizii rapide.
            </p>
          </div>

          <div className="detailed-actions">
            <button type="button" className="detailed-secondary-btn" onClick={handleExitSite}>Inapoi la site</button>
            <button
              type="button"
              className={`detailed-switch ${isDarkTheme ? 'is-on' : ''}`}
              role="switch"
              aria-checked={isDarkTheme}
              onClick={() => setIsDarkTheme((prev) => !prev)}
            >
              <span>{isDarkTheme ? 'Dark' : 'Light'}</span>
              <span className="detailed-switch-track">
                <span className="detailed-switch-thumb" />
              </span>
            </button>
            <button type="button" className="detailed-primary-btn">Vezi catalogul</button>
          </div>
        </header>

        <section className="detailed-kpi-grid">
          {kpiCards.map((card) => (
            <article key={card.label} className="detailed-kpi-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.meta}</small>
            </article>
          ))}
        </section>

        <div className="detailed-grid-two">
          <section className="detailed-card detailed-main-card">
            <div className="detailed-card-head">
              <h2>Fisa tehnica piesa</h2>
              <span className={`quality-badge ${qualityTier.toLowerCase()}`}>{qualityTier}</span>
            </div>
            <div className="detailed-spec-grid">
              <p><strong>SKU:</strong> SKU-45031</p>
              <p><strong>OEM:</strong> 06L115562B</p>
              <p><strong>Categorie:</strong> Filtrare motor</p>
              <p><strong>Producator:</strong> Mann</p>
              <p><strong>Material:</strong> Microfibre celulozice</p>
              <p><strong>Dimensiuni:</strong> 87 x 68 x 68 mm</p>
              <p><strong>Greutate:</strong> 0.32 kg</p>
              <p><strong>Torque montaj:</strong> 25 Nm</p>
            </div>
            <div className="detailed-chip-row">
              <span className="doc-chip">Fisa tehnica PDF</span>
              <span className="doc-chip">Instructiuni montaj</span>
              <span className="doc-chip">Certificare ISO/TS</span>
            </div>
          </section>

          <section className="detailed-card">
            <div className="detailed-card-head">
              <h2>Recomandari inteligente</h2>
            </div>
            <ul className="recommendation-list">
              <li>Kit service recomandat: filtru + garnitura + ulei 5W-30.</li>
              <li>Piese asociate: filtru aer, filtru combustibil, filtru habitaclu.</li>
              <li>Avertisment montaj: inlocuieste garnitura la fiecare schimb.</li>
              <li>Interval recomandat: 10.000 - 15.000 km.</li>
            </ul>
          </section>
        </div>

        <section className="detailed-card">
          <div className="detailed-card-head">
            <h2>Compatibilitate auto</h2>
          </div>
          <div className="detailed-table-wrap">
            <table className="detailed-table">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Model</th>
                  <th>Ani</th>
                  <th>Motorizare</th>
                  <th>Caroserie</th>
                </tr>
              </thead>
              <tbody>
                {compatibilityRows.map((row) => (
                  <tr key={`${row.brand}-${row.model}`}>
                    <td>{row.brand}</td>
                    <td>{row.model}</td>
                    <td>{row.years}</td>
                    <td>{row.engine}</td>
                    <td>{row.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="detailed-grid-two">
          <section className="detailed-card">
            <div className="detailed-card-head">
              <h2>Cross-reference OEM</h2>
            </div>
            <div className="detailed-table-wrap">
              <table className="detailed-table">
                <thead>
                  <tr>
                    <th>OEM</th>
                    <th>Aftermarket</th>
                    <th>Brand</th>
                    <th>Observatii</th>
                  </tr>
                </thead>
                <tbody>
                  {crossRefRows.map((row) => (
                    <tr key={`${row.oem}-${row.aftermarket}`}>
                      <td>{row.oem}</td>
                      <td>{row.aftermarket}</td>
                      <td>{row.brand}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="detailed-card">
            <div className="detailed-card-head">
              <h2>Istoric versiuni</h2>
            </div>
            <div className="detailed-table-wrap">
              <table className="detailed-table">
                <thead>
                  <tr>
                    <th>Versiune</th>
                    <th>Schimbare</th>
                    <th>Data</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {revisions.map((row) => (
                    <tr key={row.id}>
                      <td>{row.version}</td>
                      <td>{row.change}</td>
                      <td>{row.date}</td>
                      <td>{row.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default DetailedInfoShowcase;
