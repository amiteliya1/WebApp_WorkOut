import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email || email.trim().length === 0) {
      newErrors.email = 'אימייל הוא שדה חובה';
    } else if (!validateEmail(email)) {
      newErrors.email = 'אנא הזן כתובת אימייל תקינה';
    }

    if (!password || password.length === 0) {
      newErrors.password = 'סיסמה היא שדה חובה';
    } else if (password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'הרשמה נכשלה');
    }

    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="card workout-form-card">
        <h2>הרשמה</h2>
        <form onSubmit={handleSubmit} className="workout-form">
          {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <div className="form-field">
            <label htmlFor="name">שם (אופציונלי)</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }));
                }
              }}
              placeholder="הזן שם"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">אימייל *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="your@email.com"
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="password">סיסמה *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="מינימום 6 תווים"
              required
              minLength={6}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary form-submit-btn"
            disabled={loading}
          >
            {loading ? 'נרשם...' : 'הירשם'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: '10px' }}>
              כבר יש לך חשבון?
            </p>
            <Link
              to="/login"
              style={{
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              התחבר כאן
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

