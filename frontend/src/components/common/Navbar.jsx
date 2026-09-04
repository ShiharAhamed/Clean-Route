import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Community' },
    { id: 'schedules', label: 'Collection Schedules' },
    { id: 'reports', label: 'Report an Issue' },
    { id: 'tasks', label: 'Task Management' },
  ];

  return (
    <header className="navbar">
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
