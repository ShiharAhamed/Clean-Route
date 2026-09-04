import React, { useState, useEffect } from 'react';
import { statsService } from '../../api/statsService';

export const CommunityDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await statsService.getStats();
      setStats(res.data || {});
    } catch (err) {
      setError(err.message || 'Failed to load community statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-module">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📊 Community Waste & Resolution Dashboard</h2>
            <p className="card-subtitle">
              Live transparency metrics on collection schedules, reported issues, and resolution turnaround across Sri Lanka.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchDashboardStats}>
            🔄 Refresh Stats
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Calculating dashboard statistics...</p>
        ) : error ? (
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        ) : stats ? (
          <>
            {/* KPI Metric Cards */}
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Reports
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-main)' }}>
                  {stats.totalReports || 0}
                </div>
              </div>

              <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Pending Action
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#b45309' }}>
                  {stats.pendingReports || 0}
                </div>
              </div>

              <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  In Progress
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#1d4ed8' }}>
                  {stats.inProgressReports || 0}
                </div>
              </div>

              <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Resolved Issues
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#047857' }}>
                  {stats.resolvedReports || 0}
                </div>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                  📦 Issues by Category
                </h3>
                {stats.reportsByIssueType?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No categorized data yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.reportsByIssueType?.map((item) => (
                      <div
                        key={item.issueType}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.8rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{item.issueType}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                  📍 Top Reported Areas
                </h3>
                {stats.reportsByArea?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No area data recorded yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.reportsByArea?.map((item) => (
                      <div
                        key={item.area}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.8rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{item.area}</span>
                        <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{item.count} reports</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
