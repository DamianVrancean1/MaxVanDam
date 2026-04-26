import { useEffect, useRef, useState } from 'react';
import { getProducts } from '../../services/productService';

const STORAGE_KEY = 'admin_categories';
const STATUS_KEY = 'admin_category_statuses';

type Status = 'activ' | 'inactiv';

type Category = {
  name: string;
  fromProducts: boolean;
  status: Status;
};

const loadCustom = (): string[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
};

const loadStatuses = (): Record<string, Status> => {
  try { return JSON.parse(localStorage.getItem(STATUS_KEY) ?? '{}'); }
  catch { return {}; }
};

const saveCustom = (list: string[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

const saveStatuses = (map: Record<string, Status>) =>
  localStorage.setItem(STATUS_KEY, JSON.stringify(map));

const buildList = (custom: string[], statuses: Record<string, Status>): Category[] => {
  const productCats = Array.from(
    new Set(getProducts().map(p => p.category).filter(Boolean))
  );
  const all = Array.from(new Set([...productCats, ...custom]));
  return all.map(name => ({
    name,
    fromProducts: productCats.includes(name),
    status: statuses[name] ?? 'activ',
  }));
};

const CategoriesPage = () => {
  const [custom, setCustom] = useState<string[]>(loadCustom);
  const [statuses, setStatuses] = useState<Record<string, Status>>(loadStatuses);
  const [categories, setCategories] = useState<Category[]>(() =>
    buildList(loadCustom(), loadStatuses())
  );
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const refresh = (newCustom: string[], newStatuses: Record<string, Status>) => {
    setCustom(newCustom);
    setStatuses(newStatuses);
    saveCustom(newCustom);
    saveStatuses(newStatuses);
    setCategories(buildList(newCustom, newStatuses));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) { setAddError('Numele nu poate fi gol.'); return; }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setAddError('Această categorie există deja.');
      return;
    }
    refresh([...custom, trimmed], statuses);
    setNewName('');
    setAddError('');
    showToast('Categorie adăugată cu succes!');
  };

  const handleDelete = (name: string) => {
    const newStatuses = { ...statuses };
    delete newStatuses[name];
    refresh(custom.filter(c => c !== name), newStatuses);
  };

  const toggleStatus = (name: string, current: Status) => {
    const next: Status = current === 'activ' ? 'inactiv' : 'activ';
    const newStatuses = { ...statuses, [name]: next };
    refresh(custom, newStatuses);
    showToast(`Statut schimbat: ${name} → ${next}`);
  };

  const startEdit = (name: string) => {
    setEditingName(name);
    setEditValue(name);
  };

  const cancelEdit = () => { setEditingName(null); setEditValue(''); };

  const saveEdit = (oldName: string) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === oldName) { cancelEdit(); return; }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.name !== oldName)) {
      cancelEdit(); return;
    }
    const updatedCustom = custom.map(c => (c === oldName ? trimmed : c));
    if (!custom.includes(oldName)) updatedCustom.push(trimmed);
    const newStatuses = { ...statuses };
    if (oldName in newStatuses) {
      newStatuses[trimmed] = newStatuses[oldName];
      delete newStatuses[oldName];
    }
    refresh(updatedCustom, newStatuses);
    cancelEdit();
    showToast('Categorie actualizată!');
  };

  const productCountFor = (name: string) =>
    getProducts().filter(p => p.category === name).length;

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#16a34a', color: '#fff', padding: '14px 22px',
          borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-section-header">
            <div>
              <span className="admin-eyebrow">Catalog categorii</span>
              <h2>Categorii produse</h2>
            </div>
          </div>

          <form className="admin-form-grid" onSubmit={handleAdd} style={{ marginBottom: '24px' }}>
            <label className="admin-field">
              <span>Categorie nouă</span>
              <input
                value={newName}
                onChange={e => { setNewName(e.target.value); setAddError(''); }}
                placeholder="ex: Filtre, Frâne, Suspensie..."
              />
              {addError && (
                <span style={{ color: '#dc2626', fontWeight: 400, fontSize: '0.85rem' }}>{addError}</span>
              )}
            </label>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="admin-primary-button">Adaugă categorie</button>
            </div>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Categorie</th>
                  <th>Produse</th>
                  <th>Statut</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--admin-muted)', textAlign: 'center' }}>
                      Nicio categorie.
                    </td>
                  </tr>
                )}
                {categories.map(cat => (
                  <tr key={cat.name}>
                    <td>
                      {editingName === cat.name ? (
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(cat.name);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          style={{
                            border: '1px solid rgba(15,23,42,0.2)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            font: 'inherit',
                            width: '100%',
                          }}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td>{productCountFor(cat.name)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleStatus(cat.name, cat.status)}
                        style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: '8px',
                          fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                          background: cat.status === 'activ' ? '#dbeafe' : '#fee2e2',
                          color: cat.status === 'activ' ? '#1d4ed8' : '#dc2626',
                          transition: 'opacity .15s',
                        }}
                        title="Click pentru a schimba statutul"
                      >
                        {cat.status === 'activ' ? 'Activ' : 'Inactiv'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        {editingName === cat.name ? (
                          <>
                            <button
                              type="button"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'var(--admin-primary)' }}
                              onClick={() => saveEdit(cat.name)}
                            >
                              Salvează
                            </button>
                            <button
                              type="button"
                              className="admin-action-button"
                              onClick={cancelEdit}
                            >
                              Anulează
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'var(--admin-primary)' }}
                              onClick={() => startEdit(cat.name)}
                            >
                              Editează
                            </button>
                            {!cat.fromProducts && (
                              <button
                                type="button"
                                className="admin-action-button danger"
                                onClick={() => handleDelete(cat.name)}
                              >
                                Șterge
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoriesPage;
