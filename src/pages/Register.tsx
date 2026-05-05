import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError('Te rog completează toate câmpurile.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Parolele nu coincid.');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="login-page">
      <Link to="/" className="back-btn">← Acasă</Link>

      <div className="login-container">
        <h1>Înregistrare</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <Input label="Nume utilizator" type="text" name="username"
            value={form.username} onChange={handleChange}
            placeholder="Alege un nume de utilizator" required />
          <Input label="Email" type="email" name="email"
            value={form.email} onChange={handleChange}
            placeholder="adresa@email.com" required />
          <Input label="Parolă" type="password" name="password"
            value={form.password} onChange={handleChange}
            placeholder="Minim 6 caractere" required />
          <Input label="Confirmă parola" type="password" name="confirm"
            value={form.confirm} onChange={handleChange}
            placeholder="Repetă parola" required />
          {error && <div className="login-error">{error}</div>}
          <Button type="submit" variant="primary">Creează cont</Button>
        </form>
        <div className="login-info">
          <p>Ai deja cont? <Link to="/login" style={{ color: '#e94560' }}>Autentifică-te</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
