import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Rocket, Code2, Play, Headphones,
  ChevronRight, ChevronDown, BookOpen, FileText,
  Copy, Check, LayoutDashboard, Package,
  ShoppingCart, Bell, BarChart3, AlertTriangle,
  Info, Sparkles, ExternalLink, Clock,
} from "lucide-react";

/* ── types ── */
type DocKey =
  | "intro-general" | "intro-config" | "intro-start"
  | "dash-kpi" | "dash-grafice" | "dash-heatmap"
  | "inv-vizualizare" | "inv-filtre" | "inv-import" | "inv-export"
  | "com-creare" | "com-tracking" | "com-furnizori"
  | "alerte-praguri" | "alerte-canale" | "alerte-escaladare"
  | "analytics-rapoarte" | "analytics-ai" | "analytics-export"
  | "api-auth" | "api-produse" | "api-comenzi" | "api-rate"
  | "changelog-241" | "changelog-230" | "changelog-220";

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: { key: DocKey; label: string }[];
}

/* ── CodeBlock ── */
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ background: "var(--s-elevated)", border: "1px solid var(--s-border-2)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.35rem 0.75rem", borderBottom: "1px solid var(--s-border)", background: "var(--s-surface-2)" }}>
        <span style={{ fontSize: 11, color: "var(--t-muted)", fontFamily: "monospace" }}>{language}</span>
        <button
          onClick={copy}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 11, color: copied ? "var(--c-green)" : "var(--t-tertiary)", fontFamily: "inherit", transition: "color 0.2s" }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copiat!" : "Copiază"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "0.875rem 1rem", fontSize: 12.5, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: "var(--t-secondary)", overflowX: "auto", lineHeight: 1.7 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* ── Callout ── */
const Callout = ({ type, children }: { type: "info" | "warning" | "tip"; children: React.ReactNode }) => {
  const cfg = {
    info:    { color: "var(--c-blue)",   dim: "rgba(59,130,246,0.07)",  icon: <Info size={13} /> },
    warning: { color: "var(--c-amber)",  dim: "rgba(245,158,11,0.07)", icon: <AlertTriangle size={13} /> },
    tip:     { color: "var(--c-green)",  dim: "rgba(16,185,129,0.07)", icon: <Sparkles size={13} /> },
  }[type];
  return (
    <div style={{ borderLeft: `3px solid ${cfg.color}`, background: cfg.dim, borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", padding: "0.75rem 1rem", marginBottom: "1rem", display: "flex", gap: 10, fontSize: 13, color: "var(--t-secondary)", lineHeight: 1.6 }}>
      <span style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
      <span>{children}</span>
    </div>
  );
};

/* ── Heading ── */
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--t-primary)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{children}</h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--t-primary)", marginBottom: "0.5rem", marginTop: "1.25rem" }}>{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 13.5, color: "var(--t-secondary)", lineHeight: 1.75, marginBottom: "1rem" }}>{children}</p>
);

/* ══════════════════ DOC CONTENT ══════════════════ */

