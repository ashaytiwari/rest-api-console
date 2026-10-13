import React from 'react';

export const RequestPane = ({
  endpoint,
  baseUrl,
  pathParams,
  setPathParam,
  requestBody,
  setRequestBody,
  token,
  onSendRequest,
  isLoading,
  onResetSample,
}) => {
  if (!endpoint) {
    return (
      <div className="request-pane-empty">
        <p>Select an endpoint from the sidebar to inspect and test</p>
      </div>
    );
  }

  // Calculate full URL
  let resolvedPath = endpoint.path;
  endpoint.pathParams?.forEach((param) => {
    const val = pathParams[param.key] || `:${param.key}`;
    resolvedPath = resolvedPath.replace(`:${param.key}`, val);
  });
  const fullUrl = `${baseUrl.replace(/\/$/, '')}${resolvedPath}`;

  const formatJsonBody = () => {
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore invalid json formatting
    }
  };

  return (
    <section className="nexus-request-pane">
      {/* Endpoint URL Bar */}
      <div className="endpoint-hero-bar">
        <div className="method-and-url">
          <span className={`method-badge-lg method-${endpoint.method.toLowerCase()}`}>
            {endpoint.method}
          </span>
          <span className="url-display" title={fullUrl}>
            {resolvedPath}
          </span>
        </div>

        <button
          className={`send-request-btn ${isLoading ? 'loading' : ''}`}
          onClick={onSendRequest}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner"></span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Send Request</span>
            </>
          )}
        </button>
      </div>

      <div className="endpoint-meta">
        <p className="endpoint-description">{endpoint.description}</p>
        <div className="meta-badges">
          {endpoint.requiresAuth ? (
            <span className="badge auth-badge">
              🔒 Requires Bearer Token {token ? '✓ Injected' : '⚠️ Missing'}
            </span>
          ) : (
            <span className="badge public-badge">🌐 Public Endpoint</span>
          )}
          <span className="badge full-url-badge" title="Full request URL">
            {fullUrl}
          </span>
        </div>
      </div>

      {/* Path Parameters */}
      {endpoint.pathParams && endpoint.pathParams.length > 0 && (
        <div className="params-section">
          <div className="section-title-bar">
            <h4>Path Parameters</h4>
          </div>
          <div className="params-grid">
            {endpoint.pathParams.map((param) => (
              <div key={param.key} className="param-field">
                <label>
                  <code>:{param.key}</code> <span className="param-label-text">({param.label})</span>
                </label>
                <input
                  type="text"
                  placeholder={param.placeholder}
                  value={pathParams[param.key] || ''}
                  onChange={(e) => setPathParam(param.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Headers */}
      <div className="headers-section">
        <div className="section-title-bar">
          <h4>Request Headers</h4>
        </div>
        <div className="headers-preview-table">
          <div className="header-row">
            <span className="header-key">Content-Type</span>
            <span className="header-val">application/json</span>
          </div>
          {endpoint.requiresAuth && (
            <div className="header-row">
              <span className="header-key">Authorization</span>
              <span className={`header-val ${token ? 'val-active' : 'val-warn'}`}>
                {token ? `Bearer ${token.substring(0, 16)}...` : 'None (Request will return 401)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Request Body */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div className="body-editor-section">
          <div className="section-title-bar">
            <h4>JSON Request Body</h4>
            <div className="editor-actions">
              <button className="editor-action-btn" onClick={formatJsonBody} type="button">
                Prettify JSON
              </button>
              <button className="editor-action-btn" onClick={onResetSample} type="button">
                Reset Sample
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="json-textarea"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="{\n  // Enter JSON payload\n}"
              rows={10}
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </section>
  );
};
