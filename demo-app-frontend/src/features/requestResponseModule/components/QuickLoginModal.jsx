import React, { useState } from 'react';

export const QuickLoginModal = ({
  isOpen,
  onClose,
  baseUrl,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('test@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const url = `${baseUrl.replace(/\/$/, '')}/api/auth/login`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        onLoginSuccess(data.token, data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'Authentication failed');
      }
    } catch (err) {
      setErrorMsg(`Connection error: ${err.message}. Is backend running on ${baseUrl}?`);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setEmail('test@gmail.com');
    setPassword('test@123');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="modal-header-text">
            <h3>Quick JWT Authentication</h3>
            <p>Generate a test JWT token to unlock all protected user endpoints.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleLogin} className="modal-form">
          {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}

          <div className="form-field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@gmail.com"
              required
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="test@123"
              required
            />
          </div>

          <div className="preset-chip-row">
            <span>Preset Credentials:</span>
            <button
              type="button"
              className="preset-chip-btn"
              onClick={handleFillDefaults}
            >
              test@gmail.com / test@123
            </button>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login & Save Token'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
