import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  Package, TrendingUp, TrendingDown, Activity, AlertTriangle,
  ArrowUpRight, Sparkles, ChevronRight, Zap, RefreshCw,
  MoreHorizontal, ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── mock data ── */
const STOCK_TREND = [
  { day: "Lun", value: 285400, moves: 12 },
  { day: "Mar", value: 291200, moves: 18 },
  { day: "Mie", value: 287800, moves: 9 },
  { day: "Joi", value: 298600, moves: 22 },
  { day: "Vin", value: 301200, moves: 28 },
  { day: "Sâm", value: 298700, moves: 15 },
  { day: "Dum", value: 308400, moves: 7 },
];

const CAT_DIST = [
  { name: "Frâne", value: 42, amount: 129528 },
  { name: "Motor", value: 28, amount: 86352 },
  { name: "Suspensie", value: 19, amount: 58596 },
  { name: "Filtre", value: 11, amount: 33924 },
];
const CAT_COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981"];

const ACTIVITY = [
  { id: 1, user: "Maria P.", action: "a adăugat", item: "Filtru Mann HU 816 x", qty: "+50 buc", time: "2 min", type: "add", bg: "#10B981" },
  { id: 2, user: "Ion C.", action: "a editat", item: "Plăcuțe Brembo P06035", qty: "12→8 buc", time: "8 min", type: "edit", bg: "#3B82F6" },
  { id: 3, user: "System", action: "Alertă stoc scăzut", item: "Amortizor Monroe G8089", qty: "5 / min 20", time: "15 min", type: "alert", bg: "#EF4444" },
  { id: 4, user: "Elena R.", action: "a exportat", item: "Inventar Frâne Q2 2025", qty: "247 produse", time: "32 min", type: "export", bg: "#8B5CF6" },
  { id: 5, user: "Ion C.", action: "a șters", item: "SKF VKBP 90131", qty: "discontinuat", time: "1h", type: "delete", bg: "#EF4444" },
  { id: 6, user: "Maria P.", action: "a adăugat", item: "NGK BKR6EGP Bujie", qty: "+100 buc", time: "2h", type: "add", bg: "#10B981" },
];

const CRITICAL = [
  { sku: "FLT-012", name: "Filtru Mann HU 816 x",      stock: 2,  min: 15, pct: 13, cat: "Filtre",    color: "#EF4444" },
  { sku: "BRK-001", name: "Plăcuțe Bosch BP2048",       stock: 5,  min: 10, pct: 50, cat: "Frâne",     color: "#F59E0B" },
  { sku: "SUS-089", name: "Amortizor Monroe G8089",      stock: 5,  min: 20, pct: 25, cat: "Suspensie", color: "#EF4444" },
  { sku: "MOT-034", name: "Curea distribuție Gates",     stock: 8,  min: 15, pct: 53, cat: "Motor",     color: "#F59E0B" },
  { sku: "FLT-067", name: "Filtru aer Hengst E351L",     stock: 3,  min: 12, pct: 25, cat: "Filtre",    color: "#EF4444" },
];

const AI_INSIGHTS = [
  {
    type: "risk",
    title: "Risc epuizare stoc",
    desc: "Filtru Mann HU 816 x se va epuiza în ~3 zile la rata curentă de 6.2 unități/zi.",
    confidence: 94,
    action: "Creează comandă",
    color: "#EF4444",
  },
  {
    type: "forecast",
    title: "Prognoza 7 zile",
    desc: "Plăcuțele Brembo P06035 vor necesita reaprovizionare (ETA: Vineri 23 Mai).",
    confidence: 87,
    action: "Planifică",
    color: "#F59E0B",
  },
  {
    type: "trend",
    title: "Trend ascendent detectat",
    desc: "Amortizoarele Monroe au vânzări +34% față de luna trecută. Recomandăm +40% stoc.",
    confidence: 78,
    action: "Acceptă sugestia",
    color: "#10B981",
  },
];

const MONTHS_RO = ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'];
type ActivityPeriod = 'luna' | 'saptamana' | 'zi' | 'ore';
const ACT_PERIODS: { id: ActivityPeriod; label: string }[] = [
  { id: 'luna',      label: 'Lună' },
  { id: 'saptamana', label: 'Săptămână' },
  { id: 'zi',        label: 'Zi' },
  { id: 'ore',       label: 'Ore' },
];
function genActivityData(period: ActivityPeriod) {
  const v = (i: number, s: number) =>
    Math.round(Math.abs(Math.sin(i * s + 1.7) * 65 + Math.sin(i * 0.5) * 25) + 15);
  if (period === 'luna') {
    const cur = new Date().getMonth();
    return Array.from({ length: 6 }, (_, i) => ({ label: MONTHS_RO[(cur - 5 + i + 12) % 12], value: v(i, 2.3) }));
  }
  if (period === 'saptamana') {
    return Array.from({ length: 8 }, (_, i) => ({ label: `S${i + 1}`, value: v(i, 1.7) }));
  }
  if (period === 'zi') {
    const d = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const day = new Date(d); day.setDate(d.getDate() - 13 + i);
      return { label: `${day.getDate()} ${MONTHS_RO[day.getMonth()]}`, value: v(i, 3.1) };
    });
  }
  return Array.from({ length: 24 }, (_, i) => ({ label: `${i}h`, value: v(i, 0.9) }));
}

