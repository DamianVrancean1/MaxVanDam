import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart, Loader, Truck, CheckCircle,
  Search, SlidersHorizontal, Plus,
  MapPin, Eye, Edit2, Trash2, MoreHorizontal,
  ChevronLeft, ChevronRight,
} from "lucide-react";

/* ────────────────────────────────────────────
   Types
──────────────────────────────────────────── */
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type Priority    = "urgent" | "high" | "normal" | "low";

interface Order {
  id:       string;
  supplier: string;
  items:    number;
  value:    number;
  status:   OrderStatus;
  priority: Priority;
  eta:      string;
  updated:  string;
  cat:      string;
}

interface ShipmentTrack {
  id:       string;
  courier:  string;
  progress: number;
  step:     string;
  eta:      string;
  from:     string;
  to:       string;
}

/* ────────────────────────────────────────────
   Card entrance variants
──────────────────────────────────────────── */
const CV = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};

/* ────────────────────────────────────────────
   Static mock data
──────────────────────────────────────────── */
const ORDERS: Order[] = [
  { id: "CMD-4821", supplier: "Bosch Romania",    items: 12, value: 14560, status: "shipped",    priority: "high",   eta: "Azi, 16:00",       updated: "2 min",  cat: "Frâne/Filtre" },
  { id: "CMD-4820", supplier: "Continental AG",   items: 8,  value: 9240,  status: "processing", priority: "normal", eta: "Mâine, 10:00",     updated: "15 min", cat: "Suspensie" },
  { id: "CMD-4819", supplier: "Valeo Parts",      items: 5,  value: 6800,  status: "delivered",  priority: "normal", eta: "Livrat",           updated: "1 oră",  cat: "Răcire" },
  { id: "CMD-4818", supplier: "NGK Europe",       items: 24, value: 2880,  status: "pending",    priority: "urgent", eta: "Azi, 18:30",       updated: "3 min",  cat: "Aprindere" },
  { id: "CMD-4817", supplier: "SKF Group",        items: 6,  value: 8100,  status: "shipped",    priority: "high",   eta: "Mâine, 12:00",     updated: "45 min", cat: "Rulmenți" },
  { id: "CMD-4816", supplier: "Gates Industrial", items: 10, value: 7250,  status: "delivered",  priority: "low",    eta: "Livrat",           updated: "3 ore",  cat: "Transmisie" },
  { id: "CMD-4815", supplier: "Brembo SPA",       items: 4,  value: 3920,  status: "cancelled",  priority: "normal", eta: "Anulat",           updated: "5 ore",  cat: "Frâne" },
  { id: "CMD-4814", supplier: "Mann Filter GmbH", items: 30, value: 5400,  status: "delivered",  priority: "normal", eta: "Livrat",           updated: "1 zi",   cat: "Filtre" },
  { id: "CMD-4813", supplier: "Sachs Germany",    items: 3,  value: 4860,  status: "processing", priority: "high",   eta: "Poimâine, 09:00",  updated: "2 ore",  cat: "Suspensie" },
  { id: "CMD-4812", supplier: "Febi Bilstein",    items: 7,  value: 6720,  status: "shipped",    priority: "normal", eta: "Mâine, 14:00",     updated: "4 ore",  cat: "Evacuare" },
];

const DELIVERY_TREND = [
  { day: "Lun", livrate: 8,  intarziate: 1, anulate: 0 },
  { day: "Mar", livrate: 12, intarziate: 2, anulate: 1 },
  { day: "Mie", livrate: 6,  intarziate: 0, anulate: 0 },
  { day: "Joi", livrate: 15, intarziate: 3, anulate: 1 },
  { day: "Vin", livrate: 11, intarziate: 1, anulate: 0 },
  { day: "Sâm", livrate: 4,  intarziate: 0, anulate: 0 },
  { day: "Dum", livrate: 2,  intarziate: 0, anulate: 0 },
];

const SHIPMENT_TRACKING: ShipmentTrack[] = [
  { id: "CMD-4821", courier: "DHL Express", progress: 78, step: "În livrare",      eta: "Azi 16:00",   from: "București",  to: "Chișinău" },
  { id: "CMD-4820", courier: "FAN Courier", progress: 35, step: "Preluat depozit", eta: "Mâine 10:00", from: "Cluj-Napoca", to: "Chișinău" },
  { id: "CMD-4817", courier: "Cargus",      progress: 55, step: "În tranzit",      eta: "Mâine 12:00", from: "Timișoara",  to: "Chișinău" },
  { id: "CMD-4810", courier: "GLS Romania", progress: 92, step: "Vama MD",         eta: "Azi 20:00",   from: "Iași",       to: "Chișinău" },
];

