import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Te rog completează toate câmpurile');
      return;
    }

    const success = login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Nume utilizator sau parolă greșite');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Autentificare</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Nume utilizator"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Introdu numele de utilizator"
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

          {error && <div className="login-error">{error}</div>}

          <Button type="submit" variant="primary">
            Autentifică-te
          </Button>
        </form>

        <div className="login-info">
          <h3>Conturi de test:</h3>
          <p><strong>Admin:</strong> username: admin, password: admin123</p>
          <p><strong>User:</strong> username: user, password: user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
