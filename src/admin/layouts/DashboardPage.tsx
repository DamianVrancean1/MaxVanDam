import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Package, TrendingUp, TrendingDown, Activity, AlertTriangle,
  ArrowUpRight, Sparkles, Zap, RefreshCw,
  MoreHorizontal, ExternalLink,
} from 'lucide-react';
import { getProducts, getInventoryNotifications } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

/* ── helpers ── */
function fmtMdl(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M MDL';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K MDL';
  return n + ' MDL';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'acum';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h`;
  return `${Math.floor(hrs / 24)}z`;
}

const CAT_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];
const DAYS       = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];
const HMAP_COLS  = ['L', 'M', 'M', 'J', 'V', 'S', 'D', 'L', 'M', 'M', 'J', 'V'];

const CardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dm-custom-tooltip">
      <p className="label">{label}</p>
      <p style={{ color: '#3B82F6', fontWeight: 700 }}>
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
const KpiCard = ({ label, value, change, up, Icon, color, dim, idx }: {
  label: string; value: string; change: string; up: boolean;
  Icon: any; color: string; dim: string; idx: number;
}) => (
  <motion.div
    className="dm-kpi-card"
    style={{ '--kpi-color': color, '--kpi-dim': dim } as React.CSSProperties}
    variants={CardVariants}
    initial="hidden"
    animate="visible"
    custom={idx}
  >
    <div className="dm-kpi-top">
      <span className="dm-kpi-label">{label}</span>
      <div className="dm-kpi-icon"><Icon /></div>
    </div>
    <div className="dm-kpi-value">{value}</div>
    <div className="dm-kpi-footer">
      <span className={`dm-trend ${up ? 'up' : 'down'}`}>
        {up ? <TrendingUp /> : <TrendingDown />}
        {change}
      </span>
      <span className="dm-kpi-vs">vs săpt. trecută</span>
    </div>
  </motion.div>
);

/* ── main component ── */
const DashboardPage = () => {
  const { user } = useAuth();
  const [aiDismissed, setAiDismissed] = useState<number[]>([]);

  const products      = useMemo(() => getProducts(), []);
  const notifications = useMemo(() => getInventoryNotifications(), []);

  /* KPI computations */
  const totalValue = useMemo(
    () => products.reduce((s, p) => s + p.price * p.stock, 0),
    [products],
  );

  const criticalProducts = useMemo(
    () => products.filter(p => p.stock > 0 && p.stock < 5).sort((a, b) => a.stock - b.stock),
    [products],
  );

  const outOfStock = useMemo(
    () => products.filter(p => p.stock === 0),
    [products],
  );

  const criticalCount = criticalProducts.length + outOfStock.length;

  /* Category distribution */
  const catDist = useMemo(() => {
    const map: Record<string, { count: number; value: number }> = {};
    products.forEach(p => {
      if (!map[p.category]) map[p.category] = { count: 0, value: 0 };
      map[p.category].count += 1;
      map[p.category].value += p.price * p.stock;
    });
    return Object.entries(map)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([name, d]) => ({
        name,
        value: Math.round((d.count / products.length) * 100),
        amount: Math.round(d.value),
      }));
  }, [products]);

  /* Simulated 7-day stock trend (deterministic, not random on every render) */
  const stockTrend = useMemo(() => {
    const base    = totalValue;
    const factors = [0.91, 0.93, 0.95, 0.96, 0.98, 0.99, 1.0];
    return DAYS.map((day, i) => ({
      day,
      value: Math.round(base * factors[i]),
      moves: [12, 18, 9, 22, 28, 15, 7][i],
    }));
  }, [totalValue]);

  /* Critical stock widget — top 5 */
  const criticalWidget = useMemo(
    () => [...outOfStock, ...criticalProducts].slice(0, 5).map(p => ({
      sku:   `SKU-${p.id}`,
      name:  p.name,
      stock: p.stock,
      min:   10,
      pct:   Math.min(100, Math.round((p.stock / 10) * 100)),
      cat:   p.category,
      color: p.stock === 0 || p.stock < 3 ? '#EF4444' : '#F59E0B',
    })),
    [criticalProducts, outOfStock],
  );

  /* Activity feed — blend real notifications with contextual static entries */
  const activity = useMemo(() => {
    const from_notifs = notifications.slice(0, 4).map(n => ({
      id:     n.id,
      user:   'System',
      action: 'Alertă stoc',
      item:   n.productName,
      qty:    'stoc 0',
      time:   timeAgo(n.createdAt),
      bg:     '#EF4444',
    }));
    const static_items = [
      { id: -1, user: user?.username ?? 'Admin', action: 'a accesat', item: 'Panoul de control', qty: '', time: 'acum', bg: '#3B82F6' },
      { id: -2, user: 'System', action: 'Sincronizare', item: 'Date inventar', qty: `${products.length} produse`, time: '5 min', bg: '#10B981' },
    ];
    return [...static_items, ...from_notifs].slice(0, 6);
  }, [notifications, user, products.length]);

  /* AI Insights — generated from real data */
  const aiInsights = useMemo(() => {
    const ins = [];
    if (outOfStock.length > 0) {
      ins.push({
        color: '#EF4444',
        title: 'Produse cu stoc zero',
        desc:  `${outOfStock.length} produse sunt complet epuizate. "${outOfStock[0]?.name}" necesită reaprovizionare urgentă.`,
        confidence: 99,
        action: 'Vezi produsele',
      });
    }
    if (criticalProducts.length > 0) {
      ins.push({
        color: '#F59E0B',
        title: 'Risc stoc critic',
        desc:  `${criticalProducts.length} produse au stoc sub 5 unități. "${criticalProducts[0]?.name}" are ${criticalProducts[0]?.stock} buc rămase.`,
        confidence: 92,
        action: 'Planifică comandă',
      });
    }
    ins.push({
      color: '#10B981',
      title: 'Valoare totală stoc',
      desc:  `Valoarea totală a stocului este ${fmtMdl(totalValue)}, distribuită în ${catDist.length} categorii principale.`,
      confidence: 100,
      action: 'Raport complet',
    });
    return ins;
  }, [outOfStock, criticalProducts, totalValue, catDist]);

  /* Heatmap — stable across renders (no random on re-render) */
  const heatmap = useMemo(
    () => Array.from({ length: 84 }, (_, i) => ((Math.sin(i * 2.3) + 1) / 2) * 0.9 + 0.05),
    [],
  );

  const today = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      {/* Page header */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Dashboard</h1>
          <p style={{ textTransform: 'capitalize' }}>{today} · {user?.username ?? 'Admin'}</p>
        </div>
        <div className="dm-header-actions">
          <button className="dm-btn dm-btn-secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={13} /> Actualizează
          </button>
          <Link to="/admin/products" className="dm-btn dm-btn-primary">
            <ArrowUpRight size={13} /> Inventar complet
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="dm-kpi-grid">
        <KpiCard
          idx={0} label="Valoare stoc total" value={fmtMdl(totalValue)}
          change="date reale" up={true} Icon={Package}
          color="#3B82F6" dim="rgba(59,130,246,0.12)"
        />
        <KpiCard
          idx={1} label="Produse active" value={products.length.toLocaleString()}
          change={`${products.length} total`} up={true} Icon={Activity}
          color="#10B981" dim="rgba(16,185,129,0.12)"
        />
        <KpiCard
          idx={2} label="Categorii" value={catDist.length.toString()}
          change={`${catDist[0]?.name ?? '—'} top`} up={true} Icon={TrendingUp}
          color="#F59E0B" dim="rgba(245,158,11,0.12)"
        />
        <KpiCard
          idx={3} label="Stoc critic" value={criticalCount.toString()}
          change={criticalCount > 0 ? `${outOfStock.length} epuizate` : 'Totul OK'}
          up={criticalCount === 0} Icon={AlertTriangle}
          color="#EF4444" dim="rgba(239,68,68,0.12)"
        />
      </div>

      {/* Charts row */}
      <div className="dm-charts-grid">

        {/* Area chart — stock trend */}
        <motion.div className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}>
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Evoluție valoare stoc</div>
                <div className="dm-card-subtitle">Ultimele 7 zile · MDL</div>
              </div>
              <button className="dm-icon-btn"><MoreHorizontal size={15} /></button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stockTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminStockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--t-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: 'var(--t-tertiary)', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59,130,246,0.2)', strokeWidth: 1 }} />
                <Area
                  type="monotone" dataKey="value"
                  stroke="#3B82F6" strokeWidth={2}
                  fill="url(#adminStockGrad)"
                  dot={false} activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar chart — categories */}
        <motion.div className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45 }}>
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Distribuție categorii</div>
                <div className="dm-card-subtitle">% din numărul total de produse</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={catDist} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--t-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--t-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {catDist.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              {catDist.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--t-tertiary)' }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom grid — Activity / Critical stock / AI */}
      <div className="dm-bottom-grid">

        {/* Activity feed */}
        <motion.div className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.45 }}>
          <div style={{ padding: '1.1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--s-border)' }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Activitate recentă</div>
                <div className="dm-card-subtitle">Date din sistem</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div className="dm-live-dot" />
                <span style={{ fontSize: 11, color: 'var(--c-green)' }}>Live</span>
              </div>
            </div>
          </div>
          <div className="dm-activity-list">
            {activity.map(a => (
              <div key={a.id} className="dm-activity-item">
                <div className="dm-act-avatar" style={{ background: a.bg + '33', color: a.bg }}>
                  {a.user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="dm-act-body">
                  <div className="dm-act-line">
                    <strong>{a.user}</strong>
                    {' '}<em>{a.action}</em>
                    {' '}<strong>{a.item}</strong>
                  </div>
                  <div className="dm-act-meta">
                    <span className="dm-act-time">{a.time} în urmă</span>
                    {a.qty && <span className="dm-act-qty">{a.qty}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Critical stock */}
        <motion.div className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.45 }}>
          <div style={{ padding: '1.1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--s-border)' }}>
            <div className="dm-card-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="dm-card-title">Stoc critic</div>
                <div className="dm-card-subtitle">Necesită reaprovizionare urgentă</div>
              </div>
              <Link to="/admin/products" className="dm-btn dm-btn-ghost" style={{ height: 26, fontSize: 11 }}>
                <ExternalLink size={11} /> Toate
              </Link>
            </div>
          </div>
          <div className="dm-stock-list">
            {criticalWidget.length > 0 ? criticalWidget.map(c => (
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
                    style={{ width: `${c.pct}%`, background: c.color + 'AA' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="dm-stock-cat">{c.cat} · {c.sku}</span>
                  <span className="dm-badge dm-badge-critical" style={{ fontSize: '10px' }}>
                    {c.pct < 30 ? 'Critic' : 'Scăzut'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="dm-empty-state">
                <Package />
                <p>Nicio alertă de stoc</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.45 }}>
          <div style={{ padding: '1.1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--s-border)' }}>
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
            {aiInsights.filter((_, i) => !aiDismissed.includes(i)).map((ins, i) => (
              <div key={i} className="dm-ai-item">
                <div className="dm-ai-header">
                  <span className="dm-ai-dot" style={{ background: ins.color }} />
                  <span className="dm-ai-title">{ins.title}</span>
                  <span className="dm-ai-conf">{ins.confidence}% conf.</span>
                </div>
                <p className="dm-ai-desc">{ins.desc}</p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="dm-ai-action">
                    <Zap size={10} /> {ins.action}
                  </button>
                  <button
                    className="dm-btn dm-btn-ghost"
                    style={{ height: 24, fontSize: 11, padding: '0 0.5rem' }}
                    onClick={() => setAiDismissed(d => [...d, i])}
                  >
                    Ignoră
                  </button>
                </div>
              </div>
            ))}
            {aiDismissed.length === aiInsights.length && (
              <div className="dm-empty-state">
                <Sparkles />
                <p>Toate sugestiile au fost procesate</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Warehouse heatmap */}
      <motion.div className="dm-card" style={{ marginTop: '1rem' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.45 }}>
        <div className="dm-chart-wrap">
          <div className="dm-card-header">
            <div>
              <div className="dm-card-title">Activitate depozit</div>
              <div className="dm-card-subtitle">Intensitate mișcări pe zone · ultimele 12 zile</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, color: 'var(--t-tertiary)' }}>
              <span>Mai puțin</span>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                <span key={i} style={{ width: 12, height: 12, background: '#3B82F6', opacity: op, borderRadius: 2, display: 'inline-block' }} />
              ))}
              <span>Mai mult</span>
            </div>
          </div>
          <div className="dm-heatmap-grid">
            {heatmap.map((val, i) => (
              <div key={i} className="dm-hm-cell"
                style={{ opacity: Math.max(0.06, val) }}
                title={`Activitate: ${Math.round(val * 100)}%`}
              />
            ))}
          </div>
          <div className="dm-hm-labels">
            {HMAP_COLS.map((l, i) => (
              <div key={i} className="dm-hm-label">{l}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardPage;
