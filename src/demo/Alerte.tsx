import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell, BellOff, AlertTriangle, AlertCircle, Info, CheckCircle,
  XCircle, ShieldAlert, Package, Truck, Cpu, Lock,
  Sparkles, Clock, ChevronRight, Check, RefreshCw,
  TrendingDown, Activity,
} from "lucide-react";

/* ── types ── */
type Severity = "critical" | "high" | "medium" | "low";
type AlertCat = "stoc" | "livrare" | "sistem" | "securitate" | "furnizor";

interface AlertItem {
  id: string;
  severity: Severity;
  cat: AlertCat;
  title: string;
  desc: string;
  time: string;
  acked: boolean;
  aiScore: number;
}

/* ── mock data ── */
const ALERTS: AlertItem[] = [
  { id: "ALT-001", severity: "critical", cat: "stoc",      title: "Stoc epuizat — FLT-012",             desc: "Filtrul Mann HU 816x a atins 0 unități. 3 comenzi pending nu pot fi onorate.",                   time: "acum 2 min",   acked: false, aiScore: 98 },
  { id: "ALT-002", severity: "critical", cat: "livrare",   title: "Livrare întârziată — CMD-4818",       desc: "Comanda NGK (24 bujii) a depășit termenul cu 3 ore. Curier DHL nu răspunde.",                  time: "acum 5 min",   acked: false, aiScore: 95 },
  { id: "ALT-003", severity: "high",     cat: "stoc",      title: "Stoc critic — BRK-001",               desc: "Plăcuțe frână Bosch BP2048: 5 unități rămase (min. 10). Estimat epuizare în 2 zile.",           time: "acum 12 min",  acked: false, aiScore: 88 },
  { id: "ALT-004", severity: "high",     cat: "furnizor",  title: "Furnizor indisponibil — Febi Bilstein",desc: "Portal furnizor offline 45 min. 2 comenzi programate nu pot fi confirmate.",                   time: "acum 28 min",  acked: false, aiScore: 82 },
  { id: "ALT-005", severity: "high",     cat: "stoc",      title: "Anomalie mișcare stoc — IGN-077",     desc: "Bujii NGK: ieșiri cu +340% față de medie istorică. Verificare imediată necesară.",               time: "acum 35 min",  acked: true,  aiScore: 79 },
  { id: "ALT-006", severity: "medium",   cat: "sistem",    title: "Sincronizare întârziată",              desc: "Modulul de raportare are un lag de 8 minute față de real-time. Investigare în curs.",            time: "acum 1 oră",   acked: false, aiScore: 61 },
  { id: "ALT-007", severity: "medium",   cat: "stoc",      title: "Stoc scăzut — RAD-003",               desc: "Radiator Valeo 735481: 4 unități (min. 6). Comandă sugerată: min. 8 unități.",                  time: "acum 1.5 ore", acked: true,  aiScore: 65 },
  { id: "ALT-008", severity: "medium",   cat: "livrare",   title: "ETA revizuit — CMD-4817",             desc: "SKF Group — livrare reprogramată cu 4 ore mai târziu. Actualizat automat în sistem.",            time: "acum 2 ore",   acked: true,  aiScore: 58 },
  { id: "ALT-009", severity: "low",      cat: "sistem",    title: "Backup programat în 30 min",          desc: "Backup automat bază date. Sistem funcționează normal, nicio acțiune necesară.",                  time: "acum 2.5 ore", acked: false, aiScore: 22 },
  { id: "ALT-010", severity: "low",      cat: "furnizor",  title: "Prețuri actualizate — Bosch Romania", desc: "12 produse au primit prețuri noi din catalogul Q1. Verificare recomandată.",                    time: "acum 3 ore",   acked: true,  aiScore: 31 },
  { id: "ALT-011", severity: "low",      cat: "securitate",title: "Autentificare nouă detectată",        desc: "IP nou: 89.137.45.12 — User: operator_2. Locație: Chișinău, MD. Activitate normală.",           time: "acum 4 ore",   acked: true,  aiScore: 28 },
  { id: "ALT-012", severity: "low",      cat: "sistem",    title: "Raport lunar generat",                desc: "Raportul Aprilie 2025 este disponibil pentru descărcare în format PDF și Excel. 48 pagini.",     time: "acum 5 ore",   acked: true,  aiScore: 15 },
];

