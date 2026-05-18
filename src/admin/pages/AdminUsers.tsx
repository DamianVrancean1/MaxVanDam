import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Trash2, Edit2, Shield, ShieldOff,
  Search, X, Check, AlertTriangle, UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/apiClient';

/* ── types ── */
type Role = 'admin' | 'user';

interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

/* ── helpers ── */
const initials = (name: string) => name.slice(0, 2).toUpperCase();
const AVATAR_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4', '#EF4444', '#EC4899'];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'acum';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}z`;
}

/* ── Toast ── */
function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
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

/* ── ConfirmDialog ── */
function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="dm-modal-overlay" style={{ alignItems: 'center', justifyContent: 'center' }} onClick={onCancel}>
      <motion.div
        className="dm-confirm-box"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <AlertTriangle size={22} style={{ color: 'var(--c-red)', margin: '0 auto 0.75rem', display: 'block' }} />
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--t-primary)', marginBottom: '1.25rem' }}>{msg}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="dm-btn" onClick={onCancel}>Anulează</button>
          <button className="dm-btn dm-btn-danger" onClick={onConfirm}>Șterge</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── CreateUserDrawer ── */
function CreateUserDrawer({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: (u: User) => void;
}) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' as Role });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Obligatoriu';
    if (!form.email.trim()) e.email = 'Obligatoriu';
    if (!form.password.trim() || form.password.length < 6) e.password = 'Min. 6 caractere';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await apiFetch('/api/users/create', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      const user = await res.json() as User;
      onCreated(user);
    } catch (err) {
      setErrors({ _global: err instanceof Error ? err.message : 'Eroare server' });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', opts?: { options?: string[] }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--t-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</label>
      {opts?.options ? (
        <select
          className={`dm-input${errors[key] ? ' err' : ''}`} style={{ width: '100%' }}
          value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        >
          <option value="user">Utilizator</option>
          <option value="admin">Administrator</option>
        </select>
      ) : (
        <input
          type={type} className={`dm-input${errors[key] ? ' err' : ''}`} style={{ width: '100%' }}
          value={form[key]} placeholder={label}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        />
      )}
      {errors[key] && <p style={{ fontSize: 11, color: 'var(--c-red)', marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div className="dm-modal-overlay" style={{ justifyContent: 'flex-end' }} onClick={onClose}>
      <motion.div
        className="dm-drawer" style={{ width: 420 }}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--s-border-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserPlus size={16} style={{ color: 'var(--c-blue)' }} />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Utilizator nou</span>
          </div>
          <button className="dm-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {field('username', 'Username')}
          {field('email', 'Email', 'email')}
          {field('password', 'Parolă temporară', 'password')}
          {field('role', 'Rol', 'select', { options: ['user', 'admin'] })}
          {errors._global && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.625rem 0.875rem', fontSize: 13, color: '#f87171', marginTop: 8 }}>
              {errors._global}
            </div>
          )}
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--s-border-2)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="dm-btn" onClick={onClose}>Anulează</button>
          <button className="dm-btn dm-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Se creează...' : 'Creează utilizator'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── variants ── */
const rowVariants = {
  hidden:  { opacity: 0, y: 6 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const } }),
  exit:    { opacity: 0, transition: { duration: 0.12 } },
};

