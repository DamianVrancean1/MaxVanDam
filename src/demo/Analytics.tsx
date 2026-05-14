import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from "recharts";
import {
  Zap, RefreshCw, Package, Clock, Download, Sparkles,
  TrendingUp, TrendingDown,
} from "lucide-react";

/* ── card entrance variants ── */
const CV = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

/* ── mock data ── */
const MOVEMENT = [
  { day: "Lun", intrari: 42, iesiri: 38, net: 4 },
  { day: "Mar", intrari: 55, iesiri: 61, net: -6 },
  { day: "Mie", intrari: 38, iesiri: 29, net: 9 },
  { day: "Joi", intrari: 71, iesiri: 68, net: 3 },
  { day: "Vin", intrari: 49, iesiri: 52, net: -3 },
  { day: "Sâm", intrari: 22, iesiri: 18, net: 4 },
  { day: "Dum", intrari: 15, iesiri: 11, net: 4 },
];

const CAT_PERF = [
  { cat: "Frâne",     valoare: 84200, fills: "#3B82F6" },
  { cat: "Filtre",    valoare: 52800, fills: "#8B5CF6" },
  { cat: "Suspensie", valoare: 63400, fills: "#F59E0B" },
  { cat: "Motor",     valoare: 91600, fills: "#10B981" },
  { cat: "Evacuare",  valoare: 31200, fills: "#06B6D4" },
];

const TOP_PRODUCTS = [
  { sku: "OIL-004", name: "Ulei motor Liqui Moly 5W-40",       cat: "Lubrifianți", moves: 156, revenue: 48360, trend: 12,  status: "ok"       },
  { sku: "FLT-033", name: "Filtru aer K&N 33-2990",             cat: "Filtre",      moves: 134, revenue: 26130, trend: 8,   status: "ok"       },
  { sku: "BRK-047", name: "Disc frână Brembo 09.8813.11",       cat: "Frâne",       moves: 98,  revenue: 37240, trend: -4,  status: "low"      },
  { sku: "BEL-019", name: "Curea distribuție Gates K015591XS",  cat: "Transmisie",  moves: 87,  revenue: 42195, trend: 15,  status: "ok"       },
  { sku: "BRG-021", name: "Rulment roată SKF VKBA 3568",        cat: "Rulmenți",    moves: 76,  revenue: 20900, trend: -11, status: "low"      },
  { sku: "BRK-001", name: "Plăcuțe frână Bosch BP2048",         cat: "Frâne",       moves: 71,  revenue: 17395, trend: 3,   status: "critical" },
  { sku: "EXH-055", name: "Tobă eșapament Febi Bilstein",       cat: "Evacuare",    moves: 54,  revenue: 29160, trend: 22,  status: "ok"       },
  { sku: "RAD-003", name: "Radiator răcire Valeo 735481",       cat: "Răcire",      moves: 23,  revenue: 20470, trend: -8,  status: "low"      },
] as const;

type ProductStatus = "ok" | "low" | "critical" | "out";

const SUPPLIERS = [
  { name: "Bosch Romania",  score: 96, onTime: "98%", orders: 34, color: "#3B82F6" },
  { name: "Continental AG", score: 89, onTime: "91%", orders: 21, color: "#10B981" },
  { name: "Valeo Parts",    score: 82, onTime: "87%", orders: 18, color: "#F59E0B" },
  { name: "SKF Group",      score: 78, onTime: "83%", orders: 12, color: "#8B5CF6" },
];

const SKU_HEALTH = [
  { name: "OK",          value: 847, fill: "#10B981" },
  { name: "Stoc Scăzut", value: 243, fill: "#F59E0B" },
  { name: "Critic",      value: 98,  fill: "#EF4444" },
  { name: "Epuizat",     value: 59,  fill: "#475569" },
];

/* 7 days × 24 hours heatmap — seeded pseudo-random for determinism */
const HEATMAP_7x24: number[][] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (__, h) => {
    const seed = Math.sin(d * 13 + h * 7.3) * 43758.5453;
    return Math.abs(seed - Math.floor(seed));
  })
);
const DAYS_SHORT = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

