import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from './endpointsConfig';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RequestPane } from './components/RequestPane';
import { ResponsePane } from './components/ResponsePane';
import { QuickLoginModal } from './components/QuickLoginModal';
import './ApiExplorer.css';

export const ApiExplorer = () => {
  const [baseUrl, setBaseUrl] = useState('http://localhost:8000');
  const [token, setToken] = useState(() => localStorage.getItem('demo_app_jwt') || '');
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [pathParams, setPathParams] = useState({});
  const [requestBody, setRequestBody] = useState(() => ENDPOINTS[0]?.defaultBody || '');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState('idle'); // 'idle' | 'checking' | 'online' | 'offline'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('demo_app_jwt', token);
    } else {
      localStorage.removeItem('demo_app_jwt');
    }
  }, [token]);

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody || '');
    setPathParams({});
    setResponse(null);
  };

  const checkHealth = useCallback(async () => {
    setHealthStatus('checking');
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/health`, {
        method: 'GET',
      });
      if (res.ok) {
        setHealthStatus('online');
      } else {
        setHealthStatus('offline');
      }
    } catch {
      setHealthStatus('offline');
    }
  }, [baseUrl]);

  // Check health on initial load
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleSetPathParam = (key, value) => {
    setPathParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetSample = () => {
    if (selectedEndpoint) {
      setRequestBody(selectedEndpoint.defaultBody || '');
    }
  };

  const handleSendRequest = useCallback(async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setResponse(null);

    // Resolve URL with path parameters
    let resolvedPath = selectedEndpoint.path;
    selectedEndpoint.pathParams?.forEach((param) => {
      const val = pathParams[param.key] || '';
      resolvedPath = resolvedPath.replace(`:${param.key}`, val);
    });

    const fullUrl = `${baseUrl.replace(/\/$/, '')}${resolvedPath}`;

    // Prepare headers
    const reqHeaders = {
      'Content-Type': 'application/json',
    };

    if (selectedEndpoint.requiresAuth && token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method: selectedEndpoint.method,
      headers: reqHeaders,
    };

    if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && requestBody) {
      try {
        // Validate JSON
        JSON.parse(requestBody);
        options.body = requestBody;
      } catch (err) {
        setIsLoading(false);
        setResponse({
          status: 400,
          statusText: 'Bad Request (Client Error)',
          time: 0,
          size: '0 B',
          data: {
            error: 'Invalid JSON body syntax. Please fix the JSON before sending.',
            syntaxError: err.message,
          },
          headers: {},
        });
        return;
      }
    }

    const startTime = performance.now();

    try {
      const res = await fetch(fullUrl, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text };
      }

      // Convert headers to object
      const headerObj = {};
      res.headers.forEach((val, key) => {
        headerObj[key] = val;
      });

      // Calculate approximate size
      const stringified = JSON.stringify(data);
      const bytes = new Blob([stringified]).size;
      const formattedSize = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;

      // Auto capture token if it's the login endpoint
      if (selectedEndpoint.id === 'test-login' && data.token) {
        setToken(data.token);
      }

      setResponse({
        status: res.status,
        statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
        time: duration,
        size: formattedSize,
        data,
        headers: headerObj,
      });
    } catch (error) {
      const endTime = performance.now();
      setResponse({
        status: 0,
        statusText: 'Network / Connection Error',
        time: Math.round(endTime - startTime),
        size: '0 B',
        data: {
          error: error.message,
          hint: `Ensure backend server is running on ${baseUrl} and CORS is allowed.`,
        },
        headers: {},
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedEndpoint, pathParams, baseUrl, token, requestBody]);

  // Keyboard shortcut: Cmd/Ctrl + Enter to send request
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendRequest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSendRequest]);

  const handleUseToken = (newToken) => {
    setToken(newToken);
  };

  const handleUseUserId = (userId) => {
    setPathParams((prev) => ({ ...prev, id: userId }));
  };

  return (
    <div className="nexus-api-explorer">
      <Navbar
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        token={token}
        setToken={setToken}
        onOpenQuickLogin={() => setIsLoginModalOpen(false || true)}
        onCheckHealth={checkHealth}
        healthStatus={healthStatus}
      />

      <main className="nexus-main-layout">
        <Sidebar
          endpoints={ENDPOINTS}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={handleSelectEndpoint}
        />

        <div className="nexus-workspace-grid">
          <RequestPane
            endpoint={selectedEndpoint}
            baseUrl={baseUrl}
            pathParams={pathParams}
            setPathParam={handleSetPathParam}
            requestBody={requestBody}
            setRequestBody={setRequestBody}
            token={token}
            onSendRequest={handleSendRequest}
            isLoading={isLoading}
            onResetSample={handleResetSample}
          />

          <ResponsePane
            response={response}
            onUseToken={handleUseToken}
            onUseUserId={handleUseUserId}
          />
        </div>
      </main>

      <QuickLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        baseUrl={baseUrl}
        onLoginSuccess={(newToken) => {
          setToken(newToken);
        }}
      />
    </div>
  );
};