const DocIntroConfig = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
      <H2>Instalare & Configurare</H2>
      <span style={{ fontSize: 10, fontWeight: 700, background: "var(--c-green-dim)", color: "var(--c-green)", padding: "0.2rem 0.6rem", borderRadius: 4 }}>Actualizat · Mai 2025</span>
    </div>

    <P>Platforma MaxVanDam este o aplicație web — nu necesită instalare locală. Accesul se face prin browser, de pe orice dispozitiv conectat la internet.</P>

    <Callout type="info">Acces optim pe Chrome 110+, Firefox 115+, Safari 16+ sau Edge 110+. Rezoluție recomandată: 1280×800 sau mai mare.</Callout>

    <H3>Cerințe preliminare</H3>
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1.25rem" }}>
      {["Cont MaxVanDam activ (creat de administratorul companiei)", "Browser modern actualizat", "Conexiune stabilă la internet (min. 5 Mbps)", "Permisiunile de rol corecte setate de admin"].map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--t-secondary)" }}>
          <Check size={13} style={{ color: "var(--c-green)", flexShrink: 0 }} /> {r}
        </div>
      ))}
    </div>

    <H3>Pași de configurare inițială</H3>
    {[
      { step: "01", title: "Accesează platforma", desc: "Navighează la adresa platformei și autentifică-te cu credențialele primite." },
      { step: "02", title: "Configurează depozitul", desc: "Din Setări → Configurare Depozit, completează informațiile depozitului tău." },
      { step: "03", title: "Importă produsele", desc: "Folosește funcția Import Excel/CSV din pagina Inventar pentru a încărca catalogul de produse." },
      { step: "04", title: "Invită echipa", desc: "Adaugă utilizatorii din Setări → Echipă și atribuie roluri corespunzătoare." },
    ].map((s, i) => (
      <div key={i} style={{ display: "flex", gap: 12, marginBottom: "0.875rem", padding: "0.875rem", background: "var(--s-surface-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--s-border)" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "var(--c-blue-dim)", lineHeight: 1, flexShrink: 0, minWidth: 32, fontVariantNumeric: "tabular-nums" }}>{s.step}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--t-primary)", marginBottom: 2 }}>{s.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--t-secondary)" }}>{s.desc}</div>
        </div>
      </div>
    ))}

    <CodeBlock language="bash" code={`# URL platformă (demo)\nhttps://app.maxvandam.md\n\n# API base URL\nhttps://api.maxvandam.md/v2`} />

    <Callout type="tip">Dacă întâmpini probleme la autentificare, verifică că ai primit email-ul de invitație și că parola respectă cerințele de securitate (min. 8 caractere, o literă mare, un număr).</Callout>

    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--s-border)" }}>
      <button className="dm-btn dm-btn-primary">Primii pași <ChevronRight size={13} /></button>
    </div>
  </div>
);

