import React from 'react';

<<<<<<< HEAD
export const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'schedules', label: '📅 Collection Schedules', dev: 'Dev 1' },
    { id: 'reports', label: '📢 Report an Issue', dev: 'Dev 2' },
    { id: 'tasks', label: '📋 Task Management', dev: 'Dev 3' },
    { id: 'dashboard', label: '📊 Community Dashboard', dev: 'Dev 4' },
=======
const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Community' },
    { id: 'schedules', label: 'Collection Schedules' },
    { id: 'reports', label: 'Report an Issue' },
    { id: 'tasks', label: 'Task Management' },
>>>>>>> bac31862511e68fec5e9d8bd36b4c3be444d186c
  ];

  return (
    <header className="navbar">
<<<<<<< HEAD
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
=======
      <div className="brand">
        <span>♻️</span>
        <span>CleanRoute LK</span>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
>>>>>>> bac31862511e68fec5e9d8bd36b4c3be444d186c
