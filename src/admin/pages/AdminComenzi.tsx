import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ShoppingCart, Loader, Truck, CheckCircle,
  Search, Plus, X, Check, AlertTriangle,
  MapPin, Trash2, MoreHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/apiClient';

/* ── types ── */
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type Priority    = 'urgent' | 'high' | 'normal' | 'low';

interface Order {
  id:                number;
  supplierName:      string;
  itemsJson:         string;
  itemsCount:        number;
  totalValue:        number;
  status:            OrderStatus;
  priority:          Priority;
  category:          string;
  estimatedDelivery: string | null;
  createdAt:         string;
  updatedAt:         string;
}

/* ── constants ── */
const PAGE_SIZE = 10;

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Pending',
  processing: 'Procesare',
  shipped:    'Expediat',
  delivered:  'Livrat',
  cancelled:  'Anulat',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: 'Urgent',
  high:   'Înalt',
  normal: 'Normal',
  low:    'Scăzut',
};

const ORDER_TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all',        label: 'Toate' },
  { key: 'pending',    label: 'Pending' },
  { key: 'processing', label: 'Procesare' },
  { key: 'shipped',    label: 'Expediat' },
  { key: 'delivered',  label: 'Livrat' },
  { key: 'cancelled',  label: 'Anulat' },
];

const DAYS = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

/* ── animation variants ── */
const CV = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const rowVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
  exit: { opacity: 0, x: -10, transition: { duration: 0.18 } },
};

