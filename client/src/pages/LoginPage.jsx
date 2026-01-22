import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'התחברות נכשלה');
    }

    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="card workout-form-card">
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit} className="workout-form">
          {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <div className="form-field">
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">סיסמה</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הזן סיסמה"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary form-submit-btn"
            disabled={loading}
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: '10px' }}>
              אין לך חשבון?
            </p>
            <Link
              to="/register"
              style={{
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              הירשם כאן
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

