import React from 'react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'schedules', label: '📅 Collection Schedules', dev: 'Dev 1' },
    { id: 'reports', label: '📢 Report an Issue', dev: 'Dev 2' },
    { id: 'tasks', label: '📋 Task Management', dev: 'Dev 3' },
    { id: 'dashboard', label: '📊 Community Dashboard', dev: 'Dev 4' },
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <span>🌿 CleanRoute LK</span>
          <span className="brand-badge">Community Portal</span>
        </div>
        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
