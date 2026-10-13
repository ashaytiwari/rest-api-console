import React, { useState } from 'react';

export const Navbar = ({
  baseUrl,
  setBaseUrl,
  token,
  setToken,
  onOpenQuickLogin,
  onCheckHealth,
  healthStatus,
}) => {
  const [showTokenInput, setShowTokenInput] = useState(false);

  return (
    <header className="nexus-navbar">
      <div className="navbar-brand">
        <div className="brand-logo-badge">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-title">DemoApp</span>
          <span className="brand-subtitle">REST API Console</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="base-url-wrapper">
          <span className="url-prefix-label">BASE URL</span>
          <input
            type="text"
            className="base-url-input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:5000"
          />
        </div>

        <button
          className={`health-pill-btn ${healthStatus}`}
          onClick={onCheckHealth}
          title="Click to check backend connectivity"
        >
          <span className="status-dot"></span>
          <span className="status-label">
            {healthStatus === 'online'
              ? 'Backend Online'
              : healthStatus === 'offline'
              ? 'Server Offline'
              : healthStatus === 'checking'
              ? 'Checking...'
              : 'Ping Server'}
          </span>
        </button>
      </div>

      <div className="navbar-actions">
        {token ? (
          <div className="auth-status-container">
            <div className="auth-pill active" onClick={() => setShowTokenInput(!showTokenInput)}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="token-preview">Bearer Token Active</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <button
              className="clear-token-btn"
              onClick={() => setToken('')}
              title="Clear Token"
            >
              ✕
            </button>
          </div>
        ) : (
          <button className="quick-login-btn" onClick={onOpenQuickLogin}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Quick Login</span>
          </button>
        )}

        {showTokenInput && (
          <div className="token-popover">
            <div className="token-popover-header">
              <span>Active JWT Bearer Token</span>
              <button onClick={() => setShowTokenInput(false)}>✕</button>
            </div>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste custom JWT Token here..."
              rows={3}
            />
            <div className="token-popover-footer">
              <span className="token-hint">Auto-injected into Authorization header</span>
              <button
                className="popover-close-btn"
                onClick={() => setShowTokenInput(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
