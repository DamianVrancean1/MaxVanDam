import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, ChevronUp, ChevronDown,
  Edit2, Trash2, MoreHorizontal, Download, Plus, X,
  Package, ChevronLeft, ChevronRight, Check, AlertTriangle,
} from 'lucide-react';
import {
  getProducts, addProduct, updateProduct, deleteProduct,
} from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../types';

/* ── constants ── */
const PAGE_SIZE   = 15;
const MIN_STOCK   = 10;
const CRIT_STOCK  = 5;

const CATEGORY_OPTIONS = [
  'Filtre de aer', 'Filtre de ulei', 'Filtre de combustibil', 'Filtre de habitaclu',
  'Sistem de frânare', 'Suspensie', 'Transmisie', 'Electric', 'Motor', 'Răcire',
  'Alimentare', 'Senzori', 'Rulare', 'Direcție',
];
const IMAGE_OPTIONS = Array.from({ length: 100 }, (_, i) => `/products/${i + 1}.jpg`);

/* ── types ── */
type Status  = 'ok' | 'low' | 'critical' | 'out';
type SortKey = 'id' | 'name' | 'stock' | 'price';
type ModalMode = 'add' | 'edit' | null;
type ProductRow = Product & { status: Status };

const STATUS_LABEL: Record<Status, string> = {
  ok: 'În stoc', low: 'Stoc scăzut', critical: 'Critic', out: 'Epuizat',
};

const TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'all',      label: 'Toate' },
  { key: 'ok',       label: 'În stoc' },
  { key: 'low',      label: 'Stoc scăzut' },
  { key: 'critical', label: 'Critic' },
  { key: 'out',      label: 'Epuizat' },
];

/* ── helpers ── */
function getStatus(stock: number): Status {
  if (stock === 0)           return 'out';
  if (stock < CRIT_STOCK)   return 'critical';
  if (stock < MIN_STOCK)    return 'low';
  return 'ok';
}