const DocInvVizualizare = () => (
  <div>
    <H2>Vizualizare Produse în Inventar</H2>
    <P>Pagina Inventar oferă vizibilitate completă asupra tuturor produselor stocate, cu opțiuni avansate de filtrare, sortare și analiză în timp real.</P>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
      {[
        { icon: <FileText size={16} />, title: "Tabel interactiv",  desc: "Sortare pe orice coloană, selecție multiplă" },
        { icon: <Search size={16} />,   title: "Filtre avansate",   desc: "Filtrare după status, categorie, furnizor" },
        { icon: <ExternalLink size={16} />, title: "Export date",   desc: "Export CSV, Excel în timp real" },
      ].map((f, i) => (
        <div key={i} style={{ background: "var(--s-surface-2)", border: "1px solid var(--s-border)", borderRadius: "var(--radius-sm)", padding: "0.875rem", textAlign: "center" }}>
          <div style={{ color: "var(--c-blue)", marginBottom: 6, display: "flex", justifyContent: "center" }}>{f.icon}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-primary)", marginBottom: 3 }}>{f.title}</div>
          <div style={{ fontSize: 11.5, color: "var(--t-tertiary)" }}>{f.desc}</div>
        </div>
      ))}
    </div>

    <H3>Exemplu tabel produse</H3>
    <div className="dm-table-wrap" style={{ marginBottom: "1.25rem" }}>
      <table className="dm-table">
        <thead><tr><th>SKU</th><th>Produs</th><th>Stoc</th><th>Status</th></tr></thead>
        <tbody>
          {[
            { sku: "BRK-001", name: "Plăcuțe frână Bosch BP2048",  stock: 5,  status: "Stoc scăzut" },
            { sku: "FLT-012", name: "Filtru ulei Mann HU 816x",    stock: 0,  status: "Epuizat" },
            { sku: "OIL-004", name: "Ulei motor Liqui Moly 5W-40", stock: 34, status: "În stoc" },
          ].map((r, i) => (
            <tr key={i}>
              <td><span className="dm-td-sku">{r.sku}</span></td>
              <td style={{ color: "var(--t-primary)", fontWeight: 500 }}>{r.name}</td>
              <td style={{ color: "var(--t-primary)" }}>{r.stock}</td>
              <td>
                <span className={`dm-badge dm-badge-${r.stock === 0 ? "out" : r.stock < 10 ? "low" : "ok"}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout type="warning">Produsele cu status "Epuizat" blochează automat comenzile asociate. Verifică și actualizează stocul cu prioritate.</Callout>
  </div>
);

const DocApiAuth = () => (
  <div>
    <H2>Autentificare API</H2>
    <P>API-ul MaxVanDam folosește autentificare prin cookie-uri HttpOnly securizate (JWT). Token-ul este gestionat automat de browser — nu este necesar niciun header manual.</P>

    <H3>Base URL</H3>
    <CodeBlock language="text" code="https://api.maxvandam.md/v2" />

    <H3>Login</H3>
    <CodeBlock language="bash" code={`curl -X POST https://api.maxvandam.md/v2/auth/login \\\n  -H "Content-Type: application/json" \\\n  -c cookies.txt \\\n  -d '{\n    "username": "admin",\n    "password": "your_password"\n  }'`} />

    <H3>Răspuns autentificare</H3>
    <CodeBlock language="json" code={`{\n  "id": 1,\n  "username": "admin",\n  "role": "admin",\n  "email": "admin@maxvandam.md",\n  "createdAt": "2024-01-01T00:00:00Z"\n}\n// Token-ul JWT este livrat prin Set-Cookie: access_token (HttpOnly)`} />

    <H3>Utilizarea sesiunii</H3>
    <CodeBlock language="bash" code={`# Cookie-ul este trimis automat de browser\ncurl https://api.maxvandam.md/v2/products \\\n  -b cookies.txt \\\n  -H "Content-Type: application/json"`} />

    <H3>Coduri de eroare</H3>
    <div className="dm-table-wrap">
      <table className="dm-table">
        <thead><tr><th style={{ width: 80 }}>Cod</th><th>Descriere</th><th>Soluție</th></tr></thead>
        <tbody>
          {[
            { code: "401", desc: "Sesiune expirată sau neautentificat", fix: "Re-autentificare sau refresh automat" },
            { code: "403", desc: "Permisiuni insuficiente", fix: "Verifică rolul utilizatorului" },
            { code: "429", desc: "Prea multe request-uri", fix: "Respectă limitele de rată (rate limiting)" },
          ].map((e, i) => (
            <tr key={i}>
              <td><span className="dm-td-sku" style={{ color: "var(--c-red)" }}>{e.code}</span></td>
              <td style={{ color: "var(--t-secondary)" }}>{e.desc}</td>
              <td style={{ color: "var(--t-tertiary)", fontSize: 12 }}>{e.fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout type="info">Access token-ul expiră după 15 minute. Refresh token-ul (7 zile) este reînnoit automat la fiecare refresh — fără intervenție din partea clientului.</Callout>
  </div>
);

const DocChangelog241 = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
      <H2>Changelog — v2.4.1</H2>
      <span style={{ fontSize: 10, fontWeight: 700, background: "var(--c-blue-dim)", color: "var(--c-blue-lt)", padding: "0.2rem 0.6rem", borderRadius: 4 }}>Versiune curentă</span>
      <span style={{ fontSize: 11, color: "var(--t-muted)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> 15 Mai 2025</span>
    </div>

    {[
      {
        type: "Funcționalități noi", color: "var(--c-green)", items: [
          "Pagina Analytics complet reimaginată cu previziuni AI",
          "Heatmap activitate depozit pe 7 zile × 24 ore",
          "Widget tracking expedieri cu progress în timp real",
          "Sistem de escaladare alerte cu scor AI urgență",
        ],
      },
      {
        type: "Îmbunătățiri", color: "var(--c-blue)", items: [
          "Performanță tabel inventar +40% pe seturi > 10.000 produse",
          "Animații mai fluente în Dashboard (60fps)",
          "Filtrare instantanee fără reload în pagina Comenzi",
          "Design sidebar actualizat cu indicatori de stare live",
        ],
      },
      {
        type: "Bug Fixes", color: "var(--c-amber)", items: [
          "Rezolvat calcul incorect procent turnover pe categorii",
          "Reparat export CSV cu caractere speciale (ă, î, ș, ț)",
          "Corectat afișare dată în timezone Europe/Chisinau",
        ],
      },
    ].map((section, i) => (
      <div key={i} style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.6rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: section.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: section.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{section.type}</span>
        </div>
        <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: 4 }}>
          {section.items.map((item, j) => (
            <div key={j} style={{ display: "flex", gap: 6, fontSize: 13, color: "var(--t-secondary)" }}>
              <span style={{ color: section.color, flexShrink: 0, marginTop: 1 }}>–</span> {item}
            </div>
          ))}
        </div>
      </div>
    ))}

    <div style={{ display: "flex", gap: 8, paddingTop: "1rem", borderTop: "1px solid var(--s-border)" }}>
      <button className="dm-btn dm-btn-ghost" style={{ fontSize: 12 }}>← v2.3.0</button>
      <button className="dm-btn dm-btn-ghost" style={{ fontSize: 12 }}>v2.2.0</button>
    </div>
  </div>
);

const DocPlaceholder = ({ title }: { title: string }) => (
  <div>
    <H2>{title}</H2>
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <BookOpen size={36} style={{ color: "var(--t-muted)", marginBottom: "0.75rem", display: "block", margin: "0 auto 0.75rem" }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t-secondary)", marginBottom: 4 }}>Documentație în pregătire</div>
      <div style={{ fontSize: 12.5, color: "var(--t-tertiary)" }}>Această secțiune va fi disponibilă în versiunea v2.5.0</div>
    </div>
  </div>
);

/* ══════════════════ NAV STRUCTURE ══════════════════ */

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Introducere", icon: <Rocket size={13} />,
    items: [
      { key: "intro-general", label: "Prezentare generală" },
      { key: "intro-config",  label: "Instalare & configurare" },
      { key: "intro-start",   label: "Primii pași" },
    ],
  },
  {
    label: "Dashboard", icon: <LayoutDashboard size={13} />,
    items: [
      { key: "dash-kpi",     label: "KPI și Metrici" },
      { key: "dash-grafice", label: "Grafice & Rapoarte" },
      { key: "dash-heatmap", label: "Heatmap Depozit" },
    ],
  },
  {
    label: "Inventar", icon: <Package size={13} />,
    items: [
      { key: "inv-vizualizare", label: "Vizualizare produse" },
      { key: "inv-filtre",      label: "Filtre & Sortare" },
      { key: "inv-import",      label: "Import Excel/CSV" },
      { key: "inv-export",      label: "Export date" },
    ],
  },
  {
    label: "Comenzi", icon: <ShoppingCart size={13} />,
    items: [
      { key: "com-creare",    label: "Creare comandă" },
      { key: "com-tracking",  label: "Tracking expediere" },
      { key: "com-furnizori", label: "Gestionare furnizori" },
    ],
  },
  {
    label: "Alerte & Notificări", icon: <Bell size={13} />,
    items: [
      { key: "alerte-praguri",   label: "Configurare praguri" },
      { key: "alerte-canale",    label: "Canale notificări" },
      { key: "alerte-escaladare",label: "Escaladare alerte" },
    ],
  },
  {
    label: "Analytics", icon: <BarChart3 size={13} />,
    items: [
      { key: "analytics-rapoarte", label: "Rapoarte avansate" },
      { key: "analytics-ai",       label: "Previziuni AI" },
      { key: "analytics-export",   label: "Export PDF" },
    ],
  },
  {
    label: "API Reference", icon: <Code2 size={13} />,
    items: [
      { key: "api-auth",    label: "Autentificare" },
      { key: "api-produse", label: "Endpoints produse" },
      { key: "api-comenzi", label: "Endpoints comenzi" },
      { key: "api-rate",    label: "Rate limiting" },
    ],
  },
  {
    label: "Changelog", icon: <FileText size={13} />,
    items: [
      { key: "changelog-241", label: "v2.4.1 (curent)" },
      { key: "changelog-230", label: "v2.3.0" },
      { key: "changelog-220", label: "v2.2.0" },
    ],
  },
];

const DOC_TITLES: Partial<Record<DocKey, string>> = {
  "intro-general": "Prezentare Generală",
  "intro-start":   "Primii Pași",
  "dash-kpi":      "KPI și Metrici",
  "dash-grafice":  "Grafice & Rapoarte",
  "dash-heatmap":  "Heatmap Depozit",
  "inv-filtre":    "Filtre & Sortare",
  "inv-import":    "Import Excel/CSV",
  "inv-export":    "Export Date",
  "com-creare":    "Creare Comandă",
  "com-tracking":  "Tracking Expediere",
  "com-furnizori": "Gestionare Furnizori",
  "alerte-praguri":    "Configurare Praguri",
  "alerte-canale":     "Canale Notificări",
  "alerte-escaladare": "Escaladare Alerte",
  "analytics-rapoarte": "Rapoarte Avansate",
  "analytics-ai":       "Previziuni AI",
  "analytics-export":   "Export PDF",
  "api-produse":   "Endpoints Produse",
  "api-comenzi":   "Endpoints Comenzi",
  "api-rate":      "Rate Limiting",
  "changelog-230": "Changelog — v2.3.0",
  "changelog-220": "Changelog — v2.2.0",
};

/* ══════════════════ MAIN ══════════════════ */

const QUICK_CARDS = [
  { icon: <Rocket size={18} />,     title: "Ghid Rapid",       desc: "Pornești în 15 minute",         cta: "Începe",       color: "var(--c-blue)" },
  { icon: <Code2 size={18} />,      title: "Referință API",    desc: "Endpoints & autentificare",      cta: "Explorează",   color: "var(--c-purple)" },
  { icon: <Play size={18} />,       title: "Video Tutoriale",  desc: "4 tutoriale disponibile",         cta: "Vizionează",   color: "var(--c-green)" },
  { icon: <Headphones size={18} />, title: "Suport Tehnic",    desc: "Timp răspuns < 2h",              cta: "Contactează",  color: "var(--c-amber)" },
];

const Documentatie = () => {
  const [active, setActive]   = useState<DocKey>("intro-config");
  const [search, setSearch]   = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(NAV_GROUPS.map(g => g.label))
  );

  const toggleGroup = (label: string) => {
    const next = new Set(expanded);
    if (next.has(label)) next.delete(label); else next.add(label);
    setExpanded(next);
  };

  const filteredGroups = search.trim()
    ? NAV_GROUPS.map(g => ({
        ...g,
        items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(g => g.items.length > 0)
    : NAV_GROUPS;

  const getContent = (key: DocKey): React.ReactNode => {
    if (key === "intro-config")    return <DocIntroConfig />;
    if (key === "inv-vizualizare") return <DocInvVizualizare />;
    if (key === "api-auth")        return <DocApiAuth />;
    if (key === "changelog-241")   return <DocChangelog241 />;
    const title = DOC_TITLES[key];
    return <DocPlaceholder title={title ?? key} />;
  };

  return (
    <div>
      {/* Header */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Documentație</h1>
          <p>Ghid complet pentru platforma MaxVanDam</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="dm-inv-search" style={{ width: 220 }}>
            <Search size={13} />
            <input
              placeholder="Caută în documentație..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: 4, background: "var(--s-surface-2)", border: "1px solid var(--s-border)", color: "var(--t-tertiary)" }}>
            v2.4.1
          </span>
        </div>
      </div>

      {/* Quick access cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {QUICK_CARDS.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="dm-card dm-card-pad"
            style={{ cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
            whileHover={{ y: -3 }}
          >
            <div style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: `${c.color}1a`, border: `1px solid ${c.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, marginBottom: "0.75rem" }}>
              {c.icon}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--t-primary)", marginBottom: 3 }}>{c.title}</div>
            <div style={{ fontSize: 11.5, color: "var(--t-tertiary)", marginBottom: "0.75rem" }}>{c.desc}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: c.color, display: "flex", alignItems: "center", gap: 3 }}>
              {c.cta} <ChevronRight size={11} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main: nav tree + content */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.25rem", alignItems: "start" }}>

        {/* Left nav tree */}
        <div className="dm-card" style={{ overflow: "hidden", position: "sticky", top: 0 }}>
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, width: "100%",
                  padding: "0.65rem 0.875rem", border: "none",
                  borderBottom: "1px solid var(--s-border)",
                  background: "var(--s-surface-2)", color: "var(--t-secondary)",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "var(--t-muted)" }}>{group.icon}</span>
                <span style={{ flex: 1 }}>{group.label}</span>
                {expanded.has(group.label) ? <ChevronDown size={11} style={{ color: "var(--t-muted)" }} /> : <ChevronRight size={11} style={{ color: "var(--t-muted)" }} />}
              </button>
              <AnimatePresence>
                {expanded.has(group.label) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    {group.items.map((item, ii) => (
                      <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        style={{
                          display: "flex", alignItems: "center", width: "100%",
                          padding: "0.55rem 0.875rem 0.55rem 1.5rem",
                          border: "none",
                          borderBottom: ii < group.items.length - 1 ? "1px solid var(--s-border)" : "none",
                          borderLeft: `2px solid ${active === item.key ? "var(--c-blue)" : "transparent"}`,
                          background: active === item.key ? "var(--c-blue-dim)" : "transparent",
                          color: active === item.key ? "var(--c-blue-lt)" : "var(--t-secondary)",
                          fontSize: 12.5, fontWeight: active === item.key ? 600 : 400,
                          cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                          transition: "background 0.15s, color 0.15s",
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="dm-card dm-card-pad"
          >
            {getContent(active)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Documentatie;
