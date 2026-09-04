import React from 'react';

const WORKFLOW_STEPS = [
  { id: 'home', step: '1', title: 'Home', icon: '🏠', desc: 'Dashboard & KPIs' },
  { id: 'schedules', step: '2', title: 'Schedules', icon: '📅', desc: 'Weekly Routes' },
  { id: 'reports', step: '3', title: 'Report Issue', icon: '📢', desc: 'Citizen Reports' },
  { id: 'tasks', step: '4', title: 'Collection Tasks', icon: '🚛', desc: 'Field Operations' },
  { id: 'resolve', step: '5', title: 'Resolve Issue', icon: '🛠️', desc: 'Triage & Close' },
  { id: 'status', step: '6', title: 'Community Status', icon: '🌐', desc: 'Area Cleanliness' },
];

const WorkflowBanner = ({ activeTab, onNavigate }) => {
  return (
    <div className="workflow-stepper-container">
      <div className="workflow-header-info">
        <span className="workflow-eyebrow">🔄 CLEANROUTE LK END-TO-END WORKFLOW</span>
        <span className="workflow-subtitle">Follow the municipal waste lifecycle:</span>
      </div>

      <div className="workflow-steps-track">
        {WORKFLOW_STEPS.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <React.Fragment key={item.id}>
              <button
                type="button"
                className={`workflow-step-btn ${isActive ? 'step-active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={`Navigate to ${item.title}: ${item.desc}`}
              >
                <div className="step-badge-num">{item.step}</div>
                <div className="step-info">
                  <div className="step-title">
                    <span className="step-icon">{item.icon}</span> {item.title}
                  </div>
                  <div className="step-desc">{item.desc}</div>
                </div>
              </button>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="step-connector">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowBanner;