const ACTIVITY_FEED = [
  { id: "CMD-4821", text: "CMD-4821 a fost preluat de DHL Express",           courier: "DH", time: "acum 2 min",  color: "#3B82F6", live: true  },
  { id: "CMD-4820", text: "CMD-4820 confirmat de furnizor Continental AG",    courier: "CA", time: "acum 8 min",  color: "#8B5CF6", live: false },
  { id: "CMD-4818", text: "CMD-4818 introdus în sistem — prioritate urgentă", courier: "NG", time: "acum 12 min", color: "#EF4444", live: false },
  { id: "CMD-4817", text: "CMD-4817 în tranzit prin vama Albița",             courier: "CG", time: "acum 35 min", color: "#F59E0B", live: false },
  { id: "CMD-4810", text: "CMD-4810 a ajuns la vama MD — control vamal",      courier: "GL", time: "acum 1 oră",  color: "#06B6D4", live: false },
  { id: "CMD-4819", text: "CMD-4819 livrat cu succes — confirmat recepție",   courier: "VP", time: "acum 2 ore",  color: "#10B981", live: false },
  { id: "CMD-4816", text: "CMD-4816 livrat — semnat de Andrei M.",            courier: "GI", time: "acum 3 ore",  color: "#10B981", live: false },
  { id: "CMD-4815", text: "CMD-4815 anulat — stoc indisponibil furnizor",     courier: "BS", time: "acum 5 ore",  color: "#475569", live: false },
];

/* ────────────────────────────────────────────
   Config / label maps
──────────────────────────────────────────── */
type TabKey = OrderStatus | "all";

const ORDER_TABS: { key: TabKey; label: string }[] = [
  { key: "all",        label: "Toate" },
  { key: "pending",    label: "Pending" },
  { key: "processing", label: "Procesare" },
  { key: "shipped",    label: "Expediat" },
  { key: "delivered",  label: "Livrat" },
  { key: "cancelled",  label: "Anulat" },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    "Pending",
  processing: "Procesare",
  shipped:    "Expediat",
  delivered:  "Livrat",
  cancelled:  "Anulat",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: "Urgent",
  high:   "Înalt",
  normal: "Normal",
  low:    "Scăzut",
};

/* ────────────────────────────────────────────
   Helper sub-components
──────────────────────────────────────────── */

/** Inline-styled status badge */
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles: Record<OrderStatus, React.CSSProperties> = {
    pending:    { background: "rgba(245,158,11,0.15)",  color: "#F59E0B",  border: "1px solid rgba(245,158,11,0.3)" },
    processing: { background: "rgba(59,130,246,0.15)",  color: "#3B82F6",  border: "1px solid rgba(59,130,246,0.3)" },
    shipped:    { background: "rgba(139,92,246,0.15)",  color: "#A78BFA",  border: "1px solid rgba(139,92,246,0.3)" },
    delivered:  { background: "rgba(16,185,129,0.15)",  color: "#10B981",  border: "1px solid rgba(16,185,129,0.3)" },
    cancelled:  { background: "rgba(71,85,105,0.18)",   color: "#94A3B8",  border: "1px solid rgba(71,85,105,0.3)" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
      ...styles[status],
    }}>
      {STATUS_LABEL[status]}
    </span>
  );
};

/** Inline-styled priority pill */
const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const styles: Record<Priority, React.CSSProperties> = {
    urgent: { background: "rgba(239,68,68,0.15)",   color: "#EF4444",  border: "1px solid rgba(239,68,68,0.3)" },
    high:   { background: "rgba(249,115,22,0.15)",  color: "#FB923C",  border: "1px solid rgba(249,115,22,0.3)" },
    normal: { background: "rgba(100,116,139,0.12)", color: "#94A3B8",  border: "1px solid rgba(100,116,139,0.25)" },
    low:    { background: "rgba(71,85,105,0.10)",   color: "#64748B",  border: "1px solid rgba(71,85,105,0.2)" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 7px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
      ...styles[priority],
    }}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
};