/* ── main ── */
export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState('');
  const [dq, setDq]           = useState('');
  const [filterRole, setFilterRole] = useState<'all' | Role>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [patchingId, setPatchingId] = useState<number | null>(null);
  const [toast, setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') =>
    setToast({ msg, type });

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await apiFetch('/api/users/list');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUsers(await res.json() as User[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcarea utilizatorilor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setDq(val), 300);
  };

  const handleRoleChange = async (id: number, role: Role) => {
    setPatchingId(id);
    try {
      const res = await apiFetch(`/api/users/${id}/role`, {
        method: 'PUT', body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json() as User;
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
      showToast('Rol actualizat');
    } catch { showToast('Eroare la schimbarea rolului', 'error'); }
    finally { setPatchingId(null); }
  };

  const handleStatusToggle = async (u: User) => {
    setPatchingId(u.id);
    try {
      const res = await apiFetch(`/api/users/${u.id}/status`, {
        method: 'PATCH', body: JSON.stringify({ isActive: !u.isActive }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json() as User;
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, ...updated } : x));
      showToast(updated.isActive ? 'Cont activat' : 'Cont dezactivat');
    } catch { showToast('Eroare la schimbarea statusului', 'error'); }
    finally { setPatchingId(null); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast('Utilizator șters');
    } catch { showToast('Eroare la ștergere', 'error'); }
    finally { setDeleteId(null); }
  };

  const filtered = users.filter(u => {
    const q = dq.toLowerCase();
    const matchQ = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = filterRole === 'all' || u.role === filterRole;
    return matchQ && matchR;
  });

  const TABS: { label: string; value: 'all' | Role }[] = [
    { label: `Toți (${users.length})`, value: 'all' },
    { label: `Admini (${users.filter(u => u.role === 'admin').length})`, value: 'admin' },
    { label: `Utilizatori (${users.filter(u => u.role === 'user').length})`, value: 'user' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={18} style={{ color: 'var(--c-blue)' }} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--t-primary)', margin: 0 }}>
            Utilizatori <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--t-tertiary)', marginLeft: 6 }}>{users.length} total</span>
          </h2>
        </div>
        <button className="dm-btn dm-btn-primary" onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Plus size={14} /> Utilizator nou
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', fontSize: 13, color: '#f87171' }}>
          <AlertTriangle size={13} style={{ marginRight: 6 }} /> {error}
        </div>
      )}

      {/* Filters */}
      <div style={{ background: 'var(--s-elevated)', border: '1px solid var(--s-border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--s-surface)', border: '1px solid var(--s-border-2)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', flex: '1 1 220px' }}>
            <Search size={13} style={{ color: 'var(--t-tertiary)', flexShrink: 0 }} />
            <input
              value={search} onChange={e => handleSearch(e.target.value)}
              placeholder="Caută după nume sau email..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--t-primary)', width: '100%' }}
            />
            {search && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-tertiary)', padding: 0 }}><X size={12} /></button>}
          </div>

          {/* Role tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map(t => (
              <button
                key={t.value} onClick={() => setFilterRole(t.value)}
                className="dm-tab-btn"
                style={{
                  padding: '0.35rem 0.875rem', borderRadius: 'var(--radius-sm)', fontSize: 12.5, fontWeight: 500,
                  border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                  background: filterRole === t.value ? 'rgba(59,130,246,0.12)' : 'transparent',
                  borderColor: filterRole === t.value ? 'rgba(59,130,246,0.35)' : 'var(--s-border)',
                  color: filterRole === t.value ? 'var(--c-blue)' : 'var(--t-secondary)',
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--s-elevated)', border: '1px solid var(--s-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--s-border-2)' }}>
              {['Utilizator', 'Rol', 'Status', 'Creat', 'Ultima autentificare', 'Acțiuni'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--t-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--s-border)' }}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ height: 14, borderRadius: 4, background: 'var(--s-surface-2)', width: j === 0 ? 140 : 60, animation: 'pulse 1.5s ease-in-out infinite' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--t-tertiary)', fontSize: 13 }}>Niciun utilizator găsit</td></tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((u, i) => {
                  const isMe = u.id === me?.id;
                  const isPending = patchingId === u.id;
                  return (
                    <motion.tr
                      key={u.id} custom={i} variants={rowVariants} initial="hidden" animate="visible" exit="exit"
                      style={{ borderBottom: '1px solid var(--s-border)', opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}
                    >
                      {/* Avatar + name */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColor(u.id), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                            {initials(u.username)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>
                              {u.username}
                              {isMe && <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(59,130,246,0.15)', color: 'var(--c-blue)', borderRadius: 4, padding: '1px 6px' }}>Tu</span>}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--t-tertiary)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {isMe ? (
                          <span style={{ fontSize: 12, fontWeight: 600, color: u.role === 'admin' ? 'var(--c-blue)' : 'var(--t-secondary)', background: u.role === 'admin' ? 'rgba(59,130,246,0.12)' : 'var(--s-surface-2)', borderRadius: 4, padding: '2px 8px' }}>
                            {u.role === 'admin' ? 'Administrator' : 'Utilizator'}
                          </span>
                        ) : (
                          <select
                            value={u.role} disabled={isPending}
                            onChange={e => handleRoleChange(u.id, e.target.value as Role)}
                            style={{ background: 'var(--s-surface)', border: '1px solid var(--s-border-2)', borderRadius: 'var(--radius-sm)', padding: '3px 8px', fontSize: 12, color: 'var(--t-primary)', cursor: 'pointer' }}
                          >
                            <option value="user">Utilizator</option>
                            <option value="admin">Administrator</option>
                          </select>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            disabled={isMe || isPending}
                            onClick={() => handleStatusToggle(u)}
                            style={{
                              width: 36, height: 20, borderRadius: 10, border: 'none', cursor: isMe ? 'default' : 'pointer',
                              background: u.isActive ? 'var(--c-green)' : 'var(--s-surface-3)',
                              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                            }}
                          >
                            <span style={{ position: 'absolute', top: 3, left: u.isActive ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                          </button>
                          <span style={{ fontSize: 12, color: u.isActive ? 'var(--c-green)' : 'var(--t-tertiary)' }}>
                            {u.isActive ? 'Activ' : 'Inactiv'}
                          </span>
                        </div>
                      </td>

                      {/* Created */}
                      <td style={{ padding: '0.875rem 1rem', fontSize: 12, color: 'var(--t-tertiary)' }}>
                        {new Date(u.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Last login */}
                      <td style={{ padding: '0.875rem 1rem', fontSize: 12, color: 'var(--t-tertiary)' }}>
                        {timeAgo(u.lastLoginAt)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            title={u.isActive ? 'Dezactivează' : 'Activează'}
                            disabled={isMe || isPending}
                            onClick={() => handleStatusToggle(u)}
                            className="dm-icon-btn"
                            style={{ opacity: isMe ? 0.35 : 1 }}
                          >
                            {u.isActive ? <ShieldOff size={14} /> : <Shield size={14} />}
                          </button>
                          <button
                            title="Șterge utilizator"
                            disabled={isMe || isPending}
                            onClick={() => setDeleteId(u.id)}
                            className="dm-icon-btn"
                            style={{ opacity: isMe ? 0.35 : 1, color: isMe ? undefined : 'var(--c-red)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateUserDrawer
            key="create-drawer"
            onClose={() => setShowCreate(false)}
            onCreated={u => { setUsers(prev => [...prev, u]); setShowCreate(false); showToast(`Utilizatorul "${u.username}" a fost creat`); }}
          />
        )}
        {deleteId !== null && (
          <ConfirmDialog
            key="confirm"
            msg={`Ești sigur că vrei să ștergi utilizatorul "${users.find(u => u.id === deleteId)?.username}"? Această acțiune este ireversibilă.`}
            onConfirm={() => handleDelete(deleteId)}
            onCancel={() => setDeleteId(null)}
          />
        )}
        {toast && <Toast key="toast" msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
