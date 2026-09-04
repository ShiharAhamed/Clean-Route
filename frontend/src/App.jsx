import React, { useState } from 'react';
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

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderModule()}
      </main>
      <footer className="footer">
        <p>CleanRoute LK — Community Waste Management & Tracking System | 4-Hour Mini Hackathon</p>
      </footer>
    </div>
  );
}

export default App;
