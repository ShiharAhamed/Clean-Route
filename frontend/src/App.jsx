import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import WorkflowBanner from './components/common/WorkflowBanner';
import DashboardModule from './components/dashboard/DashboardModule';
import CommunityStatusView from './components/dashboard/CommunityStatusView';
import ScheduleModule from './components/schedules/ScheduleModule';
import ReportModule from './components/reports/ReportModule';
import TaskModule from './components/tasks/TaskModule';

const VALID_TABS = ['home', 'schedules', 'reports', 'tasks', 'resolve', 'status'];

function App() {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
    // Backward compatibility for old #dashboard link
    if (hash === 'dashboard') return 'home';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Sync state with browser hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
      } else if (hash === 'dashboard') {
        setActiveTab('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderModule = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardModule onNavigate={handleTabChange} />;
      case 'schedules':
        return <ScheduleModule onNavigate={handleTabChange} />;
      case 'reports':
        return <ReportModule onNavigate={handleTabChange} />;
      case 'tasks':
        return <TaskModule onNavigate={handleTabChange} />;
      case 'resolve':
        return <TaskModule onNavigate={handleTabChange} />;
      case 'status':
        return <CommunityStatusView onNavigate={handleTabChange} />;
      default:
        return <DashboardModule onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="main-content">
        {/* Visual Workflow Stepper Bar */}
        <WorkflowBanner activeTab={activeTab} onNavigate={handleTabChange} />

        {/* Current Active Module */}
        {renderModule()}
      </main>

      <footer className="footer">
        <p className="footer-title">
          CleanRoute LK — Community Waste Management & Operational Tracking System
        </p>
        <p className="footer-subtitle">
          Sri Lanka Municipal Garbage Routines • Citizen Reporting • Operational Dispatch • Cleanliness Index
        </p>
      </footer>
    </div>
  );
}

export default App;