/* ── helpers ── */
function fmtMdl(n: number) {
  return n >= 1000
    ? (n / 1000).toFixed(0) + "K MDL"
    : n + " MDL";
}

const CardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dm-custom-tooltip">
      <p className="label">{label}</p>
      <p style={{ color: "#3B82F6", fontWeight: 700 }}>
        {Number(payload[0].value).toLocaleString()} MDL
      </p>
    </div>
  );
};

const BarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dm-custom-tooltip">
      <p className="label">{payload[0].payload.name}</p>
      <p style={{ color: payload[0].fill, fontWeight: 700 }}>
        {payload[0].value}% · {Number(payload[0].payload.amount).toLocaleString()} MDL
      </p>
    </div>
  );
};

/* ── KPI card ── */
const KpiCard = ({
  label, value, raw, change, up, Icon, color, dim, idx
}: {
  label: string; value: string; raw: number; change: string; up: boolean;
  Icon: any; color: string; dim: string; idx: number;
}) => (
  <motion.div
    className="dm-kpi-card"
    style={{ "--kpi-color": color, "--kpi-dim": dim } as React.CSSProperties}
    variants={CardVariants}
    initial="hidden"
    animate="visible"
    custom={idx}
  >
    <div className="dm-kpi-top">
      <span className="dm-kpi-label">{label}</span>
      <div className="dm-kpi-icon">
        <Icon />
      </div>
    </div>
    <div className="dm-kpi-value">{value}</div>
    <div className="dm-kpi-footer">
      <span className={`dm-trend ${up ? "up" : "down"}`}>
        {up ? <TrendingUp /> : <TrendingDown />}
        {change}
      </span>
      <span className="dm-kpi-vs">vs săpt. trecută</span>
    </div>
  </motion.div>
);

