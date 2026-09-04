import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/statsService';
import { reportService } from '../../services/reportService';
import { scheduleService } from '../../services/scheduleService';
import StatusBadge from '../common/StatusBadge';

/**
 * Component 4: Community Status & Dashboard
 * Responsibilities:
 * - Home & public municipal overview
 * - Metrics: Total reports, pending, in-progress, resolved, resolution percentage, active schedules
 * - Category breakdown and priority distribution
 * - Live recent activity streams and upcoming collection routines
 * - Consumes GET /api/stats, GET /api/reports, GET /api/schedules
 */
const DashboardModule = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, reportsRes, schedulesRes] = await Promise.all([
        statsService.getStats(),
        reportService.getReports(),
        scheduleService.getSchedules(),
      ]);

      setStats(statsRes.data);
      setRecentReports((reportsRes.data || []).slice(0, 5));
      setUpcomingSchedules((schedulesRes.data || []).slice(0, 5));
    } catch (err) {
      setError('Unable to fetch live community statistics. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (p) => {
    const val = (p || '').toLowerCase();
    if (val === 'high') return <span className="badge badge-high">🔴 High</span>;
    if (val === 'medium') return <span className="badge badge-medium">🟡 Medium</span>;
    return <span className="badge badge-low">🟢 Low</span>;
  };

  const getWastePill = (type) => {
    const val = (type || '').toLowerCase();
    if (val.includes('organic')) return <span className="waste-pill waste-pill-organic">{type}</span>;
    if (val.includes('recyclable') || val.includes('plastic')) {
      return <span className="waste-pill waste-pill-recyclable">{type}</span>;
    }
    return <span className="waste-pill waste-pill-general">{type}</span>;
  };

  const resolutionNumber = stats?.reports?.resolutionRate
    ? parseInt(stats.reports.resolutionRate.replace('%', ''), 10) || 0
    : 0;

  return (
    <div className="module-container">
      {/* Hero Welcome Card */}
      <div className="dashboard-hero-card">
        <div className="hero-content">
          <div className="hero-badge">🇱🇰 SRI LANKA MUNICIPAL WASTE NETWORK</div>
          <h1 className="hero-title">CleanRoute LK Community Dashboard</h1>
          <p className="hero-description">
            Unified municipal waste management & tracking system. Monitor routine garbage pickup schedules, report citizen waste issues, dispatch collection tasks, and verify neighborhood cleanliness in real-time.
          </p>

          <div className="hero-action-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate && onNavigate('reports')}
            >
              📢 Report a Waste Issue
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate && onNavigate('schedules')}
            >
              📅 View Collection Schedules
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate && onNavigate('status')}
            >
              🌐 Community Cleanliness Board
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="notice-box notice-error fade-in">
          <span>⚠️ {error}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadDashboardData}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="schedule-loading-state">
          <div className="spinner"></div>
          <p>Compiling live community metrics & statistics...</p>
        </div>
      ) : stats ? (
        <>
          {/* Key Community Metrics Grid */}
          <div className="stats-grid dashboard-stats-grid">
            {/* Total Reports */}
            <div
              className="stat-card stat-clickable"
              onClick={() => onNavigate && onNavigate('reports')}
              title="Click to view all citizen reports"
            >
              <div className="stat-title">Total Reports</div>
              <div className="stat-value">{stats.reports?.total || 0}</div>
              <div className="stat-footer-text">Registered citizen tickets</div>
            </div>

            {/* Pending Issues */}
            <div
              className="stat-card card-stat-pending stat-clickable"
              onClick={() => onNavigate && onNavigate('tasks')}
              title="Click to view pending tasks"
            >
              <div className="stat-title">⏳ Pending Issues</div>
              <div className="stat-value text-amber">{stats.reports?.pending || 0}</div>
              <div className="stat-footer-text">Awaiting field action</div>
            </div>

            {/* In Progress Issues */}
            <div
              className="stat-card card-stat-inprogress stat-clickable"
              onClick={() => onNavigate && onNavigate('tasks')}
              title="Click to view in-progress tasks"
            >
              <div className="stat-title">🔄 In Progress</div>
              <div className="stat-value text-blue">{stats.reports?.inProgress || 0}</div>
              <div className="stat-footer-text">Trucks / crews dispatched</div>
            </div>

            {/* Resolved Issues */}
            <div
              className="stat-card card-stat-resolved stat-clickable"
              onClick={() => onNavigate && onNavigate('reports')}
              title="Click to view resolved reports"
            >
              <div className="stat-title">✅ Resolved Issues</div>
              <div className="stat-value text-green">{stats.reports?.resolved || 0}</div>
              <div className="stat-footer-text">Cleaned & verified</div>
            </div>

            {/* Resolution Percentage */}
            <div className="stat-card">
              <div className="stat-title">Resolution Rate</div>
              <div className="stat-value text-green">{stats.reports?.resolutionRate || '0%'}</div>
              <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${resolutionNumber}%`,
                    backgroundColor: resolutionNumber >= 75 ? '#059669' : '#f59e0b',
                  }}
                />
              </div>
            </div>

            {/* Active Collection Schedules */}
            <div
              className="stat-card stat-clickable"
              onClick={() => onNavigate && onNavigate('schedules')}
              title="Click to manage collection schedules"
            >
              <div className="stat-title">📅 Active Schedules</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>
                {stats.schedules?.active || 0}
              </div>
              <div className="stat-footer-text">Weekly pickup routines</div>
            </div>
          </div>

          {/* Issue Categories & Priorities Breakdown */}
          <div className="dashboard-breakdown-row">
            {/* By Issue Type */}
            <div className="card breakdown-card">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️</span> Issues by Category
              </h3>
              <div className="category-breakdown-list">
                <div className="category-item">
                  <div className="category-label-row">
                    <span>🚛 Missed Collection</span>
                    <strong>{stats.byIssueType?.missedCollection || 0}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${
                          stats.reports?.total > 0
                            ? ((stats.byIssueType?.missedCollection || 0) / stats.reports.total) * 100
                            : 0
                        }%`,
                        backgroundColor: '#3b82f6',
                      }}
                    />
                  </div>
                </div>

                <div className="category-item">
                  <div className="category-label-row">
                    <span>🗑️ Overflowing Waste</span>
                    <strong>{stats.byIssueType?.overflowingWaste || 0}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${
                          stats.reports?.total > 0
                            ? ((stats.byIssueType?.overflowingWaste || 0) / stats.reports.total) * 100
                            : 0
                        }%`,
                        backgroundColor: '#f59e0b',
                      }}
                    />
                  </div>
                </div>

                <div className="category-item">
                  <div className="category-label-row">
                    <span>🚯 Illegal Dumping</span>
                    <strong>{stats.byIssueType?.illegalDumping || 0}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${
                          stats.reports?.total > 0
                            ? ((stats.byIssueType?.illegalDumping || 0) / stats.reports.total) * 100
                            : 0
                        }%`,
                        backgroundColor: '#ef4444',
                      }}
                    />
                  </div>
                </div>

                <div className="category-item">
                  <div className="category-label-row">
                    <span>📦 Other Waste Issues</span>
                    <strong>{stats.byIssueType?.other || 0}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${
                          stats.reports?.total > 0
                            ? ((stats.byIssueType?.other || 0) / stats.reports.total) * 100
                            : 0
                        }%`,
                        backgroundColor: '#6b7280',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* By Priority */}
            <div className="card breakdown-card">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔥</span> Issue Urgency Distribution
              </h3>
              <div className="priority-cards-grid">
                <div className="priority-stat-box box-high">
                  <span className="priority-box-num">{stats.byPriority?.high || 0}</span>
                  <span className="priority-box-label">🔴 High Urgency</span>
                  <span className="priority-box-sub">Needs immediate dispatch</span>
                </div>
                <div className="priority-stat-box box-medium">
                  <span className="priority-box-num">{stats.byPriority?.medium || 0}</span>
                  <span className="priority-box-label">🟡 Medium Urgency</span>
                  <span className="priority-box-sub">Standard priority</span>
                </div>
                <div className="priority-stat-box box-low">
                  <span className="priority-box-num">{stats.byPriority?.low || 0}</span>
                  <span className="priority-box-label">🟢 Low Urgency</span>
                  <span className="priority-box-sub">Minor inconvenience</span>
                </div>
              </div>

              <div className="community-status-cta">
                <div>
                  <strong>Need detailed neighborhood health?</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Check area cleanliness scores and collection health across all zones.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate && onNavigate('status')}
                >
                  🌐 View Community Status
                </button>
              </div>
            </div>
          </div>

          {/* Dual Live Feeds: Recent Reports & Upcoming Schedules */}
          <div className="dashboard-breakdown-row" style={{ marginTop: '1.5rem' }}>
            {/* Recent Reports Live Feed */}
            <div className="card breakdown-card">
              <div className="feed-header-row">
                <h3 className="card-title" style={{ margin: 0 }}>📢 Recent Citizen Reports</h3>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate && onNavigate('reports')}
                >
                  View All ({stats.reports?.total || 0})
                </button>
              </div>

              {recentReports.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>
                  No reports logged yet.
                </p>
              ) : (
                <div className="table-container" style={{ marginTop: '1rem', border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Area</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((r) => (
                        <tr
                          key={r._id}
                          className="table-row-clickable"
                          onClick={() => onNavigate && onNavigate('reports')}
                          title="Click to view report details"
                        >
                          <td>
                            <strong>{r.area}</strong>
                          </td>
                          <td>{r.issueType}</td>
                          <td>{getPriorityBadge(r.priority)}</td>
                          <td><StatusBadge type="status" value={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Upcoming Schedules Feed */}
            <div className="card breakdown-card">
              <div className="feed-header-row">
                <h3 className="card-title" style={{ margin: 0 }}>📅 Municipal Collection Routine</h3>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate && onNavigate('schedules')}
                >
                  View All ({stats.schedules?.total || 0})
                </button>
              </div>

              {upcomingSchedules.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>
                  No collection schedules configured yet.
                </p>
              ) : (
                <div className="table-container" style={{ marginTop: '1rem', border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Area</th>
                        <th>Day</th>
                        <th>Time Window</th>
                        <th>Waste Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingSchedules.map((s) => (
                        <tr
                          key={s._id}
                          className="table-row-clickable"
                          onClick={() => onNavigate && onNavigate('schedules')}
                          title="Click to view schedule details"
                        >
                          <td>
                            <strong>{s.areaName}</strong>
                          </td>
                          <td>
                            <span className="day-badge">{s.collectionDay}</span>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {s.collectionTime}
                          </td>
                          <td>{getWastePill(s.wasteType)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DashboardModule;