const ALERT_TREND = [
  { day: "Lun", critical: 1, high: 3, medium: 5, low: 8 },
  { day: "Mar", critical: 2, high: 4, medium: 3, low: 6 },
  { day: "Mie", critical: 0, high: 2, medium: 7, low: 9 },
  { day: "Joi", critical: 3, high: 5, medium: 4, low: 7 },
  { day: "Vin", critical: 1, high: 3, medium: 6, low: 5 },
  { day: "Sâm", critical: 0, high: 1, medium: 2, low: 3 },
  { day: "Dum", critical: 2, high: 2, medium: 3, low: 4 },
];

const AI_RECS = [
  { title: "Comandă urgentă necesară",   desc: "FLT-012 și BRK-001 necesită reaprovizionare în max. 48h bazat pe rata de consum.",        action: "Generează Comandă", color: "var(--c-red)" },
  { title: "Revizuire praguri minime",   desc: "6 SKU-uri au praguri minime setate sub consumul real din ultimele 30 zile.",              action: "Ajustează Praguri", color: "var(--c-amber)" },
  { title: "Optimizare furnizori",        desc: "2 furnizori au rata de livrare la timp sub 85%. Evaluare alternativă recomandată.",       action: "Vezi Raport",       color: "var(--c-blue)" },
];

const TIMELINE_EVENTS = [
  { sev: "critical", icon: <XCircle size={13} />,     title: "Stoc epuizat FLT-012",               desc: "Acțiune automată: comandă blocată",        time: "acum 2 min",   color: "var(--c-red)" },
  { sev: "critical", icon: <Truck size={13} />,        title: "Livrare întârziată CMD-4818",         desc: "Alert trimis la manager depozit",           time: "acum 5 min",   color: "var(--c-red)" },
  { sev: "high",     icon: <AlertTriangle size={13} />,title: "Furnizor Febi indisponibil",          desc: "Ticket deschis automat la suport",           time: "acum 28 min",  color: "var(--c-amber)" },
  { sev: "resolved", icon: <CheckCircle size={13} />,  title: "ALT-005 marcat rezolvat",             desc: "Rezolvat de operator_1 — investigație închisă",time: "acum 1.5 ore",color: "var(--c-green)" },
  { sev: "medium",   icon: <Cpu size={13} />,          title: "Sincronizare întârziată detectată",   desc: "Monitorizare activată pe modul raportare",   time: "acum 1 oră",   color: "var(--c-blue)" },
  { sev: "low",      icon: <Info size={13} />,         title: "Raport lunar Aprilie generat",        desc: "Disponibil în secțiunea Rapoarte",           time: "acum 5 ore",   color: "var(--t-tertiary)" },
];

const HEALTH_METRICS = [
  { label: "Disponibilitate Stoc",      value: 82, color: "var(--c-green)" },
  { label: "Acuratețe Inventar",        value: 96, color: "var(--c-blue)" },
  { label: "Eficiență Livrări",         value: 78, color: "var(--c-amber)" },
  { label: "Timp Răspuns Alerte",       value: 71, color: "var(--c-purple)" },
];

/* ── config ── */
const SEV_CFG: Record<Severity, { label: string; color: string; dim: string; icon: React.ReactNode }> = {
  critical: { label: "Critic",  color: "var(--c-red)",    dim: "var(--c-red-dim)",    icon: <ShieldAlert size={11} /> },
  high:     { label: "High",    color: "var(--c-amber)",  dim: "var(--c-amber-dim)",  icon: <AlertTriangle size={11} /> },
  medium:   { label: "Medium",  color: "var(--c-blue)",   dim: "var(--c-blue-dim)",   icon: <AlertCircle size={11} /> },
  low:      { label: "Low",     color: "var(--t-muted)",  dim: "var(--s-surface-2)",  icon: <Info size={11} /> },
};

const CAT_ICON: Record<AlertCat, React.ReactNode> = {
  stoc:       <Package size={11} />,
  livrare:    <Truck size={11} />,
  sistem:     <Cpu size={11} />,
  securitate: <Lock size={11} />,
  furnizor:   <Activity size={11} />,
};

