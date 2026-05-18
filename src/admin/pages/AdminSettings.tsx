import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, User, Shield, Building2, Check,
  Eye, EyeOff, AlertTriangle, Lock, Mail, Edit2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/apiClient';

type Tab = 'platforma' | 'securitate' | 'profil';

/* ── Toast ── */
function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="dm-toast-wrap">
      <motion.div
        className={`dm-toast ${type}`}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
      >
        {type === 'success' ? <Check size={13} /> : <AlertTriangle size={13} />}
        {msg}
      </motion.div>
    </div>
  );
}

/* ── Toggle ── */
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    style={{
      width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
      background: on ? 'var(--c-green)' : 'var(--s-surface-3)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}
  >
    <span style={{ position: 'absolute', top: 3, left: on ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
  </button>
);

/* ── Field ── */
const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--t-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

/* ── AuditLog entry category icon ── */
const CATEGORY_COLOR: Record<string, string> = {
  system:   'var(--c-blue)',
  config:   'var(--c-purple)',
  security: 'var(--c-amber)',
  user:     'var(--c-green)',
  export:   'var(--t-tertiary)',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'acum';
  if (m < 60) return `acum ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `acum ${h}h`;
  return `acum ${Math.floor(h / 24)}z`;
}

/* ═══════════════════════════════════════════════ TAB: PLATFORMĂ */
function PlatformTab() {
  const [settings, setSettings] = useState<Record<string, string | number> | null>(null);
  const [editing, setEditing]   = useState<Record<string, string>>({});
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    apiFetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        const e: Record<string, string> = {};
        for (const [k, v] of Object.entries(data)) e[k] = String(v);
        setEditing(e);
      })
      .catch(() => setToast({ msg: 'Nu s-au putut încărca setările', type: 'error' }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, string | number> = {};
      for (const [k, v] of Object.entries(editing)) {
        body[k] = isNaN(Number(v)) ? v : Number(v);
      }
      const res = await apiFetch('/api/settings', {
        method: 'PATCH', body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setSettings(updated);
      setToast({ msg: 'Setările au fost salvate', type: 'success' });
    } catch {
      setToast({ msg: 'Eroare la salvare', type: 'error' });
    } finally { setSaving(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--s-surface)', border: '1px solid var(--s-border-2)',
    borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: 13,
    color: 'var(--t-primary)', outline: 'none',
  };

  const FIELDS: { key: string; label: string; type?: string }[] = [
    { key: 'companyName',            label: 'Denumire companie' },
    { key: 'warehouseAddress',       label: 'Adresă depozit' },
    { key: 'contactEmail',           label: 'Email contact', type: 'email' },
    { key: 'currency',               label: 'Monedă' },
    { key: 'criticalStockThreshold', label: 'Prag stoc critic', type: 'number' },
    { key: 'lowStockThreshold',      label: 'Prag stoc scăzut', type: 'number' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
        {FIELDS.map(f => (
          <FieldRow key={f.key} label={f.label}>
            <input
              type={f.type ?? 'text'}
              style={inputStyle}
              value={editing[f.key] ?? ''}
              onChange={e => setEditing(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={settings ? String(settings[f.key] ?? '') : '...'}
            />
          </FieldRow>
        ))}
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <button
          className="dm-btn dm-btn-primary"
          onClick={handleSave}
          disabled={saving || !settings}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {saving ? 'Se salvează...' : <><Check size={13} /> Salvează setările</>}
        </button>
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════ TAB: SECURITATE */
interface AuditEntry { action: string; user: string; time: string; category: string; }

function SecurityTab() {
  const [log, setLog]       = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [notifLogin, setNotifLogin]   = useState(true);
  const [notifExport, setNotifExport] = useState(false);
  const [twoFa, setTwoFa]             = useState(false);

  useEffect(() => {
    apiFetch('/api/audit-log?limit=20')
      .then(r => r.ok ? r.json() : [])
      .then(data => setLog(data as AuditEntry[]))
      .catch(() => setLog([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Notif settings */}
      <div style={{ background: 'var(--s-surface)', border: '1px solid var(--s-border)', borderRadius: 'var(--radius-sm)', padding: '1.125rem 1.25rem' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Notificări securitate</p>
        {[
          { label: 'Notificare la login nou', sub: 'Email la fiecare autentificare', val: notifLogin, set: setNotifLogin },
          { label: 'Notificare la export', sub: 'Email la export rapoarte', val: notifExport, set: setNotifExport },
          { label: 'Autentificare în doi pași (2FA)', sub: 'TOTP via aplicație autentificator', val: twoFa, set: setTwoFa },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--s-border)' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--t-primary)', marginBottom: 2 }}>{row.label}</p>
              <p style={{ fontSize: 11.5, color: 'var(--t-tertiary)' }}>{row.sub}</p>
            </div>
            <Toggle on={row.val} onChange={() => row.set(v => !v)} />
          </div>
        ))}
      </div>

      {/* Audit log */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Jurnal de activitate</p>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '0.625rem 0', borderBottom: '1px solid var(--s-border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--s-surface-2)', marginTop: 5 }} />
              <div style={{ flex: 1, height: 14, borderRadius: 4, background: 'var(--s-surface-2)' }} />
            </div>
          ))
        ) : log.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--t-tertiary)', padding: '1rem 0' }}>Nicio intrare în jurnal</p>
        ) : (
          <div style={{ background: 'var(--s-surface)', border: '1px solid var(--s-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderBottom: i < log.length - 1 ? '1px solid var(--s-border)' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLOR[entry.category] ?? 'var(--t-tertiary)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--t-primary)', margin: 0 }}>{entry.action}</p>
                  <p style={{ fontSize: 11, color: 'var(--t-tertiary)', margin: 0 }}>by {entry.user}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--t-tertiary)', whiteSpace: 'nowrap' }}>{timeAgo(entry.time)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ TAB: PROFIL ADMIN */
function ProfileTab() {
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState({ username: user?.username ?? '', email: user?.email ?? '' });
  const [pwForm, setPwForm]           = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw]           = useState({ old: false, new: false, confirm: false });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading]           = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      const res = await apiFetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('Profil actualizat cu succes');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Eroare la actualizare', 'error');
    } finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast('Parolele noi nu coincid', 'error'); return;
    }
    if (pwForm.newPassword.length < 6) {
      showToast('Parola nouă trebuie să aibă min. 6 caractere', 'error'); return;
    }
    setPwLoading(true);
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('Parola a fost schimbată');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Eroare la schimbarea parolei', 'error');
    } finally { setPwLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--s-surface)', border: '1px solid var(--s-border-2)',
    borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: 13,
    color: 'var(--t-primary)', outline: 'none',
  };

  const initials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile info */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>
            {initials(user?.username ?? 'AD')}
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--t-primary)', margin: 0 }}>{user?.username}</p>
            <p style={{ fontSize: 12, color: 'var(--t-tertiary)', margin: 0 }}>{user?.email} · {user?.role}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
          <FieldRow label="Username">
            <div style={{ position: 'relative' }}>
              <input type="text" style={{ ...inputStyle, paddingRight: 36 }} value={profileForm.username} onChange={e => setProfileForm(p => ({ ...p, username: e.target.value }))} />
              <Edit2 size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-tertiary)' }} />
            </div>
          </FieldRow>
          <FieldRow label="Email">
            <div style={{ position: 'relative' }}>
              <input type="email" style={{ ...inputStyle, paddingRight: 36 }} value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
              <Mail size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-tertiary)' }} />
            </div>
          </FieldRow>
        </div>

        <button
          className="dm-btn dm-btn-primary"
          onClick={handleProfileSave}
          disabled={profileLoading}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {profileLoading ? 'Se salvează...' : <><Check size={13} /> Salvează profilul</>}
        </button>
      </div>

      <div style={{ height: 1, background: 'var(--s-border)' }} />

      {/* Change password */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={12} /> Schimbare parolă
        </p>

        {([
          { key: 'oldPassword', label: 'Parola curentă', showKey: 'old' as const },
          { key: 'newPassword', label: 'Parola nouă', showKey: 'new' as const },
          { key: 'confirmPassword', label: 'Confirmă parola nouă', showKey: 'confirm' as const },
        ] as const).map(f => (
          <FieldRow key={f.key} label={f.label}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw[f.showKey] ? 'text' : 'password'}
                style={{ ...inputStyle, paddingRight: 36 }}
                value={pwForm[f.key]}
                onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder="••••••••"
              />
              <button
                onClick={() => setShowPw(p => ({ ...p, [f.showKey]: !p[f.showKey] }))}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-tertiary)', padding: 0 }}
              >
                {showPw[f.showKey] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </FieldRow>
        ))}

        <button
          className="dm-btn dm-btn-primary"
          onClick={handlePasswordChange}
          disabled={pwLoading || !pwForm.oldPassword || !pwForm.newPassword}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {pwLoading ? 'Se schimbă...' : <><Lock size={13} /> Schimbă parola</>}
        </button>
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════ MAIN */
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'platforma',  label: 'Platformă',    icon: <Building2 size={14} /> },
  { id: 'securitate', label: 'Securitate',   icon: <Shield size={14} /> },
  { id: 'profil',     label: 'Profil Admin', icon: <User size={14} /> },
];

const CV = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>('platforma');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Settings size={18} style={{ color: 'var(--c-blue)' }} />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--t-primary)', margin: 0 }}>Setări</h2>
      </div>

      {/* Card with tabs */}
      <div style={{ background: 'var(--s-elevated)', border: '1px solid var(--s-border)', borderRadius: 'var(--radius)' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--s-border-2)', padding: '0 1.25rem' }}>
          {TABS.map(t => (
            <button
              key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0.875rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, borderBottom: '2px solid',
                marginBottom: -1,
                borderColor: tab === t.id ? 'var(--c-blue)' : 'transparent',
                color: tab === t.id ? 'var(--c-blue)' : 'var(--t-secondary)',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '1.75rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} variants={CV} initial="hidden" animate="visible" exit="exit">
              {tab === 'platforma'  && <PlatformTab />}
              {tab === 'securitate' && <SecurityTab />}
              {tab === 'profil'     && <ProfileTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
