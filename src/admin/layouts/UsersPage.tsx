import { useState } from 'react';
import type { StoredUser, UserRole } from '../../types';
import { getUsers, addUser, updateUserRole, deleteUser } from '../../services/userService';
import { adminUnlockAccount, getLockedAccounts } from '../../services/lockoutService';

const ROLES: UserRole[] = ['user', 'admin'];

const UsersPage = () => {
  const [users, setUsers] = useState<StoredUser[]>(() => getUsers());
  const [lockedAccounts, setLockedAccounts] = useState<string[]>(() => getLockedAccounts());

  // New user form state
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('user');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const refresh = () => {
    setUsers(getUsers());
    setLockedAccounts(getLockedAccounts());
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formUsername.trim() || !formPassword.trim() || !formEmail.trim()) {
      setFormError('Completează toate câmpurile.');
      return;
    }

    const result = addUser({
      username: formUsername.trim(),
      password: formPassword.trim(),
      email: formEmail.trim(),
      role: formRole,
    });

    if ('error' in result) {
      setFormError(result.error);
      return;
    }

    setFormSuccess(`Utilizatorul "${result.username}" a fost adăugat.`);
    setFormUsername('');
    setFormPassword('');
    setFormEmail('');
    setFormRole('user');
    refresh();
  };

  const handleRoleChange = (id: number, role: UserRole) => {
    updateUserRole(id, role);
    refresh();
  };

  const handleDelete = (user: StoredUser) => {
    if (!window.confirm(`Ștergi utilizatorul "${user.username}"?`)) return;
    deleteUser(user.id);
    refresh();
  };

  const handleUnlock = (username: string) => {
    adminUnlockAccount(username);
    refresh();
  };

  return (
    <div className="admin-users-page">

      {/* Locked accounts alert */}
      {lockedAccounts.length > 0 && (
        <section className="admin-card admin-locked-alert">
          <div className="admin-section-header">
            <h3>🔒 Conturi blocate ({lockedAccounts.length})</h3>
          </div>
          <div className="admin-locked-list">
            {lockedAccounts.map(username => (
              <div key={username} className="admin-locked-row">
                <span className="admin-locked-username">{username}</span>
                <button
                  type="button"
                  className="admin-unlock-btn"
                  onClick={() => handleUnlock(username)}
                >
                  Deblochează
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Users table */}
      <section className="admin-card">
        <div className="admin-section-header">
          <h3>Utilizatori ({users.length})</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isLocked = lockedAccounts.includes(user.username);
                return (
                  <tr key={user.id} className={isLocked ? 'admin-row-locked' : ''}>
                    <td>{user.id}</td>
                    <td>
                      <strong>{user.username}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="admin-role-select"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {isLocked ? (
                        <span className="admin-badge admin-badge-danger">BLOCAT</span>
                      ) : (
                        <span className="admin-badge admin-badge-success">ACTIV</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        {isLocked && (
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn-unlock"
                            onClick={() => handleUnlock(user.username)}
                          >
                            Deblochează
                          </button>
                        )}
                        <button
                          type="button"
                          className="admin-action-btn admin-action-btn-danger"
                          onClick={() => handleDelete(user)}
                        >
                          Șterge
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add user form */}
      <section className="admin-card">
        <div className="admin-section-header">
          <h3>Adaugă utilizator nou</h3>
        </div>

        <form className="admin-user-form" onSubmit={handleAddUser}>
          <div className="admin-form-row">
            <label className="admin-form-label">
              Username
              <input
                type="text"
                className="admin-form-input"
                value={formUsername}
                onChange={e => setFormUsername(e.target.value)}
                placeholder="username"
                autoComplete="off"
              />
            </label>
            <label className="admin-form-label">
              Parolă
              <input
                type="password"
                className="admin-form-input"
                value={formPassword}
                onChange={e => setFormPassword(e.target.value)}
                placeholder="parolă"
                autoComplete="new-password"
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label className="admin-form-label">
              Email
              <input
                type="email"
                className="admin-form-input"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                placeholder="email@exemplu.com"
              />
            </label>
            <label className="admin-form-label">
              Rol
              <select
                className="admin-form-input admin-role-select"
                value={formRole}
                onChange={e => setFormRole(e.target.value as UserRole)}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
          </div>

          {formError && <div className="admin-form-error">{formError}</div>}
          {formSuccess && <div className="admin-form-success">{formSuccess}</div>}

          <button type="submit" className="admin-primary-btn">
            + Adaugă utilizator
          </button>
        </form>
      </section>
    </div>
  );
};

export default UsersPage;