/* ── badges ── */
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles: Record<OrderStatus, React.CSSProperties> = {
    pending:    { background: 'rgba(245,158,11,0.15)',  color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' },
    processing: { background: 'rgba(59,130,246,0.15)',  color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' },
    shipped:    { background: 'rgba(139,92,246,0.15)',  color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' },
    delivered:  { background: 'rgba(16,185,129,0.15)',  color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' },
    cancelled:  { background: 'rgba(71,85,105,0.18)',   color: '#94A3B8', border: '1px solid rgba(71,85,105,0.3)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
      ...styles[status],
    }}>
      {STATUS_LABEL[status]}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const styles: Record<Priority, React.CSSProperties> = {
    urgent: { background: 'rgba(239,68,68,0.15)',   color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' },
    high:   { background: 'rgba(249,115,22,0.15)',  color: '#FB923C', border: '1px solid rgba(249,115,22,0.3)' },
    normal: { background: 'rgba(100,116,139,0.12)', color: '#94A3B8', border: '1px solid rgba(100,116,139,0.25)' },
    low:    { background: 'rgba(71,85,105,0.10)',   color: '#64748B', border: '1px solid rgba(71,85,105,0.2)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
      ...styles[priority],
    }}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
};

/* ── tooltip ── */
const DeliveryTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dm-custom-tooltip">
      <p style={{ marginBottom: '0.3rem', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, margin: '0.1rem 0' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── toast ── */
type ToastData = { msg: string; ok: boolean };
const Toast = ({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <motion.div
      className={`dm-toast ${toast.ok ? 'success' : 'error'}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      {toast.ok ? <Check size={14} /> : <AlertTriangle size={14} />}
      {toast.msg}
    </motion.div>
  );
};

/* ── confirm dialog ── */
const ConfirmDialog = ({
  msg, onConfirm, onCancel,
}: {
  msg:       string;
  onConfirm: () => void;
  onCancel:  () => void;
}) => (
  <motion.div
    className="dm-modal-overlay"
    style={{ alignItems: 'center', justifyContent: 'center' }}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="dm-confirm-box"
      initial={{ scale: 0.90, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.90, opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="dm-confirm-icon"><AlertTriangle size={20} /></div>
      <div className="dm-confirm-title">Confirmare ștergere</div>
      <p className="dm-confirm-msg">{msg}</p>
      <div className="dm-confirm-actions">
        <button className="dm-btn dm-btn-ghost" onClick={onCancel}>Anulează</button>
        <button className="dm-btn dm-btn-danger" onClick={onConfirm}>Șterge</button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── create order drawer ── */
const EMPTY_ORDER_FORM = {
  supplierName: '', category: '', itemsCount: '',
  totalValue: '', priority: 'normal', status: 'pending',
  estimatedDelivery: '',
};
type OrderForm = typeof EMPTY_ORDER_FORM;

const CreateOrderModal = ({
  onSave, onClose,
}: {
  onSave:  (data: OrderForm) => void;
  onClose: () => void;
}) => {
  const [form, setForm]     = useState<OrderForm>({ ...EMPTY_ORDER_FORM });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});

  const set    = (k: keyof OrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const setNum = (k: keyof OrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value.replace(/[^0-9.]/g, '') }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.supplierName.trim()) errs.supplierName = 'Câmp obligatoriu';
    if (!form.category.trim())     errs.category = 'Câmp obligatoriu';
    if (!form.totalValue || Number(form.totalValue) <= 0) errs.totalValue = 'Valoare invalidă';
    if (!form.itemsCount || Number(form.itemsCount) <= 0) errs.itemsCount = 'Câmp obligatoriu';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <motion.div
      className="dm-modal-overlay"
      style={{ alignItems: 'stretch', justifyContent: 'flex-end' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="dm-drawer"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0,  opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const }}
        onClick={e => e.stopPropagation()}
      >
        <div className="dm-drawer-hd">
          <div>
            <div className="dm-card-title">Comandă nouă</div>
            <div className="dm-card-subtitle">Adaugă comandă de aprovizionare</div>
          </div>
          <button className="dm-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="dm-drawer-body">
          <form id="order-form" onSubmit={handleSubmit} noValidate>
            <div className="dm-form-2col">
              <div className="dm-form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="dm-form-label">Furnizor *</label>
                <input className={`dm-input${errors.supplierName ? ' err' : ''}`} value={form.supplierName} onChange={set('supplierName')} placeholder="Ex: Bosch Romania" />
                {errors.supplierName && <span className="dm-form-err">{errors.supplierName}</span>}
              </div>
              <div className="dm-form-field">
                <label className="dm-form-label">Categorie *</label>
                <input className={`dm-input${errors.category ? ' err' : ''}`} value={form.category} onChange={set('category')} placeholder="Ex: Frâne, Filtre" />
                {errors.category && <span className="dm-form-err">{errors.category}</span>}
              </div>
              <div className="dm-form-field">
                <label className="dm-form-label">Nr. articole *</label>
                <input className={`dm-input${errors.itemsCount ? ' err' : ''}`} value={form.itemsCount} onChange={setNum('itemsCount')} inputMode="numeric" placeholder="0" />
                {errors.itemsCount && <span className="dm-form-err">{errors.itemsCount}</span>}
              </div>
              <div className="dm-form-field">
                <label className="dm-form-label">Valoare totală (MDL) *</label>
                <input className={`dm-input${errors.totalValue ? ' err' : ''}`} value={form.totalValue} onChange={setNum('totalValue')} inputMode="decimal" placeholder="0" />
                {errors.totalValue && <span className="dm-form-err">{errors.totalValue}</span>}
              </div>
              <div className="dm-form-field">
                <label className="dm-form-label">Prioritate</label>
                <select className="dm-input dm-select" value={form.priority} onChange={set('priority')}>
                  <option value="urgent">Urgent</option>
                  <option value="high">Înalt</option>
                  <option value="normal">Normal</option>
                  <option value="low">Scăzut</option>
                </select>
              </div>
              <div className="dm-form-field">
                <label className="dm-form-label">Status inițial</label>
                <select className="dm-input dm-select" value={form.status} onChange={set('status')}>
                  <option value="pending">Pending</option>
                  <option value="processing">Procesare</option>
                </select>
              </div>
              <div className="dm-form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="dm-form-label">ETA estimat</label>
                <input className="dm-input" type="datetime-local" value={form.estimatedDelivery} onChange={set('estimatedDelivery')} />
              </div>
            </div>
          </form>
        </div>
        <div className="dm-drawer-ft">
          <button type="button" className="dm-btn dm-btn-ghost" onClick={onClose}>Anulează</button>
          <button type="submit" form="order-form" className="dm-btn dm-btn-primary">
            <Check size={13} /> Creează comanda
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── skeleton row ── */
const SkeletonRow = () => (
  <tr>
    {[44, 110, 240, 90, 130, 120, 100, 150, 80].map((w, i) => (
      <td key={i} style={{ padding: '0.75rem 1rem' }}>
        <div style={{ height: 12, borderRadius: 4, background: 'var(--s-surface-3)', width: w * 0.6, animation: 'dmPulse 1.5s ease infinite' }} />
      </td>
    ))}
  </tr>
);

/* ── ETA display helper ── */
function fmtEta(dt: string | null): string {
  if (!dt) return '—';
  const d = new Date(dt);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffMs < 0) return 'Depășit';
  if (diffH < 2)  return `~${Math.max(1, Math.floor(diffMs / 60000))} min`;
  if (diffH < 24) return `Azi, ${d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`;
  const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString())
    return `Mâine, ${d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
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

/* ── main component ── */
const AdminComenzi = () => {
  const { isAdmin } = useAuth();
  const admin = isAdmin();

  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [tab, setTab]         = useState<OrderStatus | 'all'>('all');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [showCreate, setShowCreate]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [toast, setToast]               = useState<ToastData | null>(null);
  const [patchingId, setPatchingId]     = useState<number | null>(null);

  /* ── fetch orders ── */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch('/api/orders/list');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as Order[];
      setOrders(data);
    } catch (e: any) {
      setError(e.message ?? 'Eroare la încărcarea comenzilor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* ── filter + paginate ── */
  const filtered = useMemo(() => {
    let data = orders;
    if (tab !== 'all') data = data.filter(o => o.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(o =>
        o.supplierName.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)     ||
        `cmd-${o.id}`.includes(q)
      );
    }
    return data;
  }, [orders, tab, search]);

  const tabCounts = useMemo(() => ({
    all:        orders.length,
    pending:    orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped:    orders.filter(o => o.status === 'shipped').length,
    delivered:  orders.filter(o => o.status === 'delivered').length,
    cancelled:  orders.filter(o => o.status === 'cancelled').length,
  }), [orders]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    const processing = orders.filter(o => o.status === 'processing' || o.status === 'pending');
    const shipped    = orders.filter(o => o.status === 'shipped');
    const today      = new Date().toDateString();
    const deliveredToday = orders.filter(o =>
      o.status === 'delivered' && new Date(o.updatedAt).toDateString() === today
    );
    const urgent = processing.filter(o => o.priority === 'urgent' || o.priority === 'high');
    const deliveredValue = deliveredToday.reduce((s, o) => s + o.totalValue, 0);
    return { total: orders.length, processing: processing.length, shipped: shipped.length, deliveredToday: deliveredToday.length, deliveredValue, urgent: urgent.length };
  }, [orders]);

  /* ── urgent orders ── */
  const urgentOrders = useMemo(() =>
    orders.filter(o =>
      (o.priority === 'urgent' || o.priority === 'high') &&
      o.status !== 'delivered' && o.status !== 'cancelled'
    ).slice(0, 5),
    [orders],
  );

  /* ── simulated delivery trend ── */
  const deliveryTrend = useMemo(() => {
    const base = Math.max(1, orders.filter(o => o.status === 'delivered').length);
    const factors = [0.4, 0.7, 0.5, 1.0, 0.9, 0.3, 0.2];
    return DAYS.map((day, i) => ({
      day,
      livrate:    Math.round(base * factors[i]),
      intarziate: Math.round((base * 0.15) * (1 - factors[i])),
      anulate:    i % 3 === 1 ? 1 : 0,
    }));
  }, [orders]);

  /* ── activity feed (last 6 updated) ── */
  const activityFeed = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)
      .map(o => ({
        id:    o.id,
        text:  `CMD-${String(o.id).padStart(4, '0')} — ${o.supplierName} — status: ${STATUS_LABEL[o.status]}`,
        abbr:  o.supplierName.slice(0, 2).toUpperCase(),
        time:  timeAgo(o.updatedAt),
        color: o.status === 'delivered' ? '#10B981' : o.status === 'cancelled' ? '#475569' : o.status === 'shipped' ? '#A78BFA' : '#3B82F6',
        live:  timeAgo(o.updatedAt) === 'acum',
      })),
    [orders],
  );

  /* ── inline status patch ── */
  const handleStatusChange = async (id: number, newStatus: string) => {
    setPatchingId(id);
    try {
      const res = await apiFetch(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Eroare la actualizare');
      const updated = await res.json() as Order;
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      setToast({ msg: 'Status actualizat', ok: true });
    } catch {
      setToast({ msg: 'Eroare la actualizare status', ok: false });
    } finally {
      setPatchingId(null);
    }
  };

  /* ── create order ── */
  const handleCreate = async (form: OrderForm) => {
    try {
      const res = await apiFetch('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          supplierName:      form.supplierName,
          category:          form.category,
          itemsCount:        Number(form.itemsCount),
          totalValue:        Number(form.totalValue),
          priority:          form.priority,
          status:            form.status,
          itemsJson:         '[]',
          estimatedDelivery: form.estimatedDelivery ? new Date(form.estimatedDelivery).toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error('Eroare la creare');
      setShowCreate(false);
      setToast({ msg: 'Comandă creată cu succes', ok: true });
      fetchOrders();
    } catch {
      setToast({ msg: 'Eroare la crearea comenzii', ok: false });
    }
  };

  /* ── delete order ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await apiFetch(`/api/orders/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Eroare la ștergere');
      setOrders(prev => prev.filter(o => o.id !== deleteTarget.id));
      setDeleteTarget(null);
      setToast({ msg: 'Comandă ștearsă', ok: true });
    } catch {
      setToast({ msg: 'Eroare la ștergere', ok: false });
    }
  };

  /* ── select helpers ── */
  const allSel  = visible.length > 0 && visible.every(o => selected.has(o.id));
  const someSel = !allSel && visible.some(o => selected.has(o.id));
  const toggleAll = () => setSelected(allSel ? new Set() : new Set(visible.map(o => o.id)));
  const toggleOne = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  /* ── shipping widget items (shipped orders) ── */
  const shippingWidget = useMemo(() =>
    orders.filter(o => o.status === 'shipped').slice(0, 4).map(o => ({
      id:       o.id,
      eta:      fmtEta(o.estimatedDelivery),
      progress: o.priority === 'urgent' ? 85 : o.priority === 'high' ? 65 : 45,
      step:     o.priority === 'urgent' ? 'În livrare' : 'În tranzit',
      category: o.category,
    })),
    [orders],
  );

  /* ── format MDL ── */
  const fmtMdl = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K MDL` : `${n} MDL`;

  /* ── render ── */
  return (
    <div>
      {/* Page header */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Comenzi</h1>
          <p>Management comenzi &amp; livrări — {orders.length} înregistrări</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="dm-inv-search" style={{ minWidth: 220 }}>
            <Search size={14} />
            <input
              placeholder="Caută comandă, furnizor..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="dm-inv-clear" onClick={() => setSearch('')}>×</button>
            )}
          </div>
          {admin && (
            <button className="dm-btn dm-btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={14} /> Comandă nouă
            </button>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 0.75rem', height: 32,
            background: 'var(--s-surface)', border: '1px solid var(--s-border)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <div className="dm-live-dot" />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--c-green)' }}>Live tracking</span>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          padding: '0.75rem 1rem', marginBottom: '1.25rem',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={14} />
          Backend indisponibil — {error}. Porneşte serverul şi reîncarcă pagina.
        </div>
      )}

      {/* KPI grid */}
      <div className="dm-kpi-grid">
        <motion.div
          className="dm-kpi-card"
          style={{ '--kpi-color': 'var(--c-blue)', '--kpi-dim': 'var(--c-blue-dim)' } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={0}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Total Comenzi</span>
            <div className="dm-kpi-icon"><ShoppingCart /></div>
          </div>
          <div className="dm-kpi-value">{loading ? '…' : kpis.total.toLocaleString()}</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up">{kpis.total} total</span>
            <span className="dm-kpi-vs">în sistem</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ '--kpi-color': 'var(--c-amber)', '--kpi-dim': 'var(--c-amber-dim)' } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={1}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">În Procesare</span>
            <div className="dm-kpi-icon"><Loader /></div>
          </div>
          <div className="dm-kpi-value">{loading ? '…' : kpis.processing}</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend warn">{kpis.urgent} urgente</span>
            <span className="dm-kpi-vs">necesită acțiune</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ '--kpi-color': 'var(--c-purple)', '--kpi-dim': 'var(--c-purple-dim)' } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={2}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">În Tranzit</span>
            <div className="dm-kpi-icon"><Truck /></div>
          </div>
          <div className="dm-kpi-value">{loading ? '…' : kpis.shipped}</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up">expediate</span>
            <span className="dm-kpi-vs">monitorizate live</span>
          </div>
        </motion.div>

        <motion.div
          className="dm-kpi-card"
          style={{ '--kpi-color': 'var(--c-green)', '--kpi-dim': 'var(--c-green-dim)' } as React.CSSProperties}
          variants={CV} initial="hidden" animate="visible" custom={3}
        >
          <div className="dm-kpi-top">
            <span className="dm-kpi-label">Livrate Azi</span>
            <div className="dm-kpi-icon"><CheckCircle /></div>
          </div>
          <div className="dm-kpi-value">{loading ? '…' : kpis.deliveredToday}</div>
          <div className="dm-kpi-footer">
            <span className="dm-trend up">{fmtMdl(kpis.deliveredValue)}</span>
            <span className="dm-kpi-vs">valoare livrată</span>
          </div>
        </motion.div>
      </div>

      {/* Urgent orders widget */}
      {urgentOrders.length > 0 && (
        <motion.div
          className="dm-card"
          style={{ marginBottom: '1.25rem' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="dm-card-header" style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--s-border)', marginBottom: 0 }}>
            <div>
              <div className="dm-card-title">Livrări Urgente &amp; Prioritare</div>
              <div className="dm-card-subtitle">{urgentOrders.length} comenzi active cu prioritate ridicată</div>
            </div>
          </div>
          <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {urgentOrders.map((order, i) => {
              const isUrgent    = order.priority === 'urgent';
              const accentColor = isUrgent ? 'var(--c-red)' : 'var(--c-amber)';
              const accentDim   = isUrgent ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)';
              const fulfillPct  = order.status === 'shipped' ? 78 : order.status === 'processing' ? 40 : 15;
              return (
                <motion.div
                  key={order.id}
                  variants={CV} initial="hidden" animate="visible" custom={i}
                  style={{
                    minWidth: 220, maxWidth: 240, flex: '0 0 220px',
                    background: accentDim,
                    border: '1px solid var(--s-border)',
                    borderLeft: `3px solid ${accentColor}`,
                    borderRadius: 'var(--radius)',
                    padding: '0.85rem 0.9rem',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--t-primary)' }}>
                      CMD-{String(order.id).padStart(4, '0')}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--t-secondary)' }}>
                    {order.supplierName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {order.totalValue.toLocaleString('ro-MD')} MDL
                    </span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                      background: isUrgent ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: isUrgent ? '#EF4444' : '#F59E0B',
                      border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.35)' : 'rgba(245,158,11,0.35)'}`,
                    }}>
                      {fmtEta(order.estimatedDelivery)}
                    </span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--t-muted)' }}>Fulfillment</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: accentColor }}>{fulfillPct}%</span>
                    </div>
                    <div className="dm-progress-track">
                      <div className="dm-progress-fill" style={{ width: `${fulfillPct}%`, background: accentColor }} />
                    </div>
                  </div>
                  <PriorityBadge priority={order.priority} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Orders table */}
      <motion.div
        className="dm-card"
        style={{ marginBottom: '1.25rem' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
      >
        {/* Tabs */}
        <div className="dm-inv-tabs" style={{ borderBottom: '1px solid var(--s-border)', margin: 0, padding: '0 1.25rem' }}>
          {ORDER_TABS.map(t => (
            <button
              key={t.key}
              className={`dm-inv-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => { setTab(t.key); setPage(1); }}
            >
              {t.label}
              <span className="dm-inv-tab-count">{tabCounts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="dm-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table className="dm-table">
            <thead>
              <tr>
                {admin && (
                  <th style={{ width: 44 }}>
                    <input
                      type="checkbox" className="dm-checkbox"
                      checked={allSel}
                      ref={el => { if (el) el.indeterminate = someSel; }}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                <th style={{ width: 110 }}># Comandă</th>
                <th>Furnizor</th>
                <th style={{ width: 90, textAlign: 'center' }}>Art.</th>
                <th style={{ width: 130, textAlign: 'right' }}>Valoare (MDL)</th>
                <th style={{ width: 150 }}>Status</th>
                <th style={{ width: 100 }}>Prioritate</th>
                <th style={{ width: 150 }}>ETA</th>
                <th style={{ width: 90 }}>Modificat</th>
                {admin && <th style={{ width: 60 }} />}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : visible.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={admin ? 10 : 8}>
                      <div className="dm-table-empty">
                        <ShoppingCart size={32} />
                        <p>{error ? 'Backend indisponibil' : 'Nicio comandă găsită'}</p>
                        <span>{error ? 'Verifică dacă serverul rulează' : 'Încearcă să schimbi filtrul sau termenul de căutare'}</span>
                      </div>
                    </td>
                  </tr>
                ) : visible.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    className={selected.has(order.id) ? 'dm-tr-selected' : ''}
                    variants={rowVariants} initial="hidden" animate="visible" exit="exit"
                    custom={i} layout
                  >
                    {admin && (
                      <td>
                        <input
                          type="checkbox" className="dm-checkbox"
                          checked={selected.has(order.id)}
                          onChange={() => toggleOne(order.id)}
                        />
                      </td>
                    )}
                    <td>
                      <span className="dm-td-sku">CMD-{String(order.id).padStart(4, '0')}</span>
                    </td>
                    <td>
                      <div className="dm-td-name-wrap">
                        <strong>{order.supplierName}</strong>
                        {order.category && <span><span className="dm-cat-pill">{order.category}</span></span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>
                      {order.itemsCount}
                    </td>
                    <td className="dm-td-price">{order.totalValue.toLocaleString('ro-MD')}</td>
                    <td>
                      {admin ? (
                        /* Inline status select for admin */
                        <select
                          value={order.status}
                          disabled={patchingId === order.id}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          style={{
                            background: 'none', border: 'none', outline: 'none',
                            cursor: 'pointer', fontSize: 11, fontWeight: 600,
                            color: 'inherit', fontFamily: 'inherit',
                            appearance: 'none', padding: 0,
                            opacity: patchingId === order.id ? 0.5 : 1,
                          }}
                        >
                          {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                          ))}
                        </select>
                      ) : (
                        <StatusBadge status={order.status} />
                      )}
                    </td>
                    <td><PriorityBadge priority={order.priority} /></td>
                    <td className="dm-td-updated" style={{ color: 'var(--t-secondary)', fontWeight: 500 }}>
                      {fmtEta(order.estimatedDelivery)}
                    </td>
                    <td className="dm-td-updated">{timeAgo(order.updatedAt)}</td>
                    {admin && (
                      <td>
                        <div className="dm-row-actions">
                          <button
                            className="dm-row-act-btn dm-row-act-danger"
                            title="Șterge"
                            onClick={() => setDeleteTarget(order)}
                          >
                            <Trash2 size={13} />
                          </button>
                          <button className="dm-row-act-btn" title="Mai multe">
                            <MoreHorizontal size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="dm-pagination">
          <span className="dm-pag-info">
            Afișând <strong>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> din <strong>{filtered.length}</strong> comenzi
          </span>
          <div className="dm-pag-btns">
            <button className="dm-pag-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} className={`dm-pag-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            {pageCount > 5 && <span style={{ color: 'var(--t-tertiary)', fontSize: 12, padding: '0 2px' }}>…</span>}
            <button className="dm-pag-btn" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Charts + Shipping (2-col) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem', marginBottom: '1.25rem' }}>

        {/* Delivery trend chart */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
        >
          <div className="dm-chart-wrap">
            <div className="dm-card-header">
              <div>
                <div className="dm-card-title">Evoluție Livrări — 7 Zile</div>
                <div className="dm-card-subtitle">Livrate, întârziate și anulate per zi (simulate)</div>
              </div>
              <div style={{ display: 'flex', gap: '0.875rem' }}>
                {[
                  { key: 'livrate',    color: '#10B981', label: 'Livrate' },
                  { key: 'intarziate', color: '#F59E0B', label: 'Întârziate' },
                  { key: 'anulate',    color: '#EF4444', label: 'Anulate' },
                ].map(l => (
                  <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--t-tertiary)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={deliveryTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--t-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--t-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DeliveryTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="livrate"    name="Livrate"    stroke="#10B981" strokeWidth={2} fill="url(#gradL)" dot={false} activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="intarziate" name="Întârziate" stroke="#F59E0B" strokeWidth={2} fill="url(#gradI)" dot={false} activeDot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="anulate"    name="Anulate"    stroke="#EF4444" strokeWidth={2} fill="url(#gradA)" dot={false} activeDot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Shipment tracking */}
        <motion.div
          className="dm-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.45 }}
        >
          <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--s-border)' }}>
            <div className="dm-card-title">Tracking Expedieri</div>
            <div className="dm-card-subtitle">{shippingWidget.length} expedieri active</div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {shippingWidget.length === 0 ? (
              <div className="dm-empty-state" style={{ padding: '2rem 1rem' }}>
                <Truck size={24} />
                <p>Nicio expediere activă</p>
              </div>
            ) : shippingWidget.map((ship, i) => {
              const progressColor = ship.progress >= 80 ? '#10B981' : ship.progress >= 50 ? '#A78BFA' : '#F59E0B';
              return (
                <div
                  key={ship.id}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderBottom: i < shippingWidget.length - 1 ? '1px solid var(--s-border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'var(--s-hover)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = '')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--t-primary)' }}>
                      CMD-{String(ship.id).padStart(4, '0')}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--t-tertiary)', fontWeight: 600 }}>{ship.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6, fontSize: 11, color: 'var(--t-muted)' }}>
                    <MapPin size={10} style={{ flexShrink: 0 }} />
                    <span>Furnizor</span>
                    <span style={{ color: 'var(--s-border-2)' }}>→</span>
                    <span style={{ color: 'var(--t-secondary)', fontWeight: 600 }}>Chișinău</span>
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, color: 'var(--t-muted)' }}>{ship.step}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: progressColor }}>{ship.progress}%</span>
                    </div>
                    <div className="dm-progress-track">
                      <div className="dm-progress-fill" style={{ width: `${ship.progress}%`, background: progressColor }} />
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                    background: 'rgba(59,130,246,0.12)', color: '#60A5FA',
                    border: '1px solid rgba(59,130,246,0.25)',
                  }}>
                    ETA: {ship.eta}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Activity feed */}
      <motion.div
        className="dm-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.45 }}
      >
        <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--s-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="dm-card-title" style={{ margin: 0 }}>Activitate Comenzi</div>
            <div className="dm-live-dot" />
          </div>
          <div className="dm-card-subtitle">Ultimele modificări din sistem</div>
        </div>
        <div style={{ padding: '0.5rem 0' }}>
          {activityFeed.length === 0 ? (
            <div className="dm-empty-state" style={{ padding: '2rem 1rem' }}>
              <ShoppingCart size={24} />
              <p>Nicio activitate</p>
            </div>
          ) : activityFeed.map((item, i) => (
            <div key={`${item.id}-${i}`} className="dm-activity-item">
              <div
                className="dm-act-avatar"
                style={{ background: item.color + '22', color: item.color }}
              >
                {item.abbr}
              </div>
              <div className="dm-act-body">
                <div className="dm-act-line">
                  <span style={{ fontSize: 12.5, color: 'var(--t-primary)', fontWeight: item.live ? 600 : 400 }}>
                    {item.text}
                  </span>
                  {item.live && (
                    <span style={{
                      marginLeft: 6, fontSize: 10, fontWeight: 700,
                      padding: '1px 6px', borderRadius: 999,
                      background: 'rgba(16,185,129,0.15)', color: '#10B981',
                      border: '1px solid rgba(16,185,129,0.3)',
                    }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <span className="dm-act-time">{item.time}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10.5, fontWeight: 600, color: item.color, opacity: 0.8 }}>
                    CMD-{String(item.id).padStart(4, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateOrderModal
            key="create-order"
            onSave={handleCreate}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            key="confirm-delete"
            msg={`Ștergi comanda CMD-${String(deleteTarget.id).padStart(4, '0')} de la ${deleteTarget.supplierName}? Această acțiune este ireversibilă.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      <div className="dm-toast-wrap">
        <AnimatePresence>
          {toast && (
            <Toast key="toast" toast={toast} onDismiss={() => setToast(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminComenzi;
