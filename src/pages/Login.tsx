import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import {
  checkLockout,
  recordFailedAttempt,
  clearAttempts,
  getLockoutEntry,
} from '../services/lockoutService';
import '../styles/Login.css';

interface LocationState {
  from?: string;
}

const MAX_ATTEMPTS = 3;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [tempLockRemaining, setTempLockRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Countdown timer for temp lockout
  useEffect(() => {
    if (tempLockRemaining <= 0) return;
    const id = setTimeout(() => {
      const next = tempLockRemaining - 1;
      setTempLockRemaining(next);
      if (next === 0) {
        // Timer expired → account is now permanently locked
        setIsAccountLocked(true);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [tempLockRemaining]);

  const isLocked = isAccountLocked || tempLockRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Te rog completează toate câmpurile');
      return;
    }

    // Check lockout status before attempting login
    const lockStatus = checkLockout(username);

    if (lockStatus.type === 'account_locked') {
      setIsAccountLocked(true);
      return;
    }

    if (lockStatus.type === 'temp_locked') {
      setTempLockRemaining(Math.ceil(lockStatus.remainingMs / 1000));
      return;
    }

    setIsSubmitting(true);
    const loggedUser = await login(username, password);
    setIsSubmitting(false);

    if (!loggedUser) {
      const newStatus = recordFailedAttempt(username);

      if (newStatus.type === 'account_locked') {
        setIsAccountLocked(true);
        return;
      }

      if (newStatus.type === 'temp_locked') {
        setTempLockRemaining(Math.ceil(newStatus.remainingMs / 1000));
        return;
      }

      // Still have attempts left
      const entry = getLockoutEntry(username);
      const remaining = MAX_ATTEMPTS - entry.attempts;
      setError(
        remaining > 0
          ? `Credențiale invalide. Mai ai ${remaining} ${remaining === 1 ? 'încercare' : 'încercări'}.`
          : 'Credențiale invalide.'
      );
      return;
    }

    clearAttempts(username);

    const state = location.state as LocationState | null;
    if (state?.from) {
      navigate(state.from, { replace: true });
      return;
    }

    if (loggedUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    navigate('/products', { replace: true });
  };

  return (
    <div className="login-page">
      <Link to="/" className="back-btn">← Acasă</Link>

      <div className="login-container">
        <h1>Autentificare</h1>

        {/* Account permanently locked */}
        {isAccountLocked && (
          <div className="login-lockout-banner">
            <span className="lockout-icon">🔒</span>
            <div>
              <strong>Cont blocat</strong>
              <p>Prea multe încercări eșuate. Contactează un administrator pentru deblocare.</p>
            </div>
          </div>
        )}

        {/* Temporarily locked — show countdown */}
        {!isAccountLocked && tempLockRemaining > 0 && (
          <div className="login-countdown-banner">
            <span className="lockout-icon">⏱</span>
            <div>
              <strong>Prea multe încercări</strong>
              <p>
                Încearcă din nou peste{' '}
                <span className="countdown-value">{tempLockRemaining}s</span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Nume utilizator"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Introdu numele de utilizator"
            required
            disabled={isLocked}
          />

          <Input
            label="Parolă"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introdu parola"
            required
            disabled={isLocked}
          />

          {error && <div className="login-error">{error}</div>}

          <Button type="submit" variant="primary" disabled={isLocked || isSubmitting}>
            {isSubmitting ? 'Se verifică...' : 'Autentifică-te'}
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
