import React, { useState } from 'react';

export const ResponsePane = ({ response, onUseToken, onUseUserId }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('body'); // 'body' | 'headers'

  if (!response) {
    return (
      <section className="nexus-response-pane empty">
        <div className="response-placeholder">
          <div className="placeholder-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3>No Response Yet</h3>
          <p>Click "Send Request" or press Cmd+Enter to execute the API call and view output.</p>
        </div>
      </section>
    );
  }

  const { status, statusText, time, size, data, headers } = response;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusClass = (code) => {
    if (code >= 200 && code < 300) return 'status-2xx';
    if (code >= 300 && code < 400) return 'status-3xx';
    if (code >= 400 && code < 500) return 'status-4xx';
    return 'status-5xx';
  };

  // Check if response contains useful tokens or IDs
  const returnedToken = data?.token;
  const returnedUserId =
    data?.data?._id ||
    (Array.isArray(data?.data) && data?.data[0]?._id) ||
    data?._id;

  return (
    <section className="nexus-response-pane">
      <div className="response-header-bar">
        <div className="response-meta-group">
          <span className={`status-badge ${getStatusClass(status)}`}>
            {status} {statusText}
          </span>
          <span className="metric-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {time} ms
          </span>
          {size && (
            <span className="metric-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {size}
            </span>
          )}
        </div>

        <div className="response-tabs">
          <button
            className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            Response Body
          </button>
          <button
            className={`tab-btn ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            Headers
          </button>
        </div>

        <div className="response-actions">
          <button className="copy-btn" onClick={handleCopy} title="Copy JSON">
            {copied ? '✓ Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {/* Quick Context Actions */}
      {(returnedToken || returnedUserId) && (
        <div className="response-smart-actions">
          <span className="smart-action-label">Quick Actions:</span>
          {returnedToken && onUseToken && (
            <button className="smart-action-chip" onClick={() => onUseToken(returnedToken)}>
              🔑 Set as Active JWT Token
            </button>
          )}
          {returnedUserId && onUseUserId && (
            <button className="smart-action-chip" onClick={() => onUseUserId(returnedUserId)}>
              🆔 Use User ID: {returnedUserId.substring(0, 8)}...
            </button>
          )}
        </div>
      )}

      {/* Response Content */}
      <div className="response-body-viewer">
        {activeTab === 'body' ? (
          <pre className="json-output">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ) : (
          <div className="response-headers-list">
            {headers && Object.keys(headers).length > 0 ? (
              Object.entries(headers).map(([k, v]) => (
                <div key={k} className="header-entry">
                  <span className="h-key">{k}:</span>
                  <span className="h-val">{v}</span>
                </div>
              ))
            ) : (
              <p className="no-headers">No response headers captured.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
