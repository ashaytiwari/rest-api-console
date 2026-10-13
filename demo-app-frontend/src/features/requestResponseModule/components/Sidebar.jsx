import React, { useState } from 'react';

export const Sidebar = ({
  endpoints,
  selectedEndpoint,
  onSelectEndpoint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group endpoints
  const filteredEndpoints = endpoints.filter(
    (ep) =>
      ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups = Array.from(new Set(filteredEndpoints.map((ep) => ep.group)));

  return (
    <aside className="nexus-sidebar">
      <div className="sidebar-search-box">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Filter endpoints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
            ✕
          </button>
        )}
      </div>

      <div className="sidebar-groups-list">
        {groups.map((group) => {
          const groupEndpoints = filteredEndpoints.filter((ep) => ep.group === group);
          return (
            <div key={group} className="endpoint-group">
              <div className="group-header">
                <span className="group-title">{group}</span>
                <span className="group-count">{groupEndpoints.length}</span>
              </div>
              <div className="group-items">
                {groupEndpoints.map((ep) => {
                  const isSelected = selectedEndpoint?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      className={`endpoint-nav-item ${isSelected ? 'active' : ''}`}
                      onClick={() => onSelectEndpoint(ep)}
                    >
                      <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                        {ep.method}
                      </span>
                      <span className="endpoint-nav-name">{ep.name}</span>
                      {ep.requiresAuth && (
                        <span className="auth-lock-icon" title="Requires JWT Auth">
                          🔒
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
