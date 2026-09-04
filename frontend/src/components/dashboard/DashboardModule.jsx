import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/statsService';

/**
 * Component 4: Community Status & Dashboard
 * Assigned Developer: Developer 4
 * Responsibilities:
 * - Public and municipal aggregate overview
 * - Metrics: Total reports, resolution rate, priority distribution, schedule count
 * - Consumes GET /api/stats
 */
const DashboardModule = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await statsService.getStats();
      setStats(res.data);
      setError(null);
    } catch (err) {
      setError('Unable to fetch live community statistics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-container">
      <div className="card">
        <h2 className="card-title">📊 Community Waste & Cleanliness Status</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Real-time overview of municipal waste collection schedules, reported issues, and resolution efficiency across Sri Lanka.
        </p>

        {error && <div className="notice-box notice-error">{error}</div>}

        {loading ? (
          <p>Loading community statistics...</p>
        ) : stats ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">Active Schedules</div>
                <div className="stat-value" style={{ color: 'var(--primary)' }}>
                  {stats.schedules?.active || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Total Reports</div>
                <div className="stat-value">{stats.reports?.total || 0}</div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Pending Issues</div>
                <div className="stat-value" style={{ color: '#d97706' }}>
                  {stats.reports?.pending || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">In Progress</div>
                <div className="stat-value" style={{ color: '#2563eb' }}>
                  {stats.reports?.inProgress || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Resolved Issues</div>
                <div className="stat-value" style={{ color: '#059669' }}>
                  {stats.reports?.resolved || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Resolution Rate</div>
                <div className="stat-value" style={{ color: '#059669' }}>
                  {stats.reports?.resolutionRate || '0%'}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Reports by Issue Category</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Issue Type</th>
                      <th>Report Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Missed Collection</td>
                      <td><strong>{stats.byIssueType?.missedCollection || 0}</strong></td>
                    </tr>
                    <tr>
                      <td>Overflowing Waste</td>
                      <td><strong>{stats.byIssueType?.overflowingWaste || 0}</strong></td>
                    </tr>
                    <tr>
                      <td>Illegal Dumping</td>
                      <td><strong>{stats.byIssueType?.illegalDumping || 0}</strong></td>
                    </tr>
                    <tr>
                      <td>Other Issues</td>
                      <td><strong>{stats.byIssueType?.other || 0}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardModule;
