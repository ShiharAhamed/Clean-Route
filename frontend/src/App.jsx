import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { ScheduleManagement } from './components/schedules/ScheduleManagement';
import { IssueReporting } from './components/reports/IssueReporting';
import { TaskManagement } from './components/tasks/TaskManagement';
import { CommunityDashboard } from './components/dashboard/CommunityDashboard';

export function App() {
  const [activeTab, setActiveTab] = useState('schedules');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'schedules' && <ScheduleManagement />}
        {activeTab === 'reports' && <IssueReporting />}
        {activeTab === 'tasks' && <TaskManagement />}
        {activeTab === 'dashboard' && <CommunityDashboard />}
      </main>
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        CleanRoute LK &bull; University Mini Hackathon Edition &bull; 4-Developer Modular Architecture
      </footer>
    </div>
  );
}

export default App;
