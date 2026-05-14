import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, ChevronUp, ChevronDown,
  Edit2, Trash2, MoreHorizontal, Download, Plus,
  Package, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ── types ── */
type Status = "ok" | "low" | "critical" | "out";

interface Product {
  sku: string;
  name: string;
  cat: string;
  brand: string;
  stock: number;
  min: number;
  price: number;
  status: Status;
  updated: string;
}

/* ── data ── */
const INVENTORY: Product[] = [
  { sku: "BRK-001", name: "Plăcuțe frână Bosch BP2048",            cat: "Frâne",       brand: "Bosch",      stock: 5,  min: 10, price: 245, status: "low",      updated: "2 min" },
  { sku: "FLT-012", name: "Filtru ulei Mann HU 816 x",             cat: "Filtre",      brand: "Mann",       stock: 2,  min: 15, price: 89,  status: "critical",  updated: "8 min" },
  { sku: "BRK-047", name: "Disc frână Brembo 09.8813.11",          cat: "Frâne",       brand: "Brembo",     stock: 18, min: 8,  price: 380, status: "ok",        updated: "1 oră" },
  { sku: "SUS-089", name: "Amortizor față Sachs 115 904",          cat: "Suspensie",   brand: "Sachs",      stock: 0,  min: 4,  price: 620, status: "out",       updated: "3 ore" },
  { sku: "FLT-033", name: "Filtru aer K&N 33-2990",                cat: "Filtre",      brand: "K&N",        stock: 12, min: 6,  price: 195, status: "ok",        updated: "15 min" },
  { sku: "IGN-077", name: "Bujii NGK Iridium IX BKR6EIX",          cat: "Aprindere",   brand: "NGK",        stock: 3,  min: 20, price: 62,  status: "critical",  updated: "22 min" },
  { sku: "OIL-004", name: "Ulei motor Liqui Moly 5W-40 5L",        cat: "Lubrifianți", brand: "Liqui Moly", stock: 34, min: 10, price: 310, status: "ok",        updated: "1 min" },
  { sku: "BEL-019", name: "Curea distribuție Gates K015591XS",     cat: "Transmisie",  brand: "Gates",      stock: 7,  min: 5,  price: 485, status: "ok",        updated: "45 min" },
  { sku: "RAD-003", name: "Radiator răcire Valeo 735481",           cat: "Răcire",      brand: "Valeo",      stock: 4,  min: 6,  price: 890, status: "low",       updated: "2 ore" },
  { sku: "BRG-021", name: "Rulment roată SKF VKBA 3568",           cat: "Rulmenți",    brand: "SKF",        stock: 9,  min: 8,  price: 275, status: "ok",        updated: "30 min" },
  { sku: "FLT-088", name: "Filtru combustibil Bosch 0 450 906 508",cat: "Filtre",      brand: "Bosch",      stock: 1,  min: 12, price: 115, status: "critical",  updated: "5 min" },
  { sku: "EXH-055", name: "Tobă eșapament Febi Bilstein 45799",    cat: "Evacuare",    brand: "Febi",       stock: 22, min: 4,  price: 540, status: "ok",        updated: "4 ore" },
];

/* ── config ── */
const STATUS_LABEL: Record<Status, string> = {
  ok:       "În stoc",
  low:      "Stoc scăzut",
  critical: "Critic",
  out:      "Epuizat",
};

const TABS: { key: Status | "all"; label: string }[] = [
  { key: "all",      label: "Toate" },
  { key: "ok",       label: "În stoc" },
  { key: "low",      label: "Stoc scăzut" },
  { key: "critical", label: "Critic" },
  { key: "out",      label: "Epuizat" },
];

type SortKey = "sku" | "name" | "stock" | "price";

/* ── row animation ── */
const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};

/* ── stock bar ── */
const StockBar = ({ stock, min, status }: { stock: number; min: number; status: Status }) => {
  const pct = min === 0 ? 0 : Math.min(100, (stock / (min * 3)) * 100);
  const color =
    status === "ok"       ? "var(--c-green)" :
    status === "low"      ? "var(--c-amber)" :
    status === "critical" ? "var(--c-red)"   : "#334155";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 24, textAlign: "right", fontSize: 13, color: "var(--t-primary)", fontWeight: 600 }}>
        {stock}
      </span>
      <div style={{ flex: 1, height: 4, borderRadius: 4, background: "var(--s-surface-3)", minWidth: 60, maxWidth: 80 }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
};

