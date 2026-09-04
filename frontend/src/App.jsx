import React, { useState } from 'react';
<<<<<<< HEAD
import { Navbar } from './components/common/Navbar';
import { ScheduleManagement } from './components/schedules/ScheduleManagement';
import { IssueReporting } from './components/reports/IssueReporting';
import { TaskManagement } from './components/tasks/TaskManagement';
import { CommunityDashboard } from './components/dashboard/CommunityDashboard';

export function App() {
  const [activeTab, setActiveTab] = useState('schedules');
=======
import Navbar from './components/common/Navbar';
import DashboardModule from './components/dashboard/DashboardModule';
import ScheduleModule from './components/schedules/ScheduleModule';
import ReportModule from './components/reports/ReportModule';
import TaskModule from './components/tasks/TaskModule';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'schedules':
        return <ScheduleModule />;
      case 'reports':
        return <ReportModule />;
      case 'tasks':
        return <TaskModule />;
      default:
        return <DashboardModule />;
    }
  };
>>>>>>> bac31862511e68fec5e9d8bd36b4c3be444d186c

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
<<<<<<< HEAD
        {activeTab === 'schedules' && <ScheduleManagement />}
        {activeTab === 'reports' && <IssueReporting />}
        {activeTab === 'tasks' && <TaskManagement />}
        {activeTab === 'dashboard' && <CommunityDashboard />}
      </main>
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        CleanRoute LK &bull; University Mini Hackathon Edition &bull; 4-Developer Modular Architecture
=======
        {renderModule()}
      </main>
      <footer className="footer">
        <p>CleanRoute LK — Community Waste Management & Tracking System | 4-Hour Mini Hackathon</p>
>>>>>>> bac31862511e68fec5e9d8bd36b4c3be444d186c
      </footer>
    </div>
  );
}

export default App;