/** Delivery trend chart tooltip */
const DeliveryTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dm-custom-tooltip">
      <p style={{ marginBottom: "0.3rem", fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: "0.1rem 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ────────────────────────────────────────────
   Main component
──────────────────────────────────────────── */
const Comenzi = () => {
  const [tab, setTab]       = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage]     = useState(1);
  const PAGE_SIZE = 10;

  /* filtered + paginated orders */
  const filtered = useMemo(() => {
    let data = ORDERS;
    if (tab !== "all") data = data.filter(o => o.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q) ||
        o.cat.toLowerCase().includes(q)
      );
    }
    return data;
  }, [tab, search]);

  const pageCount  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* tab counts */
  const tabCounts = useMemo(() => ({
    all:        ORDERS.length,
    pending:    ORDERS.filter(o => o.status === "pending").length,
    processing: ORDERS.filter(o => o.status === "processing").length,
    shipped:    ORDERS.filter(o => o.status === "shipped").length,
    delivered:  ORDERS.filter(o => o.status === "delivered").length,
    cancelled:  ORDERS.filter(o => o.status === "cancelled").length,
  }), []);

  /* urgent/high in-flight orders */
  const urgentOrders = ORDERS.filter(
    o => (o.priority === "urgent" || o.priority === "high") && o.status !== "delivered" && o.status !== "cancelled"
  );

  /* select helpers */
  const allVisibleSelected = visible.length > 0 && visible.every(o => selected.has(o.id));
  const toggleAll = () =>
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map(o => o.id)));
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  return (
    <div>
      {/* ── 1. Page Header ── */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Comenzi</h1>
          <p>Management comenzi &amp; livrări — sistem logistic enterprise</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search */}
          <div className="dm-inv-search" style={{ minWidth: 220 }}>
            <Search size={14} />
            <input
              placeholder="Caută comandă, furnizor..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="dm-inv-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>

          <button className="dm-btn dm-btn-ghost">
            <SlidersHorizontal size={14} /> Filtre
          </button>

          <button className="dm-btn dm-btn-primary">
            <Plus size={14} /> Comandă Nouă
          </button>

          {/* Live dot */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 0.75rem", height: 32,
            background: "var(--s-surface)", border: "1px solid var(--s-border)",
            borderRadius: "var(--radius-sm)",
          }}>
            <div className="dm-live-dot" />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--c-green)" }}>Live tracking</span>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Grid ── */}
      <div className="dm-kpi-grid">
        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-blue)", "--kpi-dim": "var(--c-blue-dim)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={0}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Total Comenzi</span>
            <div className="dm-kpi-icon"><ShoppingCart /></div>
          </div>
          <div className="dm-kpi-value">1,247</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up">+18 azi</span>
            <span className="dm-kpi-vs">total sistem</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-amber)", "--kpi-dim": "var(--c-amber-dim)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={1}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">În Procesare</span>
            <div className="dm-kpi-icon"><Loader /></div>
          </div>
          <div className="dm-kpi-value">23</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend warn">8 urgente</span>
            <span className="dm-kpi-vs">necesită acțiune</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-purple)", "--kpi-dim": "var(--c-purple-dim)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={2}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">În Tranzit</span>
            <div className="dm-kpi-icon"><Truck /></div>
          </div>
          <div className="dm-kpi-value">18</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend down">4 cu întârziere</span>
            <span className="dm-kpi-vs">monitorizate live</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ "--kpi-color": "var(--c-green)", "--kpi-dim": "var(--c-green-dim)" } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={3}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Livrate Azi</span>
            <div className="dm-kpi-icon"><CheckCircle /></div>
          </div>
          <div className="dm-kpi-value">41</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up">284K MDL</span>
            <span className="dm-kpi-vs">valoare livrată</span>
          </div>
        </motion.div>
      </div>

      {/* ── 3. Urgent Deliveries widget ── */}
      <motion.div
        className="dm-card"
        style={{ marginBottom: "1.25rem" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="dm-card-header" style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
          <div>
            <div className="dm-card-title">Livrări Urgente &amp; Prioritare</div>
            <div className="dm-card-subtitle">{urgentOrders.length} comenzi active cu prioritate ridicată</div>
          </div>
        </div>
        <div style={{ padding: "1rem 1.25rem", display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none" }}>
          {urgentOrders.map((order, i) => {
            const isUrgent  = order.priority === "urgent";
            const accentColor = isUrgent ? "var(--c-red)" : "var(--c-amber)";
            const accentDim   = isUrgent ? "rgba(239,68,68,0.10)" : "rgba(245,158,11,0.10)";
            /* fake fulfillment % per order */
            const fulfillPct  = order.status === "shipped" ? 78 : order.status === "processing" ? 40 : 15;

            return (
              <motion.div
                key={order.id}
                variants={CV}
                initial="hidden"
                animate="visible"
                custom={i}
                style={{
                  minWidth: 220, maxWidth: 240, flex: "0 0 220px",
                  background: "var(--s-surface)",
                  border: "1px solid var(--s-border)",
                  borderLeft: `3px solid ${accentColor}`,
                  borderRadius: "var(--radius)",
                  padding: "0.85rem 0.9rem",
                  display: "flex", flexDirection: "column", gap: 8,
                  background: accentDim,
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--t-primary)" }}>
                    {order.id}
                  </span>
                  <StatusBadge status={order.status} />
                </div>

                {/* Supplier */}
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t-secondary)" }}>
                  {order.supplier}
                </div>

                {/* Value + ETA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--t-primary)", fontVariantNumeric: "tabular-nums" }}>
                    {order.value.toLocaleString("ro-MD")} MDL
                  </span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, padding: "2px 7px",
                    borderRadius: 999, whiteSpace: "nowrap",
                    background: isUrgent ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                    color: isUrgent ? "#EF4444" : "#F59E0B",
                    border: `1px solid ${isUrgent ? "rgba(239,68,68,0.35)" : "rgba(245,158,11,0.35)"}`,
                  }}>
                    {order.eta}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: "var(--t-muted)" }}>Fulfillment</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: accentColor }}>{fulfillPct}%</span>
                  </div>
                  <div className="dm-progress-track">
                    <div
                      className="dm-progress-fill"
                      style={{ width: `${fulfillPct}%`, background: accentColor }}
                    />
                  </div>
                </div>

                {/* Priority */}
                <PriorityBadge priority={order.priority} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 4. Orders table with tabs ── */}
      <motion.div
        className="dm-card"
        style={{ marginBottom: "1.25rem" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
      >
        {/* Tab bar */}
        <div className="dm-inv-tabs" style={{ borderBottom: "1px solid var(--s-border)", margin: 0, padding: "0 1.25rem" }}>
          {ORDER_TABS.map(t => (
            <button
              key={t.key}
              className={`dm-inv-tab${tab === t.key ? " active" : ""}`}
              onClick={() => { setTab(t.key); setPage(1); }}
            >
              {t.label}
              <span className="dm-inv-tab-count">{tabCounts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="dm-table-wrap" style={{ border: "none", borderRadius: 0 }}>
          <table className="dm-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>
                  <input
                    type="checkbox"
                    className="dm-checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th style={{ width: 110 }}># Comandă</th>
                <th>Furnizor</th>
                <th style={{ width: 90, textAlign: "center" }}>Articole</th>
                <th style={{ width: 130, textAlign: "right" }}>Valoare (MDL)</th>
                <th style={{ width: 120 }}>Status</th>
                <th style={{ width: 100 }}>Prioritate</th>
                <th style={{ width: 150 }}>ETA</th>
                <th style={{ width: 110 }}>Actualizat</th>
                <th style={{ width: 80 }} />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <div className="dm-table-empty">
                        <ShoppingCart size={32} />
                        <p>Nicio comandă găsită</p>
                        <span>Încearcă să schimbi filtrul sau termenul de căutare</span>
                      </div>
                    </td>
                  </tr>
                ) : visible.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    className={selected.has(order.id) ? "dm-tr-selected" : ""}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={i}
                    layout
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="dm-checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleOne(order.id)}
                      />
                    </td>
                    <td>
                      <span className="dm-td-sku">{order.id}</span>
                    </td>
                    <td>
                      <div className="dm-td-name-wrap">
                        <strong>{order.supplier}</strong>
                        <span><span className="dm-cat-pill">{order.cat}</span></span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "var(--t-primary)" }}>
                      {order.items}
                    </td>
                    <td className="dm-td-price">{order.value.toLocaleString("ro-MD")}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td><PriorityBadge priority={order.priority} /></td>
                    <td className="dm-td-updated" style={{ color: "var(--t-secondary)", fontWeight: 500 }}>
                      {order.eta}
                    </td>
                    <td className="dm-td-updated">acum {order.updated}</td>
                    <td>
                      <div className="dm-row-actions">
                        <button className="dm-row-act-btn" title="Vizualizează"><Eye size={13} /></button>
                        <button className="dm-row-act-btn" title="Editează"><Edit2 size={13} /></button>
                        <button className="dm-row-act-btn dm-row-act-danger" title="Șterge"><Trash2 size={13} /></button>
                        <button className="dm-row-act-btn" title="Mai multe"><MoreHorizontal size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="dm-pagination">
          <span className="dm-pag-info">
            Afișând{" "}
            <strong>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong>{" "}
            din <strong>{filtered.length}</strong> comenzi
          </span>
          <div className="dm-pag-btns">
            <button
              className="dm-pag-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`dm-pag-btn${page === n ? " active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            {pageCount > 5 && (
              <span style={{ color: "var(--t-tertiary)", fontSize: 12, padding: "0 2px" }}>…</span>
            )}
            <button
              className="dm-pag-btn"
              disabled={page >= pageCount}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── 5. Charts + Tracking (2-col) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1rem", marginBottom: "1.25rem" }}>

        {/* LEFT — Delivery trend AreaChart */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
        >
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Evoluție Livrări — 7 Zile</div>
                <div className="dm-card-subtitle">Livrate, întârziate și anulate per zi</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                {[
                  { key: "livrate",   color: "#10B981", label: "Livrate" },
                  { key: "intarziate",color: "#F59E0B", label: "Întârziate" },
                  { key: "anulate",   color: "#EF4444", label: "Anulate" },
                ].map(l => (
                  <div key={l.key} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={DELIVERY_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradLivrate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradIntarziate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAnulate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--t-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DeliveryTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="livrate"    name="Livrate"    stroke="#10B981" strokeWidth={2} fill="url(#gradLivrate)"    dot={false} activeDot={{ r: 4, fill: "#10B981", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="intarziate" name="Întârziate" stroke="#F59E0B" strokeWidth={2} fill="url(#gradIntarziate)" dot={false} activeDot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="anulate"    name="Anulate"    stroke="#EF4444" strokeWidth={2} fill="url(#gradAnulate)"    dot={false} activeDot={{ r: 4, fill: "#EF4444", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RIGHT — Shipment tracking list */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.45 }}
        >
          <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
            <div className="dm-card-title">Tracking Expedieri</div>
            <div className="dm-card-subtitle">{SHIPMENT_TRACKING.length} expedieri active</div>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {SHIPMENT_TRACKING.map((ship, i) => {
              const progressColor =
                ship.progress >= 80 ? "#10B981" :
                ship.progress >= 50 ? "#A78BFA" : "#F59E0B";

              return (
                <div
                  key={ship.id}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderBottom: i < SHIPMENT_TRACKING.length - 1 ? "1px solid var(--s-border)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = "var(--s-hover)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = "")}
                >
                  {/* ID + Courier */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--t-primary)" }}>
                      {ship.id}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--t-tertiary)", fontWeight: 600 }}>{ship.courier}</span>
                  </div>

                  {/* From → To */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 11, color: "var(--t-muted)" }}>
                    <MapPin size={10} style={{ flexShrink: 0 }} />
                    <span>{ship.from}</span>
                    <span style={{ color: "var(--s-border-2)" }}>→</span>
                    <span style={{ color: "var(--t-secondary)", fontWeight: 600 }}>{ship.to}</span>
                  </div>

                  {/* Progress bar + % */}
                  <div style={{ marginBottom: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, color: "var(--t-muted)" }}>{ship.step}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: progressColor }}>{ship.progress}%</span>
                    </div>
                    <div className="dm-progress-track">
                      <div
                        className="dm-progress-fill"
                        style={{ width: `${ship.progress}%`, background: progressColor }}
                      />
                    </div>
                  </div>

                  {/* ETA badge */}
                  <span style={{
                    fontSize: 10.5, fontWeight: 600,
                    padding: "2px 7px", borderRadius: 999,
                    background: "rgba(59,130,246,0.12)",
                    color: "#60A5FA",
                    border: "1px solid rgba(59,130,246,0.25)",
                  }}>
                    ETA: {ship.eta}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── 6. Activity Feed ── */}
      <motion.div
        className="dm-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.45 }}
      >
        <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--s-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="dm-card-title" style={{ margin: 0 }}>Activitate Comenzi</div>
            <div className="dm-live-dot" />
          </div>
          <div className="dm-card-subtitle">Evenimente recente din sistemul logistic</div>
        </div>
        <div style={{ padding: "0.5rem 0" }}>
          {ACTIVITY_FEED.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="dm-activity-item"
            >
              <div
                className="dm-act-avatar"
                style={{ background: item.color + "22", color: item.color, borderColor: item.color + "44" }}
              >
                {item.courier}
              </div>
              <div className="dm-act-body">
                <div className="dm-act-line">
                  <span style={{ fontSize: 12.5, color: "var(--t-primary)", fontWeight: item.live ? 600 : 400 }}>
                    {item.text}
                  </span>
                  {item.live && (
                    <span style={{
                      marginLeft: 6, fontSize: 10, fontWeight: 700,
                      padding: "1px 6px", borderRadius: 999,
                      background: "rgba(16,185,129,0.15)", color: "#10B981",
                      border: "1px solid rgba(16,185,129,0.3)",
                    }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span className="dm-act-time">{item.time}</span>
                  <span style={{
                    fontFamily: "monospace", fontSize: 10.5, fontWeight: 600,
                    color: item.color, opacity: 0.8,
                  }}>
                    {item.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default Comenzi;
