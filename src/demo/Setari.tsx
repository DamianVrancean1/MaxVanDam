import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, Users, Shield, CreditCard, Warehouse,
  Edit2, Trash2, Check, X, ChevronRight, Plus,
  Eye, EyeOff, LogOut, Download, AlertTriangle,
  Activity, Package, ShoppingCart,
} from "lucide-react";

/* ── types ── */
type Tab = "profil" | "notificari" | "echipa" | "securitate" | "abonament" | "depozit";

/* ── mock data ── */
const USERS_DATA = [
  { name: "Admin Demo",    email: "admin@maxvandam.md",   role: "Administrator", status: "active",   lastSeen: "Acum",       avatar: "AD", color: "#3B82F6", isMe: true },
  { name: "Ion Munteanu", email: "ion.m@maxvandam.md",   role: "Manager",       status: "active",   lastSeen: "2 min",      avatar: "IM", color: "#10B981", isMe: false },
  { name: "Ana Popescu",  email: "ana.p@maxvandam.md",   role: "Operator",      status: "active",   lastSeen: "1 oră",      avatar: "AP", color: "#8B5CF6", isMe: false },
  { name: "Vlad Rusu",    email: "vlad.r@maxvandam.md",  role: "Operator",      status: "inactive", lastSeen: "3 zile",     avatar: "VR", color: "#F59E0B", isMe: false },
  { name: "Maria Ionescu",email: "maria.i@maxvandam.md", role: "Vizualizator",  status: "active",   lastSeen: "30 min",     avatar: "MI", color: "#06B6D4", isMe: false },
];

const AUDIT_LOG = [
  { action: "Login reușit",                    user: "Admin Demo",    time: "acum 2h",       icon: <Shield size={12} />,      color: "var(--c-green)" },
  { action: "Stoc actualizat (FLT-012)",       user: "Admin Demo",    time: "acum 3h",       icon: <Package size={12} />,     color: "var(--c-blue)" },
  { action: "Comandă creată (CMD-4821)",       user: "Ion Munteanu",  time: "acum 5h",       icon: <ShoppingCart size={12} />,color: "var(--c-blue)" },
  { action: "Export raport inventar",          user: "Ana Popescu",   time: "ieri, 15:30",   icon: <Download size={12} />,    color: "var(--c-amber)" },
  { action: "Setări platformă modificate",     user: "Admin Demo",    time: "ieri, 09:12",   icon: <Shield size={12} />,      color: "var(--c-purple)" },
];

const CATEGORIES = [
  { name: "Frâne",      count: 124, color: "#3B82F6" },
  { name: "Filtre",     count: 98,  color: "#10B981" },
  { name: "Suspensie",  count: 87,  color: "#F59E0B" },
  { name: "Motor",      count: 201, color: "#8B5CF6" },
  { name: "Evacuare",   count: 54,  color: "#06B6D4" },
  { name: "Rulmenți",   count: 43,  color: "#EF4444" },
];

const BILLING = [
  { month: "Mai 2025", amount: "599 MDL", status: "Plătit" },
  { month: "Apr 2025", amount: "599 MDL", status: "Plătit" },
  { month: "Mar 2025", amount: "599 MDL", status: "Plătit" },
];

/* ── CV ── */
const CV = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.32, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

/* ── Toggle switch ── */
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    style={{
      width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
      background: on ? "var(--c-green)" : "var(--s-surface-3)",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
      boxShadow: on ? "0 0 8px var(--c-green-dim)" : "none",
    }}
  >
    <span style={{
      position: "absolute", top: 3, left: on ? 18 : 3,
      width: 14, height: 14, borderRadius: "50%", background: "#fff",
      transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    }} />
  </button>
);

/* ── Field row (display-only) ── */
const Field = ({ label, value }: { label: string; value: string }) => (
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--t-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{
      background: "var(--s-surface-2)", border: "1px solid var(--s-border)",
      borderRadius: "var(--radius-sm)", padding: "0.6rem 0.875rem",
      fontSize: 13, color: "var(--t-primary)",
    }}>{value}</div>
  </div>
);