function exportCsv(rows: ProductRow[]) {
  const header = ['SKU', 'Nume', 'Brand', 'Categorie', 'Stoc', 'Pret (MDL)', 'Locatie', 'Status'];
  const body   = rows.map(p => [
    `SKU-${String(p.id).padStart(3, '0')}`,
    `"${p.name}"`,
    `"${p.brand ?? ''}"`,
    `"${p.category}"`,
    p.stock,
    p.price,
    `"${p.warehouseLocation ?? ''}"`,
    STATUS_LABEL[p.status],
  ]);
  const csv  = [header, ...body].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `inventar_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── row animation ── */
const rowVariants = {
  hidden:  { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── stock bar ── */
const StockBar = ({ stock, status }: { stock: number; status: Status }) => {
  const pct   = Math.min(100, (stock / (MIN_STOCK * 2)) * 100);
  const color =
    status === 'ok'       ? 'var(--c-green)' :
    status === 'low'      ? 'var(--c-amber)' :
    status === 'critical' ? 'var(--c-red)'   : '#334155';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 26, textAlign: 'right', fontSize: 13, color: 'var(--t-primary)', fontWeight: 600 }}>
        {stock}
      </span>
      <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'var(--s-surface-3)', minWidth: 60, maxWidth: 80 }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: color, transition: 'width 0.6s ease' }} />
      </div>
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
      animate={{ opacity: 1, y: 0, scale: 1 }}
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
  productName,
  onConfirm,
  onCancel,
}: {
  productName: string;
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
      <p className="dm-confirm-msg">
        Ești sigur că vrei să ștergi <strong>{productName}</strong>?
        Această acțiune este ireversibilă.
      </p>
      <div className="dm-confirm-actions">
        <button className="dm-btn dm-btn-ghost" onClick={onCancel}>Anulează</button>
        <button className="dm-btn dm-btn-danger" onClick={onConfirm}>Șterge</button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── product modal (right drawer) ── */
const EMPTY_FORM = {
  name: '', brand: '', model: '', category: '', price: '',
  stock: '', warehouseLocation: '', shortDescription: '',
  description: '', imageUrl: '', compatibility: '',
};
type FormState = typeof EMPTY_FORM;

const ProductModal = ({
  mode,
  product,
  onSave,
  onClose,
}: {
  mode:    'add' | 'edit';
  product: Product | null;
  onSave:  (data: Omit<Product, 'id'>, id?: number) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<FormState>(() =>
    product ? {
      name:              product.name,
      brand:             product.brand             ?? '',
      model:             product.model             ?? '',
      category:          product.category,
      price:             String(product.price),
      stock:             String(product.stock),
      warehouseLocation: product.warehouseLocation ?? '',
      shortDescription:  product.shortDescription  ?? '',
      description:       product.description,
      imageUrl:          product.imageUrl || product.image || '',
      compatibility:     product.compatibility?.join(', ')  ?? '',
    } : { ...EMPTY_FORM }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set    = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const setNum = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value.replace(/\D/g, '') }));

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim())              errs.name = 'Câmp obligatoriu';
    if (!form.category)                 errs.category = 'Selectează categoria';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Preț invalid';
    if (form.stock === '')              errs.stock = 'Câmp obligatoriu';
    if (!form.warehouseLocation.trim()) errs.warehouseLocation = 'Câmp obligatoriu';
    if (!form.description.trim())       errs.description = 'Câmp obligatoriu';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name:              form.name.trim(),
      brand:             form.brand.trim()  || undefined,
      model:             form.model.trim()  || undefined,
      category:          form.category,
      price:             Number(form.price),
      stock:             Number(form.stock),
      warehouseLocation: form.warehouseLocation.trim().toUpperCase(),
      shortDescription:  form.shortDescription.trim() || undefined,
      description:       form.description.trim(),
      imageUrl:          form.imageUrl,
      image:             form.imageUrl || undefined,
      compatibility:     form.compatibility
                           .split(',').map(s => s.trim()).filter(Boolean),
    }, product?.id);
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
        {/* Header */}
        <div className="dm-drawer-hd">
          <div>
            <div className="dm-card-title">
              {mode === 'add' ? 'Adaugă produs' : 'Editează produs'}
            </div>
            <div className="dm-card-subtitle">
              {mode === 'edit' && product
                ? `SKU-${String(product.id).padStart(3, '0')}`
                : 'Produs nou în catalog'}
            </div>
          </div>
          <button className="dm-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Body */}
        <div className="dm-drawer-body">
          <form id="product-form" onSubmit={handleSubmit} noValidate>
            <div className="dm-form-2col">

              <div className="dm-form-field">
                <label className="dm-form-label">Nume produs *</label>
                <input
                  className={`dm-input${errors.name ? ' err' : ''}`}
                  value={form.name} onChange={set('name')}
                  placeholder="Ex: Filtru Mann HU 816 x"
                />
                {errors.name && <span className="dm-form-err">{errors.name}</span>}
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Brand</label>
                <input className="dm-input" value={form.brand} onChange={set('brand')} placeholder="Ex: Bosch, NGK" />
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Model</label>
                <input className="dm-input" value={form.model} onChange={set('model')} placeholder="Ex: Seria 3" />
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Categorie *</label>
                <select
                  className={`dm-input dm-select${errors.category ? ' err' : ''}`}
                  value={form.category} onChange={set('category')}
                >
                  <option value="">Selectează...</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="dm-form-err">{errors.category}</span>}
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Preț (MDL) *</label>
                <input
                  className={`dm-input${errors.price ? ' err' : ''}`}
                  value={form.price} onChange={setNum('price')}
                  inputMode="numeric" placeholder="0"
                />
                {errors.price && <span className="dm-form-err">{errors.price}</span>}
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Stoc *</label>
                <input
                  className={`dm-input${errors.stock ? ' err' : ''}`}
                  value={form.stock} onChange={setNum('stock')}
                  inputMode="numeric" placeholder="0"
                />
                {errors.stock && <span className="dm-form-err">{errors.stock}</span>}
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Locație depozit *</label>
                <input
                  className={`dm-input${errors.warehouseLocation ? ' err' : ''}`}
                  value={form.warehouseLocation}
                  onChange={e => setForm(f => ({
                    ...f,
                    warehouseLocation: e.target.value.toUpperCase().replace(/[^A-Z0-9\-/ ]/g, ''),
                  }))}
                  placeholder="A-1"
                />
                {errors.warehouseLocation && <span className="dm-form-err">{errors.warehouseLocation}</span>}
              </div>

              <div className="dm-form-field">
                <label className="dm-form-label">Imagine</label>
                <select className="dm-input dm-select" value={form.imageUrl} onChange={set('imageUrl')}>
                  <option value="">Nicio imagine</option>
                  {IMAGE_OPTIONS.map(img => <option key={img} value={img}>{img}</option>)}
                </select>
              </div>

            </div>

            <div className="dm-form-field" style={{ marginTop: '0.875rem' }}>
              <label className="dm-form-label">Descriere scurtă</label>
              <textarea
                className="dm-input dm-textarea"
                value={form.shortDescription} onChange={set('shortDescription')}
                rows={2} placeholder="Scurtă descriere a produsului..."
              />
            </div>

            <div className="dm-form-field" style={{ marginTop: '0.875rem' }}>
              <label className="dm-form-label">Compatibilitate (separate cu virgulă)</label>
              <input
                className="dm-input" value={form.compatibility} onChange={set('compatibility')}
                placeholder="BMW Seria 3, Audi A4..."
              />
            </div>

            <div className="dm-form-field" style={{ marginTop: '0.875rem' }}>
              <label className="dm-form-label">Descriere completă *</label>
              <textarea
                className={`dm-input dm-textarea${errors.description ? ' err' : ''}`}
                value={form.description} onChange={set('description')}
                rows={4} placeholder="Descriere detaliată..."
              />
              {errors.description && <span className="dm-form-err">{errors.description}</span>}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="dm-drawer-ft">
          <button type="button" className="dm-btn dm-btn-ghost" onClick={onClose}>Anulează</button>
          <button type="submit" form="product-form" className="dm-btn dm-btn-primary">
            <Check size={13} /> {mode === 'add' ? 'Adaugă produs' : 'Salvează'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── main component ── */
const ProductsPage = () => {
  const { isAdmin } = useAuth();
  const admin = isAdmin();

  /* refresh trigger for localStorage data */
  const [version, setVersion]     = useState(0);
  const refresh = useCallback(() => setVersion(v => v + 1), []);

  /* filter / sort / pagination state */
  const [search, setSearch]       = useState('');
  const [debouncedQ, setDQ]       = useState('');
  const [tab, setTab]             = useState<Status | 'all'>('all');
  const [sortKey, setSortKey]     = useState<SortKey>('id');
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [page, setPage]           = useState(1);

  /* modal/dialog state */
  const [modalMode, setModalMode]     = useState<ModalMode>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [toast, setToast]             = useState<ToastData | null>(null);

  /* debounce search */
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (val: string) => {
    setSearch(val);
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { setDQ(val); setPage(1); }, 300);
  };

  /* data */
  const products = useMemo(() => getProducts(), [version]);

  const withStatus = useMemo<ProductRow[]>(
    () => products.map(p => ({ ...p, status: getStatus(p.stock) })),
    [products],
  );

  const tabCounts = useMemo(() => ({
    all:      withStatus.length,
    ok:       withStatus.filter(p => p.status === 'ok').length,
    low:      withStatus.filter(p => p.status === 'low').length,
    critical: withStatus.filter(p => p.status === 'critical').length,
    out:      withStatus.filter(p => p.status === 'out').length,
  }), [withStatus]);

  const filtered = useMemo(() => {
    let data = withStatus;
    if (tab !== 'all') data = data.filter(p => p.status === tab);
    if (debouncedQ.trim()) {
      const q = debouncedQ.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q)          ||
        (p.brand ?? '').toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)      ||
        `sku-${p.id}`.includes(q)
      );
    }
    return [...data].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      const al = typeof av === 'string' ? av.toLowerCase() : av;
      const bl = typeof bv === 'string' ? bv.toLowerCase() : bv;
      if (al < bl) return sortDir === 'asc' ? -1 : 1;
      if (al > bl) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [withStatus, tab, debouncedQ, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
    setPage(1);
  };

  const allSel  = visible.length > 0 && visible.every(p => selected.has(p.id));
  const someSel = !allSel && visible.some(p => selected.has(p.id));
  const toggleAll = () =>
    setSelected(allSel ? new Set() : new Set(visible.map(p => p.id)));
  const toggleOne = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  /* actions */
  const showToast = (msg: string, ok = true) => setToast({ msg, ok });

  const handleSave = (data: Omit<Product, 'id'>, id?: number) => {
    if (id !== undefined) {
      updateProduct(id, data);
      showToast('Produs actualizat cu succes');
    } else {
      addProduct(data);
      showToast('Produs adăugat cu succes');
    }
    setModalMode(null);
    setEditProduct(null);
    refresh();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setSelected(s => { const n = new Set(s); n.delete(deleteTarget.id); return n; });
    setDeleteTarget(null);
    showToast('Produs șters');
    refresh();
  };

  const handleBulkDelete = () => {
    const count = selected.size;
    selected.forEach(id => deleteProduct(id));
    setSelected(new Set());
    showToast(`${count} produse șterse`);
    refresh();
  };

  /* page window for pagination */
  const pageWindow = useMemo(() => {
    const half = 2;
    let start = Math.max(1, page - half);
    const end = Math.min(pageCount, start + 4);
    start     = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, pageCount]);

  /* sort arrow */
  const SortArrow = ({ k }: { k: SortKey }) =>
    sortKey !== k
      ? <ChevronUp size={11} style={{ opacity: 0.2 }} />
      : sortDir === 'asc'
        ? <ChevronUp   size={11} style={{ color: 'var(--c-blue)' }} />
        : <ChevronDown size={11} style={{ color: 'var(--c-blue)' }} />;

  /* ── render ── */
  return (
    <div>
      {/* Page header */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Inventar</h1>
          <p>
            {filtered.length.toLocaleString()} produse
            {tab !== 'all' ? ` · ${STATUS_LABEL[tab as Status]}` : ''}
            {debouncedQ ? ` · "${debouncedQ}"` : ''}
          </p>
        </div>
        <div className="dm-header-actions">
          <button className="dm-btn dm-btn-ghost" onClick={() => exportCsv(filtered)}>
            <Download size={14} /> Export CSV
          </button>
          {admin && (
            <button
              className="dm-btn dm-btn-primary"
              onClick={() => { setEditProduct(null); setModalMode('add'); }}
            >
              <Plus size={14} /> Adaugă produs
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="dm-inv-toolbar">
        <div className="dm-inv-search">
          <Search size={14} />
          <input
            placeholder="Caută după nume, brand, categorie, SKU..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {search && (
            <button className="dm-inv-clear" onClick={() => { setSearch(''); setDQ(''); setPage(1); }}>
              ×
            </button>
          )}
        </div>

        <button className="dm-btn dm-btn-ghost">
          <SlidersHorizontal size={14} /> Filtre avansate
        </button>

        {selected.size > 0 && admin && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--t-secondary)' }}>
              {selected.size} selectate
            </span>
            <button
              className="dm-btn dm-btn-ghost"
              style={{ color: 'var(--c-amber)', borderColor: 'rgba(245,158,11,0.25)' }}
              onClick={() => exportCsv(filtered.filter(p => selected.has(p.id)))}
            >
              <Download size={13} /> Export
            </button>
            <button
              className="dm-btn dm-btn-ghost"
              style={{ color: 'var(--c-red)', borderColor: 'rgba(239,68,68,0.25)' }}
              onClick={handleBulkDelete}
            >
              <Trash2 size={13} /> Șterge selectate
            </button>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="dm-inv-tabs">
        {TABS.map(t => (
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
      <div className="dm-table-wrap" style={{ marginTop: '0.875rem' }}>
        <table className="dm-table">
          <thead>
            <tr>
              {admin && (
                <th style={{ width: 44 }}>
                  <input
                    type="checkbox"
                    className="dm-checkbox"
                    checked={allSel}
                    ref={el => { if (el) el.indeterminate = someSel; }}
                    onChange={toggleAll}
                  />
                </th>
              )}
              <th style={{ width: 106, cursor: 'pointer' }} onClick={() => toggleSort('id')}>
                <span className="dm-th-inner">SKU <SortArrow k="id" /></span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
                <span className="dm-th-inner">Produs + Brand <SortArrow k="name" /></span>
              </th>
              <th>Categorie</th>
              <th style={{ width: 160, cursor: 'pointer' }} onClick={() => toggleSort('stock')}>
                <span className="dm-th-inner">Stoc <SortArrow k="stock" /></span>
              </th>
              <th style={{ width: 130 }}>Status</th>
              <th
                style={{ width: 120, textAlign: 'right', cursor: 'pointer' }}
                onClick={() => toggleSort('price')}
              >
                <span className="dm-th-inner" style={{ justifyContent: 'flex-end' }}>
                  Preț (MDL) <SortArrow k="price" />
                </span>
              </th>
              <th style={{ width: 90 }}>Locație</th>
              {admin && <th style={{ width: 80 }} />}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {visible.length === 0 ? (
                <tr key="empty">
                  <td colSpan={admin ? 9 : 7}>
                    <div className="dm-table-empty">
                      <Package size={32} />
                      <p>Niciun produs găsit</p>
                      <span>Încearcă să schimbi filtrul sau termenul de căutare</span>
                    </div>
                  </td>
                </tr>
              ) : visible.map((p, i) => (
                <motion.tr
                  key={p.id}
                  className={selected.has(p.id) ? 'dm-tr-selected' : ''}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  layout
                >
                  {admin && (
                    <td>
                      <input
                        type="checkbox"
                        className="dm-checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleOne(p.id)}
                      />
                    </td>
                  )}
                  <td>
                    <span className="dm-td-sku">SKU-{String(p.id).padStart(3, '0')}</span>
                  </td>
                  <td>
                    <div className="dm-td-name-wrap">
                      <strong>{p.name}</strong>
                      <span>{p.brand || '—'}</span>
                    </div>
                  </td>
                  <td><span className="dm-cat-pill">{p.category}</span></td>
                  <td><StockBar stock={p.stock} status={p.status} /></td>
                  <td>
                    <span className={`dm-badge dm-badge-${p.status}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="dm-td-price">{p.price.toLocaleString('ro-MD')}</td>
                  <td>
                    <span className="dm-td-sku" style={{ fontSize: 12 }}>
                      {p.warehouseLocation ?? '—'}
                    </span>
                  </td>
                  {admin && (
                    <td>
                      <div className="dm-row-actions">
                        <button
                          className="dm-row-act-btn"
                          title="Editează"
                          onClick={() => { setEditProduct(p); setModalMode('edit'); }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="dm-row-act-btn dm-row-act-danger"
                          title="Șterge"
                          onClick={() => setDeleteTarget(p)}
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
          Afișând{' '}
          <strong>
            {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
          </strong>
          {' '}din <strong>{filtered.length.toLocaleString()}</strong> produse
        </span>
        <div className="dm-pag-btns">
          <button
            className="dm-pag-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={13} />
          </button>
          {pageWindow[0] > 1 && (
            <>
              <button className="dm-pag-btn" onClick={() => setPage(1)}>1</button>
              {pageWindow[0] > 2 && (
                <span style={{ color: 'var(--t-tertiary)', fontSize: 12, padding: '0 2px' }}>…</span>
              )}
            </>
          )}
          {pageWindow.map(n => (
            <button
              key={n}
              className={`dm-pag-btn${page === n ? ' active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          {pageWindow[pageWindow.length - 1] < pageCount && (
            <>
              {pageWindow[pageWindow.length - 1] < pageCount - 1 && (
                <span style={{ color: 'var(--t-tertiary)', fontSize: 12, padding: '0 2px' }}>…</span>
              )}
              <button className="dm-pag-btn" onClick={() => setPage(pageCount)}>
                {pageCount}
              </button>
            </>
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

      {/* Product modal (add/edit drawer) */}
      <AnimatePresence>
        {modalMode && (
          <ProductModal
            key={`${modalMode}-${editProduct?.id ?? 'new'}`}
            mode={modalMode}
            product={editProduct}
            onSave={handleSave}
            onClose={() => { setModalMode(null); setEditProduct(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            key="confirm"
            productName={deleteTarget.name}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
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

export default ProductsPage;
