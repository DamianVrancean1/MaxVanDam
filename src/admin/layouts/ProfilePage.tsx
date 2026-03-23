import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deleteRegisteredUser, getAllUsers, updateUserRole } from '../../services/authService';
import type { UserRole } from '../../types';

type AdminUser = {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    password?: string;
};

const ProfilePage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadUsers = () => {
        const allUsers = getAllUsers();
        setUsers(allUsers);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = (username: string, role: UserRole) => {
        try {
            updateUserRole(username, role);
            loadUsers();
            setError('');
            setMessage(`Rolul utilizatorului ${username} a fost actualizat.`);
        } catch {
            setMessage('');
            setError('A apărut o eroare la actualizarea rolului.');
        }
    };

    const handleDelete = (username: string) => {
        if (user?.username === username) {
            setMessage('');
            setError('Nu îți poți șterge propriul cont.');
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to delete ${username}?`);
        if (!confirmed) return;

        try {
            deleteRegisteredUser(username);
            loadUsers();
            setError('');
            setMessage(`Utilizatorul ${username} a fost șters.`);
        } catch {
            setMessage('');
            setError('A apărut o eroare la ștergere.');
        }
    };

    return (
        <section className="admin-grid profile-grid">
            <article className="admin-card">
                <span className="admin-eyebrow">Cont administrator</span>
                <h2>{user?.username}</h2>
                <p>Email: {user?.email}</p>
                <p>Rol: {user?.role}</p>
            </article>

            <article className="admin-card">
                <span className="admin-eyebrow">Administrare utilizatori</span>
                <p>
                    Mai jos sunt afișați toți utilizatorii existenți din aplicație.
                    Poți schimba rolul sau șterge utilizatorii înregistrați.
                </p>
            </article>

            <article className="admin-card admin-card-full">
                <div className="admin-section-header">
                    <div>
                        <span className="admin-eyebrow">Users</span>
                        <h2>Lista utilizatorilor</h2>
                    </div>
                </div>

                {message && <div className="admin-feedback success">{message}</div>}
                {error && <div className="admin-feedback error">{error}</div>}

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nume</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Data creării</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((listedUser) => (
                            <tr key={listedUser.username}>
                                <td>{listedUser.id}</td>
                                <td>{listedUser.username}</td>
                                <td>{listedUser.email}</td>
                                <td>
                                    <select
                                        className="admin-role-select"
                                        value={listedUser.role}
                                        onChange={(e) =>
                                            handleRoleChange(listedUser.username, e.target.value as UserRole)
                                        }
                                        disabled={listedUser.username === 'admin'}
                                    >
                                        <option value="user">user</option>
                                        <option value="moderator">moderator</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>
                                <td>
                                    {listedUser.createdAt
                                        ? new Date(listedUser.createdAt).toLocaleDateString()
                                        : '-'}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="admin-action-button danger"
                                        onClick={() => handleDelete(listedUser.username)}
                                        disabled={listedUser.username === 'admin' || listedUser.username === user?.username}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
};

export default ProfilePage;