const CV = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const TOOLTIP_STYLE = {
  background: "var(--s-surface-3)",
  border: "1px solid var(--s-border-2)",
  borderRadius: 6,
  fontSize: 11,
  color: "var(--t-primary)",
};

/* ── alert row ── */
const AlertRow = ({ a, onAck }: { a: AlertItem; onAck: (id: string) => void }) => {
  const cfg = SEV_CFG[a.severity];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8, height: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        gap: 12,
        padding: "0.875rem 1.25rem",
        borderBottom: "1px solid var(--s-border)",
        background: a.acked ? "transparent" : `${cfg.dim}`,
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      {/* severity accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: cfg.color, borderRadius: "3px 0 0 3px",
        opacity: a.acked ? 0.3 : 1,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
          {/* severity badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 10, fontWeight: 700, padding: "0.15rem 0.5rem",
            borderRadius: 4, background: cfg.dim, color: cfg.color, flexShrink: 0,
          }}>
            {cfg.icon} {cfg.label}
          </span>
          {/* category chip */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 10, fontWeight: 500, padding: "0.15rem 0.45rem",
            borderRadius: 4, background: "var(--s-surface-2)",
            border: "1px solid var(--s-border)", color: "var(--t-tertiary)", flexShrink: 0,
          }}>
            {CAT_ICON[a.cat]} {a.cat}
          </span>
          {/* AI score */}
          <span style={{
            fontSize: 10, fontWeight: 700, color: "var(--c-purple)",
            background: "var(--c-purple-dim)", padding: "0.15rem 0.45rem",
            borderRadius: 4, border: "1px solid rgba(139,92,246,0.2)", flexShrink: 0,
          }}>
            AI {a.aiScore}%
          </span>
          {a.acked && (
            <span style={{ fontSize: 10, color: "var(--t-muted)", marginLeft: "auto" }}>✓ rezolvat</span>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--t-primary)", marginBottom: 3 }}>{a.title}</div>
        <div style={{ fontSize: 12, color: "var(--t-secondary)", lineHeight: 1.5 }}>{a.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "var(--t-muted)" }}><Clock size={10} style={{ display: "inline", marginRight: 3 }} />{a.time}</span>
        </div>
      </div>

      {!a.acked && (
        <button
          onClick={() => onAck(a.id)}
          className="dm-btn dm-btn-ghost"
          style={{ height: 28, padding: "0 0.6rem", fontSize: 11, flexShrink: 0, alignSelf: "center" }}
        >
          <Check size={11} /> Rezolvă
        </button>
      )}
    </motion.div>
  );
};