const PERIODS = ["Azi", "7 Zile", "30 Zile", "90 Zile"] as const;
type Period = (typeof PERIODS)[number];

const PROD_TABS = ["Toate", "Cele mai vândute", "Inactive", "Problematice"] as const;
type ProdTab = (typeof PROD_TABS)[number];

/* ── tooltip components ── */
const MovementTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dm-custom-tooltip">
      <p className="label" style={{ marginBottom: "0.35rem" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600, margin: "0.1rem 0" }}>
          {p.name}: {p.value > 0 ? "+" : ""}{p.value}
        </p>
      ))}
    </div>
  );
};

const CatTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { cat: string; valoare: number; fills: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="dm-custom-tooltip">
      <p className="label">{d.cat}</p>
      <p style={{ color: d.fills, fontWeight: 700 }}>
        {d.valoare.toLocaleString("ro-MD")} MDL
      </p>
    </div>
  );
};

const HealthTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; value: number; fill: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = SKU_HEALTH.reduce((s, x) => s + x.value, 0);
  return (
    <div className="dm-custom-tooltip">
      <p className="label">{d.name}</p>
      <p style={{ color: d.fill, fontWeight: 700 }}>
        {d.value.toLocaleString()} SKU-uri · {((d.value / total) * 100).toFixed(1)}%
      </p>
    </div>
  );
};