/* ── component ── */
const Inventory = () => {
  const [search, setSearch]   = useState("");
  const [tab, setTab]         = useState<Status | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("sku");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage]       = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    let data = INVENTORY;
    if (tab !== "all") data = data.filter(p => p.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)  ||
        p.brand.toLowerCase().includes(q)||
        p.cat.toLowerCase().includes(q)
      );
    }
    return [...data].sort((a, b) => {
      const av = (a[sortKey] as string | number);
      const bv = (b[sortKey] as string | number);
      const al = typeof av === "string" ? av.toLowerCase() : av;
      const bl = typeof bv === "string" ? bv.toLowerCase() : bv;
      if (al < bl) return sortDir === "asc" ? -1 : 1;
      if (al > bl) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
  }, [search, tab, sortKey, sortDir]);

  const totalVirtual = 1247;
  const pageCount    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabCounts = useMemo(() => ({
    all:      INVENTORY.length,
    ok:       INVENTORY.filter(p => p.status === "ok").length,
    low:      INVENTORY.filter(p => p.status === "low").length,
    critical: INVENTORY.filter(p => p.status === "critical").length,
    out:      INVENTORY.filter(p => p.status === "out").length,
  }), []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const allVisibleSelected = visible.length > 0 && selected.size === visible.length;
  const toggleAll = () =>
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map(p => p.sku)));
  const toggleOne = (sku: string) => {
    const next = new Set(selected);
    if (next.has(sku)) next.delete(sku); else next.add(sku);
    setSelected(next);
  };

  /* sort icon helper */
  const SortArrow = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ChevronUp size={11} style={{ opacity: 0.2 }} /> :
    sortDir === "asc"
      ? <ChevronUp   size={11} style={{ color: "var(--c-blue)" }} />
      : <ChevronDown size={11} style={{ color: "var(--c-blue)" }} />;

  return (
    <div>
      {/* ── Page header ── */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Inventar</h1>
          <p>Vizibilitate completă asupra stocului — {totalVirtual.toLocaleString()} produse indexate</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="dm-btn dm-btn-ghost">
            <Download size={14} /> Export CSV
          </button>
          <button className="dm-btn dm-btn-primary">
            <Plus size={14} /> Adaugă produs
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="dm-inv-toolbar">
        <div className="dm-inv-search">
          <Search size={14} />
          <input
            placeholder="Caută după nume, SKU, brand, categorie..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="dm-inv-clear" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <button className="dm-btn dm-btn-ghost">
          <SlidersHorizontal size={14} /> Filtre avansate
        </button>

        {selected.size > 0 && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--t-secondary)" }}>
              {selected.size} selectate
            </span>
            <button className="dm-btn dm-btn-ghost" style={{ color: "var(--c-red)", borderColor: "rgba(239,68,68,0.25)" }}>
              <Trash2 size={13} /> Șterge
            </button>
          </div>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="dm-inv-tabs">
        {TABS.map(t => (
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

      {/* ── Table ── */}
      <div className="dm-table-wrap">
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
              <th style={{ width: 110, cursor: "pointer" }} onClick={() => toggleSort("sku")}>
                <span className="dm-th-inner">SKU <SortArrow k="sku" /></span>
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("name")}>
                <span className="dm-th-inner">Produs <SortArrow k="name" /></span>
              </th>
              <th>Categorie</th>
              <th style={{ width: 180, cursor: "pointer" }} onClick={() => toggleSort("stock")}>
                <span className="dm-th-inner">Stoc <SortArrow k="stock" /></span>
              </th>
              <th style={{ width: 130 }}>Status</th>
              <th style={{ width: 120, textAlign: "right", cursor: "pointer" }} onClick={() => toggleSort("price")}>
                <span className="dm-th-inner" style={{ justifyContent: "flex-end" }}>
                  Preț (MDL) <SortArrow k="price" />
                </span>
              </th>
              <th style={{ width: 110 }}>Actualizat</th>
              <th style={{ width: 72 }} />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="dm-table-empty">
                      <Package size={32} />
                      <p>Niciun produs găsit</p>
                      <span>Încearcă să schimbi filtrul sau termenul de căutare</span>
                    </div>
                  </td>
                </tr>
              ) : visible.map((p, i) => (
                <motion.tr
                  key={p.sku}
                  className={selected.has(p.sku) ? "dm-tr-selected" : ""}
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
                      checked={selected.has(p.sku)}
                      onChange={() => toggleOne(p.sku)}
                    />
                  </td>
                  <td><span className="dm-td-sku">{p.sku}</span></td>
                  <td>
                    <div className="dm-td-name-wrap">
                      <strong>{p.name}</strong>
                      <span>{p.brand}</span>
                    </div>
                  </td>
                  <td><span className="dm-cat-pill">{p.cat}</span></td>
                  <td><StockBar stock={p.stock} min={p.min} status={p.status} /></td>
                  <td>
                    <span className={`dm-badge dm-badge-${p.status}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="dm-td-price">{p.price.toLocaleString("ro-MD")}</td>
                  <td className="dm-td-updated">acum {p.updated}</td>
                  <td>
                    <div className="dm-row-actions">
                      <button className="dm-row-act-btn" title="Editează">
                        <Edit2 size={13} />
                      </button>
                      <button className="dm-row-act-btn dm-row-act-danger" title="Șterge">
                        <Trash2 size={13} />
                      </button>
                      <button className="dm-row-act-btn" title="Mai multe">
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="dm-pagination">
        <span className="dm-pag-info">
          Afișând{" "}
          <strong>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong>{" "}
          din <strong>{totalVirtual.toLocaleString()}</strong> produse
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
    </div>
  );
};

export default Inventory;