/* ── component ── */
const Alerte = () => {
  const [soundOn, setSoundOn]   = useState(true);
  const [tab, setTab]           = useState<Severity | "all">("all");
  const [alerts, setAlerts]     = useState<AlertItem[]>(ALERTS);

  const ackAlert = (id: string) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acked: true } : a));

  const ackAll = () => setAlerts(prev => prev.map(a => ({ ...a, acked: true })));

  const filtered = tab === "all" ? alerts : alerts.filter(a => a.severity === tab);

  const counts = {
    all:      alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    high:     alerts.filter(a => a.severity === "high").length,
    medium:   alerts.filter(a => a.severity === "medium").length,
    low:      alerts.filter(a => a.severity === "low").length,
  };

  const unacked = alerts.filter(a => !a.acked).length;
  const healthScore = 73;

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Alerte</h1>
          <p>
            Centru inteligent de monitorizare —
            <span style={{ color: "var(--c-red)", fontWeight: 600 }}> {unacked} alerte active</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="dm-live-dot" style={{ marginRight: 2 }} />
          <span style={{ fontSize: 11, color: "var(--c-green)", marginRight: 8 }}>Monitorizare activă</span>
          <button
            className={`dm-btn dm-btn-ghost`}
            style={soundOn ? { color: "var(--c-blue)", borderColor: "rgba(59,130,246,0.3)" } : {}}
            onClick={() => setSoundOn(s => !s)}
            title={soundOn ? "Dezactivează sunet" : "Activează sunet"}
          >
            {soundOn ? <Bell size={14} /> : <BellOff size={14} />}
            {soundOn ? "Sunet On" : "Sunet Off"}
          </button>
          <button className="dm-btn dm-btn-ghost" onClick={ackAll}>
            <CheckCircle size={14} /> Marchează toate citite
          </button>
          <button className="dm-btn dm-btn-ghost">
            <RefreshCw size={14} /> Reîncarcă
          </button>
        </div>
      </div>

      {/* ── Alert Stats Bar ── */}
      <motion.div
        variants={CV} initial="hidden" animate="visible" custom={0}
        style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem", marginBottom: "1.25rem",
        }}
      >
        {([
          { sev: "critical", label: "Critic",  count: counts.critical, unresolved: alerts.filter(a=>a.severity==="critical"&&!a.acked).length, color: "var(--c-red)",   dim: "rgba(239,68,68,0.08)" },
          { sev: "high",     label: "High",    count: counts.high,     unresolved: alerts.filter(a=>a.severity==="high"&&!a.acked).length,     color: "var(--c-amber)", dim: "rgba(245,158,11,0.08)" },
          { sev: "medium",   label: "Medium",  count: counts.medium,   unresolved: alerts.filter(a=>a.severity==="medium"&&!a.acked).length,   color: "var(--c-blue)",  dim: "rgba(59,130,246,0.08)" },
          { sev: "low",      label: "Low",     count: counts.low,      unresolved: alerts.filter(a=>a.severity==="low"&&!a.acked).length,      color: "var(--t-muted)", dim: "var(--s-surface-2)" },
        ] as const).map(s => (
          <div
            key={s.sev}
            style={{
              background: s.dim,
              border: `1px solid ${s.color === "var(--t-muted)" ? "var(--s-border)" : `${s.color}40`}`,
              borderLeft: `3px solid ${s.color}`,
              borderRadius: "var(--radius)", padding: "1rem 1.25rem",
              cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onClick={() => setTab(s.sev as Severity)}
          >
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4, letterSpacing: "-0.02em" }}>
              {s.count}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t-secondary)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "var(--t-tertiary)" }}>
              <span style={{ color: s.unresolved > 0 ? s.color : "var(--t-muted)", fontWeight: 600 }}>{s.unresolved}</span> nerezolvate
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Main 2-column grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem", marginBottom: "1.25rem" }}>

        {/* LEFT — Alert Feed */}
        <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem 0", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: "0.75rem" }}>
              <div>
                <div className="dm-card-title">Feed Alerte Live</div>
                <div className="dm-card-subtitle">{filtered.length} alerte — {filtered.filter(a=>!a.acked).length} nerezolvate</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="dm-live-dot" />
                <span style={{ fontSize: 11, color: "var(--c-green)" }}>Live</span>
              </div>
            </div>
            <div className="dm-inv-tabs" style={{ borderBottom: "none", margin: 0 }}>
              {([
                { key: "all",      label: "Toate",  cnt: counts.all },
                { key: "critical", label: "Critic", cnt: counts.critical },
                { key: "high",     label: "High",   cnt: counts.high },
                { key: "medium",   label: "Medium", cnt: counts.medium },
                { key: "low",      label: "Low",    cnt: counts.low },
              ] as const).map(t => (
                <button
                  key={t.key}
                  className={`dm-inv-tab${tab === t.key ? " active" : ""}`}
                  onClick={() => setTab(t.key as Severity | "all")}
                >
                  {t.label}
                  <span className="dm-inv-tab-count">{t.cnt}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: 480, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--s-border-2) transparent" }}>
            <AnimatePresence>
              {filtered.map(a => (
                <AlertRow key={a.id} a={a} onAck={ackAlert} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* RIGHT — Health + AI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Warehouse Health */}
          <motion.div variants={CV} initial="hidden" animate="visible" custom={2} className="dm-card dm-card-pad">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Sănătate Depozit</div>
                <div className="dm-card-subtitle">Scor general operațional</div>
              </div>
              <TrendingDown size={14} style={{ color: "var(--c-amber)" }} />
            </div>

            {/* Big score */}
            <div style={{ textAlign: "center", padding: "1rem 0 1.25rem" }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                background: `conic-gradient(var(--c-amber) ${healthScore * 3.6}deg, var(--s-surface-3) 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 0.6rem",
                boxShadow: "0 0 20px rgba(245,158,11,0.2)",
              }}>
                <div style={{
                  width: 68, height: 68, borderRadius: "50%",
                  background: "var(--s-surface)", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "var(--c-amber)", lineHeight: 1 }}>{healthScore}</span>
                  <span style={{ fontSize: 9, color: "var(--t-muted)", fontWeight: 600 }}>/100</span>
                </div>
              </div>
              <span className="dm-trend warn" style={{ fontSize: 11 }}>
                <AlertTriangle size={10} /> Necesită atenție
              </span>
            </div>

            {/* Sub-metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {HEALTH_METRICS.map(m => (
                <div key={m.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, color: "var(--t-secondary)" }}>{m.label}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: m.color }}>{m.value}%</span>
                  </div>
                  <div className="dm-progress-track">
                    <div className="dm-progress-fill" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div variants={CV} initial="hidden" animate="visible" custom={3} className="dm-card" style={{ overflow: "hidden" }}>
            <div className="dm-card-pad" style={{ borderBottom: "1px solid var(--s-border)" }}>
              <div className="dm-ai-badge">
                <Sparkles size={10} /> AI Recomandări
              </div>
              <div className="dm-card-title">Acțiuni Sugerate</div>
            </div>
            {AI_RECS.map((r, i) => (
              <div key={i} className="dm-ai-item">
                <div className="dm-ai-header">
                  <div className="dm-ai-dot" style={{ background: r.color }} />
                  <span className="dm-ai-title">{r.title}</span>
                </div>
                <div className="dm-ai-desc">{r.desc}</div>
                <a className="dm-ai-action" href="#">
                  {r.action} <ChevronRight size={10} />
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Bottom 2-column ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Alert Trend Chart */}
        <motion.div variants={CV} initial="hidden" animate="visible" custom={4} className="dm-card dm-chart-wrap">
          <div className="dm-card-header">
            <div>
              <div className="dm-card-title">Evoluție Alerte — 7 Zile</div>
              <div className="dm-card-subtitle">Distribuție pe severitate</div>
            </div>
            <div style={{ display: "flex", gap: 8, fontSize: 10, color: "var(--t-muted)", alignItems: "center" }}>
              {[["#EF4444","Critic"],["#F59E0B","High"],["#3B82F6","Medium"],["#475569","Low"]].map(([c,l]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ALERT_TREND} barSize={14} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="0" stroke="var(--s-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="critical" stackId="a" fill="#EF4444" radius={[0,0,0,0]} />
              <Bar dataKey="high"     stackId="a" fill="#F59E0B" />
              <Bar dataKey="medium"   stackId="a" fill="#3B82F6" />
              <Bar dataKey="low"      stackId="a" fill="#334155" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Incident Timeline */}
        <motion.div variants={CV} initial="hidden" animate="visible" custom={5} className="dm-card dm-card-pad">
          <div className="dm-card-header" style={{ marginBottom: "1rem" }}>
            <div>
              <div className="dm-card-title">Istoric Evenimente</div>
              <div className="dm-card-subtitle">Ultimele 6 incidente înregistrate</div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {/* vertical line */}
            <div style={{
              position: "absolute", left: 9, top: 12, bottom: 12,
              width: 1, background: "var(--s-border-2)",
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {TIMELINE_EVENTS.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 12, paddingBottom: "0.875rem", position: "relative" }}>
                  {/* dot */}
                  <div style={{
                    width: 19, height: 19, borderRadius: "50%", flexShrink: 0,
                    background: `${e.color}22`,
                    border: `2px solid ${e.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: e.color, zIndex: 1, marginTop: 1,
                  }}>
                    {e.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-primary)", marginBottom: 2 }}>{e.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--t-secondary)", marginBottom: 3, lineHeight: 1.4 }}>{e.desc}</div>
                    <div style={{ fontSize: 10.5, color: "var(--t-muted)" }}>
                      <Clock size={9} style={{ display: "inline", marginRight: 3 }} />{e.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Alerte;