/* ── main component ── */
const Dashboard = () => {
  const [aiDismissed, setAiDismissed] = useState<number[]>([]);
  const [actPeriod, setActPeriod] = useState<ActivityPeriod>('saptamana');
  const actData = useMemo(() => genActivityData(actPeriod), [actPeriod]);

  return (
    <>
      {/* Page header */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Dashboard</h1>
          <p>Joi, 22 Mai 2025 · Depozit Central Chișinău</p>
        </div>
        <div className="dm-header-actions">
          <button className="dm-btn dm-btn-secondary">
            <RefreshCw size={13} /> Actualizează
          </button>
          <Link to="/ui-demo/inventory" className="dm-btn dm-btn-primary">
            <ArrowUpRight size={13} /> Inventar complet
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="dm-kpi-grid">
        <KpiCard
          idx={0} label="Valoare stoc total" value="308.4K MDL" raw={308400}
          change="+8.2%" up={true} Icon={Package}
          color="#3B82F6" dim="rgba(59,130,246,0.12)"
        />
        <KpiCard
          idx={1} label="Produse active" value="1,247" raw={1247}
          change="+3.1%" up={true} Icon={Activity}
          color="#10B981" dim="rgba(16,185,129,0.12)"
        />
        <KpiCard
          idx={2} label="Mișcări azi" value="47" raw={47}
          change="-12.5%" up={false} Icon={TrendingUp}
          color="#F59E0B" dim="rgba(245,158,11,0.12)"
        />
        <KpiCard
          idx={3} label="Alerte critice" value="8" raw={8}
          change="+4 noi" up={false} Icon={AlertTriangle}
          color="#EF4444" dim="rgba(239,68,68,0.12)"
        />
      </div>

      {/* Charts row */}
      <div className="dm-charts-grid">
        {/* Area chart — stock trend */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Evoluție valoare stoc</div>
                <div className="dm-card-subtitle">Ultimele 7 zile · MDL</div>
              </div>
              <button className="dm-icon-btn">
                <MoreHorizontal size={15} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={STOCK_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "var(--t-tertiary)", fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(59,130,246,0.2)", strokeWidth: 1 }} />
                <Area
                  type="monotone" dataKey="value"
                  stroke="#3B82F6" strokeWidth={2}
                  fill="url(#stockGrad)"
                  dot={false} activeDot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar chart — categories */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45 }}
        >
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Distribuție categorii</div>
                <div className="dm-card-subtitle">% din valoarea totală</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={CAT_DIST} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {CAT_DIST.map((_, i) => <Cell key={i} fill={CAT_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display: "flex", gap: "0.875rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
              {CAT_DIST.map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom grid — Activity / Critical Stock / AI */}
      <div className="dm-bottom-grid">

        {/* Activity feed */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.45 }}
        >
          <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Activitate recentă</div>
                <div className="dm-card-subtitle">Actualizare în timp real</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div className="dm-live-dot" />
                <span style={{ fontSize: 11, color: "var(--c-green)" }}>Live</span>
              </div>
            </div>
          </div>
          <div className="dm-activity-list">
            {ACTIVITY.map((a) => (
              <div key={a.id} className="dm-activity-item">
                <div className="dm-act-avatar" style={{ background: a.bg + "33", color: a.bg }}>
                  {a.user.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="dm-act-body">
                  <div className="dm-act-line">
                    <strong>{a.user}</strong>
                    {" "}<em>{a.action}</em>
                    {" "}<strong>{a.item}</strong>
                  </div>
                  <div className="dm-act-meta">
                    <span className="dm-act-time">{a.time} în urmă</span>
                    <span className="dm-act-qty">{a.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Critical stock */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.45 }}
        >
          <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Stoc critic</div>
                <div className="dm-card-subtitle">Necesită reaprovizionare urgentă</div>
              </div>
              <Link to="/ui-demo/inventory" className="dm-btn dm-btn-ghost" style={{ height: 26, fontSize: 11 }}>
                <ExternalLink size={11} /> Toate
              </Link>
            </div>
          </div>
          <div className="dm-stock-list">
            {CRITICAL.map((c) => (
              <div key={c.sku} className="dm-stock-row">
                <div className="dm-stock-top">
                  <span className="dm-stock-name">{c.name}</span>
                  <span className="dm-stock-nums">
                    <strong style={{ color: c.color }}>{c.stock}</strong>
                    <span> / {c.min}</span>
                  </span>
                </div>
                <div className="dm-progress-track">
                  <div
                    className="dm-progress-fill"
                    style={{ width: `${c.pct}%`, background: c.color + "AA" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="dm-stock-cat">{c.cat} · {c.sku}</span>
                  <span className="dm-badge dm-badge-critical" style={{ fontSize: "10px" }}>
                    {c.pct < 30 ? "Critic" : "Scăzut"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI insights */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.45 }}
        >
          <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">AI Insights</div>
                <div className="dm-card-subtitle">Analiză predictivă stoc</div>
              </div>
              <div className="dm-ai-badge">
                <Sparkles size={10} /> AI · Beta
              </div>
            </div>
          </div>
          <div className="dm-ai-list">
            {AI_INSIGHTS.filter((_, i) => !aiDismissed.includes(i)).map((ins, i) => (
              <div key={i} className="dm-ai-item">
                <div className="dm-ai-header">
                  <span className="dm-ai-dot" style={{ background: ins.color }} />
                  <span className="dm-ai-title">{ins.title}</span>
                  <span className="dm-ai-conf">{ins.confidence}% conf.</span>
                </div>
                <p className="dm-ai-desc">{ins.desc}</p>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button className="dm-ai-action">
                    <Zap size={10} /> {ins.action}
                  </button>
                  <button
                    className="dm-btn dm-btn-ghost"
                    style={{ height: 24, fontSize: 11, padding: "0 0.5rem" }}
                    onClick={() => setAiDismissed((d) => [...d, i])}
                  >
                    Ignoră
                  </button>
                </div>
              </div>
            ))}
            {aiDismissed.length === AI_INSIGHTS.length && (
              <div className="dm-empty-state">
                <Sparkles />
                <p>Toate sugestiile au fost procesate</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity bar chart */}
      <motion.div
        className="dm-card"
        style={{ marginTop: "1rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.45 }}
      >
        <div className="dm-chart-wrap">
          <div className="dm-card-header">
            <div>
              <div className="dm-card-title">Activitate depozit</div>
              <div className="dm-card-subtitle">
                Mișcări pe {ACT_PERIODS.find(p => p.id === actPeriod)?.label.toLowerCase()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {ACT_PERIODS.map(p => (
                <button key={p.id} onClick={() => setActPeriod(p.id)} style={{
                  padding: "3px 10px", borderRadius: "var(--radius-sm)", fontSize: 11.5,
                  fontWeight: 500, border: "1px solid", cursor: "pointer", transition: "all 0.15s",
                  background: actPeriod === p.id ? "rgba(59,130,246,0.12)" : "transparent",
                  borderColor: actPeriod === p.id ? "rgba(59,130,246,0.35)" : "var(--s-border)",
                  color: actPeriod === p.id ? "var(--c-blue)" : "var(--t-secondary)",
                }}>{p.label}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={actData} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="actBarGradDemo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--s-border)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--t-tertiary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--t-tertiary)" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ background: "var(--s-elevated)", border: "1px solid var(--s-border-2)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "var(--t-secondary)", fontWeight: 600, marginBottom: 4 }}
                formatter={(v) => [`${v} mișcări`, ""]}
                cursor={{ fill: "rgba(59,130,246,0.07)" }}
              />
              <Bar dataKey="value" fill="url(#actBarGradDemo)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