/* ── Role badge ── */
const RoleBadge = ({ role }: { role: string }) => {
  const cfg: Record<string, { color: string; dim: string }> = {
    Administrator: { color: "var(--c-blue)",   dim: "var(--c-blue-dim)" },
    Manager:       { color: "var(--c-purple)", dim: "var(--c-purple-dim)" },
    Operator:      { color: "var(--c-green)",  dim: "var(--c-green-dim)" },
    Vizualizator:  { color: "var(--t-muted)",  dim: "var(--s-surface-2)" },
  };
  const c = cfg[role] ?? cfg["Vizualizator"];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "0.18rem 0.55rem", borderRadius: 4,
      background: c.dim, color: c.color,
    }}>{role}</span>
  );
};

/* ══════════════════════════════════ TAB CONTENTS ══════════════════════════════════ */

const TabProfil = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
    {/* Left — Account info */}
    <motion.div variants={CV} initial="hidden" animate="visible" custom={0} className="dm-card dm-card-pad">
      <div className="dm-card-header">
        <div className="dm-card-title">Informații Cont</div>
        <button className="dm-btn dm-btn-ghost" style={{ height: 28, padding: "0 0.6rem", fontSize: 11 }}>
          <Edit2 size={12} /> Editează
        </button>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", padding: "0.875rem", background: "var(--s-surface-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--s-border)" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, var(--c-purple), var(--c-blue))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 800, color: "#fff",
          boxShadow: "0 0 16px rgba(139,92,246,0.3)",
        }}>AD</div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--t-primary)", marginBottom: 3 }}>Admin Demo</div>
          <div style={{ fontSize: 12, color: "var(--t-tertiary)", marginBottom: 6 }}>admin@maxvandam.md</div>
          <RoleBadge role="Administrator" />
        </div>
      </div>

      <Field label="Nume complet"  value="Admin Demo" />
      <Field label="Email"         value="admin@maxvandam.md" />
      <Field label="Telefon"       value="+373 69 XXX XXX" />
      <Field label="Limbă"         value="Română" />
      <Field label="Fus orar"      value="Europe/Chisinau (UTC+2)" />
    </motion.div>

    {/* Right — Stats + activity */}
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card dm-card-pad">
        <div className="dm-card-title" style={{ marginBottom: "1rem" }}>Statistici Cont</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
          {[
            { label: "Zile active",          value: "247",   icon: <Activity size={14} />, color: "var(--c-blue)" },
            { label: "Produse gestionate",   value: "1,247", icon: <Package size={14} />,  color: "var(--c-green)" },
            { label: "Comenzi procesate",    value: "892",   icon: <ShoppingCart size={14} />,color: "var(--c-purple)" },
            { label: "Alerte rezolvate",     value: "341",   icon: <Shield size={14} />,   color: "var(--c-amber)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--s-surface-2)", border: "1px solid var(--s-border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", textAlign: "center" }}>
              <div style={{ color: s.color, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--t-primary)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10.5, color: "var(--t-tertiary)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={CV} initial="hidden" animate="visible" custom={2} className="dm-card dm-card-pad">
        <div className="dm-card-title" style={{ marginBottom: "0.875rem" }}>Activitate Recentă</div>
        {[
          { text: "Actualizat stoc OIL-004",   time: "acum 5 min" },
          { text: "Procesat comandă CMD-4821",  time: "acum 1 oră" },
          { text: "Export raport inventar",     time: "acum 3 ore" },
          { text: "Adăugat utilizator nou",     time: "ieri, 14:20" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: i < 3 ? "1px solid var(--s-border)" : "none" }}>
            <span style={{ fontSize: 12.5, color: "var(--t-secondary)" }}>{a.text}</span>
            <span style={{ fontSize: 11, color: "var(--t-muted)", flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

const TabNotificari = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    stocCritic: true, stocScazut: true, comenziNoi: true,
    livrariIntarziate: true, rapoarte: false, sistem: false, newsletter: false,
  });
  const tog = (k: string) => setToggles(p => ({ ...p, [k]: !p[k] }));

  const NOTIFS = [
    { key: "stocCritic",        label: "Alerte stoc critic",      desc: "Notificat instant când un produs atinge pragul critic" },
    { key: "stocScazut",        label: "Alerte stoc scăzut",       desc: "Avertizare preventivă înainte de epuizare stoc" },
    { key: "comenziNoi",        label: "Comenzi noi",              desc: "Notificare la fiecare comandă înregistrată în sistem" },
    { key: "livrariIntarziate", label: "Livrări întârziate",       desc: "Alertă când o livrare depășește termenul estimat" },
    { key: "rapoarte",          label: "Rapoarte săptămânale",     desc: "Rezumat automat trimis în fiecare luni dimineața" },
    { key: "sistem",            label: "Actualizări sistem",       desc: "Notificări despre versiuni noi și mentenanță planificată" },
    { key: "newsletter",        label: "Newsletter MaxVanDam",     desc: "Noutăți despre platformă și sfaturi de utilizare" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <motion.div variants={CV} initial="hidden" animate="visible" custom={0} className="dm-card">
        <div className="dm-card-pad" style={{ borderBottom: "1px solid var(--s-border)" }}>
          <div className="dm-card-title">Preferințe Notificări</div>
          <div className="dm-card-subtitle">Alege tipurile de notificări pe care le primești</div>
        </div>
        {NOTIFS.map((n, i) => (
          <div key={n.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.9rem 1.25rem", borderBottom: i < NOTIFS.length - 1 ? "1px solid var(--s-border)" : "none",
            gap: "1rem",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t-primary)", marginBottom: 2 }}>{n.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--t-tertiary)" }}>{n.desc}</div>
            </div>
            <Toggle on={toggles[n.key]} onChange={() => tog(n.key)} />
          </div>
        ))}
      </motion.div>

      <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card dm-card-pad">
        <div className="dm-card-header" style={{ marginBottom: "1rem" }}>
          <div className="dm-card-title">Canale de Notificare</div>
        </div>
        {[
          { channel: "Email",        detail: "admin@maxvandam.md", active: true,  action: null },
          { channel: "SMS",          detail: "+373 69 XXX XXX",   active: true,  action: null },
          { channel: "Browser Push", detail: "Dezactivat",         active: false, action: "Activează" },
          { channel: "Slack",        detail: "Neconectat",         active: false, action: "Conectează" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: i < 3 ? "1px solid var(--s-border)" : "none" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t-primary)" }}>{c.channel}</div>
              <div style={{ fontSize: 11.5, color: c.active ? "var(--t-tertiary)" : "var(--t-muted)" }}>{c.detail}</div>
            </div>
            {c.active
              ? <span className="dm-badge dm-badge-ok"><Check size={10} /> Activ</span>
              : <button className="dm-btn dm-btn-ghost" style={{ height: 28, padding: "0 0.75rem", fontSize: 11 }}>{c.action}</button>
            }
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TabEchipa = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <motion.div variants={CV} initial="hidden" animate="visible" custom={0} className="dm-card" style={{ overflow: "hidden" }}>
      <div className="dm-card-pad" style={{ borderBottom: "1px solid var(--s-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="dm-card-title">Utilizatori Platformă</div>
          <div className="dm-card-subtitle">5 utilizatori activi din 15 permise</div>
        </div>
        <button className="dm-btn dm-btn-primary"><Plus size={13} /> Invită Utilizator</button>
      </div>
      <table className="dm-table">
        <thead>
          <tr>
            <th>Utilizator</th><th>Email</th><th>Rol</th><th>Status</th><th>Ultima activitate</th><th style={{ width: 60 }} />
          </tr>
        </thead>
        <tbody>
          {USERS_DATA.map((u, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{u.avatar}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--t-primary)" }}>
                    {u.name}{u.isMe && <span style={{ fontSize: 10, color: "var(--t-muted)", marginLeft: 4 }}>(tu)</span>}
                  </span>
                </div>
              </td>
              <td style={{ fontSize: 12, color: "var(--t-tertiary)" }}>{u.email}</td>
              <td><RoleBadge role={u.role} /></td>
              <td>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: u.status === "active" ? "var(--c-green)" : "var(--t-muted)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: u.status === "active" ? "var(--c-green)" : "var(--t-muted)", flexShrink: 0 }} />
                  {u.status === "active" ? "Activ" : "Inactiv"}
                </span>
              </td>
              <td style={{ fontSize: 12, color: "var(--t-tertiary)" }}>{u.lastSeen}</td>
              <td>
                {!u.isMe && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="dm-row-act-btn"><Edit2 size={12} /></button>
                    <button className="dm-row-act-btn dm-row-act-danger"><Trash2 size={12} /></button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>

    <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card dm-card-pad">
      <div className="dm-card-title" style={{ marginBottom: "0.875rem" }}>Invitații în așteptare</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0.875rem", background: "var(--s-surface-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--s-border)" }}>
        <div>
          <span style={{ fontSize: 13, color: "var(--t-primary)" }}>dev@example.com</span>
          <span style={{ fontSize: 11, color: "var(--t-tertiary)", marginLeft: 8 }}>Operator · trimis acum 2 zile</span>
        </div>
        <button className="dm-btn dm-btn-ghost" style={{ height: 28, padding: "0 0.6rem", fontSize: 11, color: "var(--c-red)", borderColor: "rgba(239,68,68,0.25)" }}>
          <X size={11} /> Revocă
        </button>
      </div>
    </motion.div>
  </div>
);

const TabSecuritate = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <motion.div variants={CV} initial="hidden" animate="visible" custom={0} className="dm-card dm-card-pad">
        <div className="dm-card-title" style={{ marginBottom: "1rem" }}>Autentificare</div>
        {[
          {
            label: "Parolă", detail: "Ultima schimbare acum 3 luni",
            action: <button className="dm-btn dm-btn-ghost" style={{ height: 28, padding: "0 0.6rem", fontSize: 11 }}><EyeOff size={11} /> Schimbă</button>,
          },
          {
            label: "Autentificare în 2 pași",
            detail: <span style={{ color: "var(--c-amber)", fontSize: 11 }}>⚠ Dezactivat</span>,
            action: (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 3, background: "var(--c-green-dim)", color: "var(--c-green)" }}>Recomandat</span>
                <button className="dm-btn dm-btn-primary" style={{ height: 28, padding: "0 0.75rem", fontSize: 11 }}>Activează</button>
              </div>
            ),
          },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 0", borderBottom: i === 0 ? "1px solid var(--s-border)" : "none", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t-primary)", marginBottom: 2 }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--t-tertiary)" }}>{r.detail}</div>
            </div>
            {r.action}
          </div>
        ))}
      </motion.div>

      <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card dm-card-pad">
        <div className="dm-card-title" style={{ marginBottom: "1rem" }}>Sesiuni Active</div>
        {[
          { browser: "Chrome · Windows", loc: "Chișinău, MD", time: "Acum",  current: true },
          { browser: "Safari · iPhone",  loc: "Chișinău, MD", time: "Acum 2h", current: false },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: i === 0 ? "1px solid var(--s-border)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.current ? "var(--c-green)" : "var(--t-muted)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--t-primary)" }}>{s.browser}</div>
                <div style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{s.loc} · {s.time}</div>
              </div>
            </div>
            {s.current
              ? <span style={{ fontSize: 10, color: "var(--c-green)" }}>Curentă</span>
              : <button className="dm-row-act-btn dm-row-act-danger" title="Deconectează"><LogOut size={11} /></button>
            }
          </div>
        ))}
      </motion.div>
    </div>

    <motion.div variants={CV} initial="hidden" animate="visible" custom={2} className="dm-card" style={{ overflow: "hidden" }}>
      <div className="dm-card-pad" style={{ borderBottom: "1px solid var(--s-border)" }}>
        <div className="dm-card-title">Jurnal de Acces</div>
        <div className="dm-card-subtitle">Ultimele activități înregistrate</div>
      </div>
      {AUDIT_LOG.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "0.8rem 1.25rem", borderBottom: i < AUDIT_LOG.length - 1 ? "1px solid var(--s-border)" : "none", alignItems: "flex-start" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${e.color}22`, border: `1.5px solid ${e.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: e.color, flexShrink: 0 }}>{e.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--t-primary)" }}>{e.action}</div>
            <div style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{e.user} · {e.time}</div>
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

const TabAbonament = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    {/* Current plan */}
    <motion.div variants={CV} initial="hidden" animate="visible" custom={0} className="dm-card dm-card-pad" style={{ border: "1px solid rgba(59,130,246,0.35)", background: "rgba(59,130,246,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--t-primary)" }}>Professional</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: "var(--c-blue-dim)", color: "var(--c-blue-lt)", padding: "0.2rem 0.6rem", borderRadius: 4 }}>Plan Curent</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--c-blue)", marginBottom: 8 }}>599 <span style={{ fontSize: 13, fontWeight: 400, color: "var(--t-tertiary)" }}>MDL / lună</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {["Până la 15 utilizatori", "Produse nelimitate", "Analytics avansat", "Import Excel/CSV", "Suport prioritar"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--t-secondary)" }}>
                <Check size={13} style={{ color: "var(--c-green)", flexShrink: 0 }} /> {f}
              </div>
            ))}
          </div>
        </div>
        <button className="dm-btn dm-btn-primary">Upgrade la Enterprise <ChevronRight size={13} /></button>
      </div>
    </motion.div>

    {/* Usage */}
    <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card dm-card-pad">
      <div className="dm-card-title" style={{ marginBottom: "1rem" }}>Utilizare Curentă</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Utilizatori", value: "5", max: "15",     pct: 33,   color: "var(--c-blue)" },
          { label: "Produse",     value: "1,247", max: "∞",  pct: 0,    color: "var(--c-green)" },
          { label: "API Calls",   value: "8,420", max: "50,000", pct: 17, color: "var(--c-purple)" },
        ].map(u => (
          <div key={u.label} style={{ background: "var(--s-surface-2)", borderRadius: "var(--radius-sm)", padding: "0.875rem", border: "1px solid var(--s-border)" }}>
            <div style={{ fontSize: 11, color: "var(--t-tertiary)", marginBottom: 4 }}>{u.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--t-primary)", marginBottom: 6 }}>
              {u.value}<span style={{ fontSize: 11, color: "var(--t-muted)", marginLeft: 4 }}>/ {u.max}</span>
            </div>
            {u.pct > 0 && (
              <>
                <div className="dm-progress-track">
                  <div className="dm-progress-fill" style={{ width: `${u.pct}%`, background: u.color }} />
                </div>
                <div style={{ fontSize: 10.5, color: "var(--t-muted)", marginTop: 4 }}>{u.pct}% utilizat</div>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>

    {/* Billing */}
    <motion.div variants={CV} initial="hidden" animate="visible" custom={2} className="dm-card" style={{ overflow: "hidden" }}>
      <div className="dm-card-pad" style={{ borderBottom: "1px solid var(--s-border)" }}>
        <div className="dm-card-title">Istoric Facturare</div>
      </div>
      <table className="dm-table">
        <thead><tr><th>Perioadă</th><th>Sumă</th><th>Status</th><th style={{ width: 100 }}>Acțiuni</th></tr></thead>
        <tbody>
          {BILLING.map((b, i) => (
            <tr key={i}>
              <td style={{ color: "var(--t-primary)", fontWeight: 500 }}>{b.month}</td>
              <td style={{ color: "var(--t-secondary)" }}>{b.amount}</td>
              <td><span className="dm-badge dm-badge-ok"><Check size={10} /> {b.status}</span></td>
              <td><button className="dm-btn dm-btn-ghost" style={{ height: 26, padding: "0 0.6rem", fontSize: 11 }}><Download size={11} /> PDF</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

const TabDepozit = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <motion.div variants={CV} initial="hidden" animate="visible" custom={0} className="dm-card dm-card-pad">
        <div className="dm-card-title" style={{ marginBottom: "1rem" }}>Informații Depozit</div>
        <Field label="Nume depozit"  value="Depozit Principal MV" />
        <Field label="Adresă"        value="str. Calea Ieșilor 8, Chișinău" />
        <Field label="Suprafață"     value="850 m²" />
        <Field label="Capacitate"    value="12,000 SKU-uri" />
        <Field label="Cod depozit"   value="WH-001" />
      </motion.div>

      <motion.div variants={CV} initial="hidden" animate="visible" custom={1} className="dm-card dm-card-pad">
        <div className="dm-card-title" style={{ marginBottom: "1rem" }}>Praguri Stoc Implicit</div>
        {[
          { label: "Prag Critic",        value: 3,  max: 20, color: "var(--c-red)" },
          { label: "Prag Scăzut",        value: 10, max: 50, color: "var(--c-amber)" },
          { label: "Comandă Automată",   value: 5,  max: 20, color: "var(--c-blue)" },
        ].map((p, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, color: "var(--t-secondary)" }}>{p.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: p.color }}>{p.value} unități</span>
            </div>
            <div style={{ position: "relative", height: 6, background: "var(--s-surface-3)", borderRadius: 6 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(p.value / p.max) * 100}%`, background: p.color, borderRadius: 6, transition: "width 0.6s" }} />
              <div style={{ position: "absolute", top: "50%", left: `${(p.value / p.max) * 100}%`, transform: "translate(-50%, -50%)", width: 12, height: 12, borderRadius: "50%", background: p.color, border: "2px solid var(--s-surface)", boxShadow: `0 0 6px ${p.color}` }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: "var(--t-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <AlertTriangle size={10} /> Demo — pragurile nu pot fi modificate
        </div>
      </motion.div>
    </div>

    <motion.div variants={CV} initial="hidden" animate="visible" custom={2} className="dm-card" style={{ overflow: "hidden" }}>
      <div className="dm-card-pad" style={{ borderBottom: "1px solid var(--s-border)" }}>
        <div className="dm-card-title">Categorii Produse</div>
        <div className="dm-card-subtitle">6 categorii active · 607 produse total</div>
      </div>
      {CATEGORIES.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.8rem 1.25rem", borderBottom: i < CATEGORIES.length - 1 ? "1px solid var(--s-border)" : "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--t-primary)" }}>{c.name}</span>
          <span style={{ fontSize: 12, color: "var(--t-tertiary)" }}>{c.count} produse</span>
          <div style={{ width: 80, height: 4, background: "var(--s-surface-3)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(c.count / 201) * 100}%`, background: c.color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

/* ══════════════════════════════════ MAIN ══════════════════════════════════ */

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "profil",      label: "Profil",                icon: <User size={15} /> },
  { key: "notificari",  label: "Notificări",            icon: <Bell size={15} /> },
  { key: "echipa",      label: "Echipă & Utilizatori",  icon: <Users size={15} /> },
  { key: "securitate",  label: "Securitate & Acces",    icon: <Shield size={15} /> },
  { key: "abonament",   label: "Abonament & Facturare", icon: <CreditCard size={15} /> },
  { key: "depozit",     label: "Configurare Depozit",   icon: <Warehouse size={15} /> },
];

const Setari = () => {
  const [tab, setTab] = useState<Tab>("profil");

  const content: Record<Tab, React.ReactNode> = {
    profil:     <TabProfil />,
    notificari: <TabNotificari />,
    echipa:     <TabEchipa />,
    securitate: <TabSecuritate />,
    abonament:  <TabAbonament />,
    depozit:    <TabDepozit />,
  };

  return (
    <div>
      {/* Header */}
      <div className="dm-page-header">
        <div className="dm-page-title">
          <h1>Setări</h1>
          <p>Configurare platformă și preferințe utilizator</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="dm-btn dm-btn-ghost" title="Demo — nu se salvează">Anulează</button>
          <button className="dm-btn dm-btn-primary" title="Demo — nu se salvează" style={{ opacity: 0.7 }}>
            <Check size={13} /> Salvează modificările
          </button>
        </div>
      </div>

      {/* Body: left nav + content */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Left nav */}
        <div className="dm-card" style={{ overflow: "hidden" }}>
          {NAV_ITEMS.map((n, i) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "0.75rem 1rem", border: "none",
                background: tab === n.key ? "var(--c-blue-dim)" : "transparent",
                borderLeft: `3px solid ${tab === n.key ? "var(--c-blue)" : "transparent"}`,
                color: tab === n.key ? "var(--c-blue-lt)" : "var(--t-secondary)",
                fontSize: 13, fontWeight: tab === n.key ? 600 : 400,
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                borderBottom: i < NAV_ITEMS.length - 1 ? "1px solid var(--s-border)" : "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <span style={{ color: tab === n.key ? "var(--c-blue)" : "var(--t-tertiary)" }}>{n.icon}</span>
              {n.label}
              {tab === n.key && <ChevronRight size={12} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {content[tab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Setari;
