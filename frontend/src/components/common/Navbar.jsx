import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: '🏠 Home' },
  { id: 'schedules', label: '📅 Schedules' },
  { id: 'reports', label: '📢 Report Issue' },
  { id: 'tasks', label: '🚛 Tasks' },
  { id: 'resolve', label: '🛠️ Resolve Issue' },
  { id: 'status', label: '🌐 Community Status' },
];

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div
        className="brand brand-clickable"
        onClick={() => handleNavClick('home')}
        title="CleanRoute LK Home"
      >
        <span className="brand-logo">♻️</span>
        <div className="brand-text-container">
          <span className="brand-title">CleanRoute LK</span>
          <span className="brand-sub">Waste &amp; Route Tracking</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="nav-links desktop-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile Hamburger Toggle */}
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Dropdown Nav */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-button ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