/* ── main component ── */
const Analytics = () => {
  const [period, setPeriod] = useState<Period>("7 Zile");
  const [prodTab, setProdTab] = useState<ProdTab>("Toate");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleOne = (sku: string) => {
    const next = new Set(selected);
    if (next.has(sku)) next.delete(sku);
    else next.add(sku);
    setSelected(next);
  };

  const filteredProducts = [...TOP_PRODUCTS].filter((p) => {
    if (prodTab === "Toate") return true;
    if (prodTab === "Cele mai vândute") return p.moves >= 80;
    if (prodTab === "Inactive") return p.moves < 40;
    if (prodTab === "Problematice") return p.status !== "ok";
    return true;
  });

  const maxMoves = Math.max(...TOP_PRODUCTS.map((p) => p.moves));
  const totalHealth = SKU_HEALTH.reduce((s, x) => s + x.value, 0);

  return (
    <>
      {/* ── 1. Page Header ── */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Analytics</h1>
          <p>Centru de analiză logistică enterprise — date live simulat</p>
        </div>
        <div className="dm-header-actions">
          {/* Period toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--s-surface)",
              border: "1px solid var(--s-border)",
              borderRadius: "var(--radius-sm)",
              padding: "3px",
              gap: "2px",
            }}
          >
            {PERIODS.map((p) => (
              <button
                key={p}
                className="dm-btn"
                onClick={() => setPeriod(p)}
                style={{
                  height: 26,
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "0 0.65rem",
                  background: period === p ? "var(--s-surface-3)" : "none",
                  color: period === p ? "var(--t-primary)" : "var(--t-tertiary)",
                  border: period === p ? "1px solid var(--s-border-2)" : "1px solid transparent",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button className="dm-btn dm-btn-ghost">
            <Download size={13} /> Export
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0 0.75rem",
              height: 32,
              background: "var(--s-surface)",
              border: "1px solid var(--s-border)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div className="dm-live-dot" />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--c-green)" }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Grid ── */}
      <div className="dm-kpi-grid">
        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-green)", "--kpi-dim": "rgba(16,185,129,0.12)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={0}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Eficiență Depozit</span>
            <div className="dm-kpi-icon"><Zap /></div>
          </div>
          <div className="dm-kpi-value">87.4%</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up"><TrendingUp size={12} /> +3.2%</span>
            <span className="dm-kpi-vs">vs săpt. trecută</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-blue)", "--kpi-dim": "rgba(59,130,246,0.12)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={1}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Rotație Stoc</span>
            <div className="dm-kpi-icon"><RefreshCw /></div>
          </div>
          <div className="dm-kpi-value">4.8x</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up"><TrendingUp size={12} /> +0.6x</span>
            <span className="dm-kpi-vs">vs săpt. trecută</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-purple)", "--kpi-dim": "rgba(139,92,246,0.12)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={2}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Produse Analizate</span>
            <div className="dm-kpi-icon"><Package /></div>
          </div>
          <div className="dm-kpi-value">1,247</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up"><TrendingUp size={12} /> 98.1%</span>
            <span className="dm-kpi-vs">acoperire totală</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-amber)", "--kpi-dim": "rgba(245,158,11,0.12)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={3}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Timp Mediu Procesare</span>
            <div className="dm-kpi-icon"><Clock /></div>
          </div>
          <div className="dm-kpi-value">2.3h</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up"><TrendingDown size={12} /> -18min</span>
            <span className="dm-kpi-vs">vs săpt. trecută</span>
          </div>
        </motion.div>
      </div>

      {/* ── 3. Charts Grid ── */}
      <div className="dm-charts-grid">
        {/* LEFT — AreaChart stock movements */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Mișcări Stoc — Ultimele 7 Zile</div>
                <div className="dm-card-subtitle">Intrări, ieșiri și sold net zilnic</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                {[
                  { key: "intrari", color: "#3B82F6", label: "Intrări" },
                  { key: "iesiri",  color: "#8B5CF6", label: "Ieșiri" },
                  { key: "net",     color: "#10B981", label: "Net" },
                ].map((l) => (
                  <div key={l.key} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={MOVEMENT} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradIntrari" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradIesiri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<MovementTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="intrari" name="Intrări" stroke="#3B82F6" strokeWidth={2}
                  fill="url(#gradIntrari)" dot={false} activeDot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="iesiri" name="Ieșiri" stroke="#8B5CF6" strokeWidth={2}
                  fill="url(#gradIesiri)" dot={false} activeDot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="net" name="Net" stroke="#10B981" strokeWidth={2}
                  fill="url(#gradNet)" dot={false} activeDot={{ r: 4, fill: "#10B981", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RIGHT — BarChart category performance */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45 }}
        >
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Performanță Categorie</div>
                <div className="dm-card-subtitle">Valoare vândută · MDL</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CAT_PERF} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barSize={26}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="cat" tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "var(--t-tertiary)", fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CatTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="valoare" radius={[4, 4, 0, 0]}>
                  {CAT_PERF.map((entry, i) => (
                    <Cell key={i} fill={entry.fills} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
              {CAT_PERF.map((c) => (
                <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.fills, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{c.cat}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 4. AI Forecasting Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* Card 1 — Reaprovizionare */}
        <motion.div
          className="dm-card"
          style={{ padding: "1.1rem 1.25rem" }}
          variants={CV} initial="hidden" animate="visible" custom={4}
        >
          <div className="dm-ai-badge">
            <Sparkles size={10} /> AI Forecast
          </div>
          <div className="dm-ai-header">
            <span className="dm-ai-dot" style={{ background: "#EF4444" }} />
            <span className="dm-ai-title">Recomandare Reaprovizionare</span>
            <span className="dm-ai-conf">94% conf.</span>
          </div>
          <p className="dm-ai-desc">
            8 SKU-uri au atins pragul minim de stoc. Estimare necesitate critică: <strong style={{ color: "var(--t-primary)" }}>3–5 zile</strong>. Acțiune imediată recomandată.
          </p>
          <button className="dm-ai-action">
            <Zap size={10} /> Generează Comandă
          </button>
        </motion.div>

        {/* Card 2 — Cerere Crescută */}
        <motion.div
          className="dm-card"
          style={{ padding: "1.1rem 1.25rem" }}
          variants={CV} initial="hidden" animate="visible" custom={5}
        >
          <div className="dm-ai-badge">
            <Sparkles size={10} /> AI Forecast
          </div>
          <div className="dm-ai-header">
            <span className="dm-ai-dot" style={{ background: "#F59E0B" }} />
            <span className="dm-ai-title">Previziune Cerere Crescută</span>
            <span className="dm-ai-conf">87% conf.</span>
          </div>
          <p className="dm-ai-desc">
            Produse categoria <strong style={{ color: "var(--t-primary)" }}>Frâne</strong> cu cerere estimată <strong style={{ color: "#F59E0B" }}>+23%</strong> săptămâna viitoare bazat pe date istorice sezoniere.
          </p>
          <button className="dm-ai-action">
            <Zap size={10} /> Vezi Detalii
          </button>
        </motion.div>

        {/* Card 3 — Anomalie */}
        <motion.div
          className="dm-card"
          style={{ padding: "1.1rem 1.25rem" }}
          variants={CV} initial="hidden" animate="visible" custom={6}
        >
          <div className="dm-ai-badge">
            <Sparkles size={10} /> AI Forecast
          </div>
          <div className="dm-ai-header">
            <span className="dm-ai-dot" style={{ background: "#8B5CF6" }} />
            <span className="dm-ai-title">Anomalie Detectată</span>
            <span className="dm-ai-conf">91% conf.</span>
          </div>
          <p className="dm-ai-desc">
            2 produse cu mișcări neobișnuite în ultimele 24h. SKU-uri afectate:{" "}
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--c-red)" }}>FLT-012</span>,{" "}
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--c-red)" }}>BRK-001</span>.
          </p>
          <button className="dm-ai-action">
            <Zap size={10} /> Investighează
          </button>
        </motion.div>
      </div>

      {/* ── 5. Product Performance Table ── */}
      <motion.div
        className="dm-card"
        style={{ marginBottom: "1.25rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        {/* Table header */}
        <div
          style={{
            padding: "1rem 1.25rem 0",
            borderBottom: "1px solid var(--s-border)",
          }}
        >
          <div className="dm-card-header" style={{ marginBottom: "0.75rem" }}>
            <div>
              <div className="dm-card-title">Top Produse — Performanță</div>
              <div className="dm-card-subtitle">Clasament după volumul mișcărilor</div>
            </div>
          </div>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
            {PROD_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setProdTab(t)}
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: 12.5,
                  fontWeight: prodTab === t ? 600 : 500,
                  color: prodTab === t ? "var(--t-primary)" : "var(--t-tertiary)",
                  background: "none",
                  border: "none",
                  borderBottom: prodTab === t ? "2px solid var(--c-blue)" : "2px solid transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "color 0.15s, border-color 0.15s",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="dm-table-wrap" style={{ border: "none", borderRadius: 0 }}>
          <table className="dm-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>
                  <input
                    type="checkbox"
                    className="dm-checkbox"
                    onChange={() => {}}
                    checked={selected.size === filteredProducts.length && filteredProducts.length > 0}
                  />
                </th>
                <th style={{ width: 100 }}>SKU</th>
                <th>Produs</th>
                <th style={{ width: 120 }}>Categorie</th>
                <th style={{ width: 180 }}>Mișcări</th>
                <th style={{ width: 140, textAlign: "right" }}>Revenue (MDL)</th>
                <th style={{ width: 90, textAlign: "center" }}>Trend</th>
                <th style={{ width: 110 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => (
                <motion.tr
                  key={p.sku}
                  variants={CV}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="dm-checkbox"
                      checked={selected.has(p.sku)}
                      onChange={() => toggleOne(p.sku)}
                    />
                  </td>
                  <td><span className="dm-td-sku">{p.sku}</span></td>
                  <td>
                    <div className="dm-td-name-wrap">
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td><span className="dm-cat-pill">{p.cat}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--t-primary)", minWidth: 28, fontVariantNumeric: "tabular-nums" }}>
                        {p.moves}
                      </span>
                      <div style={{ flex: 1, height: 4, borderRadius: 4, background: "var(--s-surface-3)", maxWidth: 90 }}>
                        <div
                          style={{
                            width: `${(p.moves / maxMoves) * 100}%`,
                            height: "100%",
                            borderRadius: 4,
                            background: p.status === "ok" ? "var(--c-blue)" : p.status === "low" ? "var(--c-amber)" : "var(--c-red)",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="dm-td-price" style={{ textAlign: "right" }}>
                    {p.revenue.toLocaleString("ro-MD")}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      className={`dm-trend ${p.trend >= 0 ? "up" : "down"}`}
                      style={{ justifyContent: "center" }}
                    >
                      {p.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {p.trend > 0 ? "+" : ""}{p.trend}%
                    </span>
                  </td>
                  <td>
                    <span className={`dm-badge dm-badge-${p.status as ProductStatus}`}>
                      {p.status === "ok" ? "În stoc" : p.status === "low" ? "Scăzut" : p.status === "critical" ? "Critic" : "Epuizat"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── 6. Bottom Grid ── */}
      <div className="dm-bottom-grid">

        {/* Col 1 — Supplier Performance */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
        >
          <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Performanță Furnizori</div>
                <div className="dm-card-subtitle">Scor livrare și punctualitate</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {SUPPLIERS.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "0.7rem 1.25rem",
                  borderBottom: "1px solid var(--s-border)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "var(--s-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "")}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-primary)" }}>{s.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: 11, color: "var(--t-tertiary)" }}>
                      La timp: <strong style={{ color: "var(--t-secondary)" }}>{s.onTime}</strong>
                    </span>
                    <span style={{ fontSize: 11, color: "var(--t-muted)" }}>
                      {s.orders} comenzi
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div className="dm-progress-track" style={{ flex: 1 }}>
                    <div
                      className="dm-progress-fill"
                      style={{ width: `${s.score}%`, background: s.color + "CC" }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: s.color,
                      minWidth: 28,
                      textAlign: "right",
                    }}
                  >
                    {s.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Col 2 — SKU Health Donut */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.61, duration: 0.45 }}
        >
          <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Distribuție SKU-uri pe Sănătate</div>
                <div className="dm-card-subtitle">{totalHealth.toLocaleString()} produse indexate</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "0.75rem 1.25rem 1rem" }}>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                innerRadius="45%"
                outerRadius="90%"
                data={SKU_HEALTH}
                startAngle={90}
                endAngle={-270}
                barSize={14}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={5}
                  background={{ fill: "var(--s-surface-3)" }}
                >
                  {SKU_HEALTH.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </RadialBar>
                <Tooltip content={<HealthTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem 1rem",
                marginTop: "0.25rem",
              }}
            >
              {SKU_HEALTH.map((h) => (
                <div key={h.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: h.fill,
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--t-primary)" }}>
                      {h.value.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 10.5, color: "var(--t-tertiary)" }}>
                      {h.name} · {((h.value / totalHealth) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Col 3 — Weekly Activity Heatmap 7×24 */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.67, duration: 0.45 }}
        >
          <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Heatmap Activitate Săptămânală</div>
                <div className="dm-card-subtitle">Intensitate mișcări pe zi și oră</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: 10, color: "var(--t-muted)" }}>
                <span>Puțin</span>
                {[0.1, 0.3, 0.55, 0.75, 0.92].map((op, i) => (
                  <span
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      background: "var(--c-purple)",
                      opacity: op,
                      borderRadius: 2,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                ))}
                <span>Mult</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "0.875rem 1.25rem 1rem", overflowX: "auto" }}>
            {/* Hour labels — every 6h */}
            <div style={{ display: "flex", marginLeft: 32, marginBottom: 4, gap: 3 }}>
              {Array.from({ length: 24 }, (_, h) => (
                <div
                  key={h}
                  style={{
                    width: 10,
                    fontSize: 9,
                    color: h % 6 === 0 ? "var(--t-tertiary)" : "transparent",
                    textAlign: "center",
                    flexShrink: 0,
                    userSelect: "none",
                  }}
                >
                  {h % 6 === 0 ? `${h}h` : ""}
                </div>
              ))}
            </div>
            {/* Rows */}
            {HEATMAP_7x24.map((row, di) => (
              <div key={di} style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                {/* Day label */}
                <span
                  style={{
                    width: 28,
                    fontSize: 10,
                    color: "var(--t-tertiary)",
                    flexShrink: 0,
                    textAlign: "right",
                    paddingRight: 4,
                  }}
                >
                  {DAYS_SHORT[di]}
                </span>
                {/* Hour cells */}
                {row.map((val, hi) => (
                  <div
                    key={hi}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: "var(--c-purple)",
                      opacity: val * 0.8 + 0.05,
                      flexShrink: 0,
                      cursor: "default",
                      transition: "transform 0.15s",
                    }}
                    title={`${DAYS_SHORT[di]} ${hi}:00 — Activitate: ${Math.round(val * 100)}%`}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.4)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "")}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </>
  );
};

export default Analytics;
