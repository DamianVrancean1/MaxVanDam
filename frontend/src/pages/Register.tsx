import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/Register.css';

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !email || !password || !confirmPassword) {
            setError('Te rog completează toate câmpurile');
            return;
        }

        if (password.length < 6) {
            setError('Parola trebuie să aibă cel puțin 6 caractere');
            return;
        }

        if (password !== confirmPassword) {
            setError('Parolele nu coincid');
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

        const alreadyExists = existingUsers.some(
            (user: { username: string; email: string }) =>
                user.username === username || user.email === email
        );

        if (alreadyExists) {
            setError('Există deja un cont cu acest nume de utilizator sau email');
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            role: 'user' as const,
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, newUser]));
        setSuccess('Cont creat cu succes! Vei fi redirecționat către autentificare.');

        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h1>Înregistrare</h1>

                <form onSubmit={handleSubmit} className="register-form">
                    <Input
                        label="Nume utilizator"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Alege un nume de utilizator"
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Introdu adresa de email"
                        required
                    />

                    <Input
                        label="Parolă"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Introdu parola"
                        required
                    />

                    <Input
                        label="Confirmă parola"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Reintrodu parola"
                        required
                    />

                    {error && <div className="register-error">{error}</div>}
                    {success && <div className="register-success">{success}</div>}

                    <div className="register-actions">
                        <Button type="submit" variant="primary">
                            Creează cont
                        </Button>

                        <Link to="/login" className="login-btn-secondary">
                            Ai deja cont? Autentifică-te
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;