import React, { useState, useEffect, useMemo } from 'react';
import { reportService } from '../../services/reportService';
import { scheduleService } from '../../services/scheduleService';

const CommunityStatusView = ({ onNavigate }) => {
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Search & Filter
  const [searchArea, setSearchArea] = useState('');
  const [selectedHealth, setSelectedHealth] = useState('All');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const [reportsRes, schedulesRes] = await Promise.all([
        reportService.getReports(),
        scheduleService.getSchedules(),
      ]);
      setReports(reportsRes.data || []);
      setSchedules(schedulesRes.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to load community status data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Group and aggregate statistics by Area
  const areaStats = useMemo(() => {
    const map = {};

    // 1. Seed with areas from schedules
    schedules.forEach((sch) => {
      const areaKey = sch.areaName?.trim();
      if (!areaKey) return;
      if (!map[areaKey]) {
        map[areaKey] = {
          areaName: areaKey,
          totalReports: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          schedules: [],
        };
      }
      map[areaKey].schedules.push(sch);
    });

    // 2. Aggregate reports into areas
    reports.forEach((rep) => {
      const areaKey = rep.area?.trim();
      if (!areaKey) return;

      // Find best match or create key
      let matchedKey = Object.keys(map).find(
        (k) => k.toLowerCase() === areaKey.toLowerCase()
      );
      if (!matchedKey) {
        matchedKey = areaKey;
        map[matchedKey] = {
          areaName: matchedKey,
          totalReports: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          schedules: [],
        };
      }

      map[matchedKey].totalReports += 1;
      const st = (rep.status || 'Pending').toLowerCase();
      if (st === 'resolved') map[matchedKey].resolved += 1;
      else if (st === 'in progress') map[matchedKey].inProgress += 1;
      else map[matchedKey].pending += 1;
    });

    return Object.values(map).map((item) => {
      const resolutionRate =
        item.totalReports > 0
          ? Math.round((item.resolved / item.totalReports) * 100)
          : 100;

      let healthStatus = 'Clean';
      let healthClass = 'health-clean';
      let healthBadge = '🟢 Clean Area';

      if (item.pending >= 3 || resolutionRate < 50) {
        healthStatus = 'Action Required';
        healthClass = 'health-danger';
        healthBadge = '🔴 Attention Needed';
      } else if (item.pending > 0 || resolutionRate < 80) {
        healthStatus = 'Moderate';
        healthClass = 'health-warning';
        healthBadge = '🟡 Moderate Activity';
      }

      return {
        ...item,
        resolutionRate,
        healthStatus,
        healthClass,
        healthBadge,
      };
    });
  }, [reports, schedules]);

  // Filtered areas
  const filteredAreas = useMemo(() => {
    return areaStats.filter((item) => {
      const matchesSearch =
        searchArea.trim() === '' ||
        item.areaName.toLowerCase().includes(searchArea.toLowerCase().trim());

      const matchesHealth =
        selectedHealth === 'All' || item.healthStatus === selectedHealth;

      return matchesSearch && matchesHealth;
    });
  }, [areaStats, searchArea, selectedHealth]);

  // Overall Community KPIs
  const overallKPIs = useMemo(() => {
    const totalAreas = areaStats.length;
    const cleanAreas = areaStats.filter((a) => a.healthStatus === 'Clean').length;
    const attentionAreas = areaStats.filter((a) => a.healthStatus === 'Action Required').length;
    const totalReports = reports.length;
    const totalResolved = reports.filter((r) => r.status === 'Resolved').length;
    const overallRate = totalReports > 0 ? Math.round((totalResolved / totalReports) * 100) : 100;

    return { totalAreas, cleanAreas, attentionAreas, overallRate };
  }, [areaStats, reports]);

  return (
    <div className="module-container">
      <div className="card community-status-main-card">
        {/* Header */}
        <div className="community-header-row">
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>🌐</span> Community Cleanliness Status & Area Health Board
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Live area-by-area waste management health, neighborhood resolution rates, and municipal collection routine mapping.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchCommunityData}
            disabled={loading}
          >
            🔄 Refresh Status
          </button>
        </div>

        {errorMessage && (
          <div className="notice-box notice-error fade-in">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Community KPI Row */}
        <div className="community-kpi-grid">
          <div className="community-kpi-card">
            <span className="kpi-title">Monitored Municipal Areas</span>
            <span className="kpi-value">{overallKPIs.totalAreas}</span>
            <span className="kpi-subtitle">Active zones with routes/reports</span>
          </div>
          <div className="community-kpi-card">
            <span className="kpi-title">Clean / Low-Risk Zones</span>
            <span className="kpi-value text-green">{overallKPIs.cleanAreas}</span>
            <span className="kpi-subtitle">High resolution, zero backlog</span>
          </div>
          <div className="community-kpi-card">
            <span className="kpi-title">Attention Needed Zones</span>
            <span className="kpi-value text-amber">{overallKPIs.attentionAreas}</span>
            <span className="kpi-subtitle">Pending reports requiring dispatch</span>
          </div>
          <div className="community-kpi-card">
            <span className="kpi-title">Island-wide Resolution Rate</span>
            <span className="kpi-value text-blue">{overallKPIs.overallRate}%</span>
            <span className="kpi-subtitle">Citizen report resolution average</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-bar-container" style={{ marginTop: '1.5rem' }}>
          <div className="filter-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div className="filter-item">
              <label htmlFor="area-search" className="filter-label">
                🔍 Search Municipal Area
              </label>
              <input
                id="area-search"
                type="text"
                className="form-input"
                placeholder="Search neighborhood (e.g. Colombo, Kandy, Galle)..."
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label htmlFor="health-filter" className="filter-label">
                🏷️ Cleanliness Health
              </label>
              <select
                id="health-filter"
                className="form-select"
                value={selectedHealth}
                onChange={(e) => setSelectedHealth(e.target.value)}
              >
                <option value="All">All Health Statuses</option>
                <option value="Clean">Clean Area</option>
                <option value="Moderate">Moderate Activity</option>
                <option value="Action Required">Attention Needed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Area Health Status Table */}
        {loading ? (
          <div className="schedule-loading-state">
            <div className="spinner"></div>
            <p>Compiling community cleanliness status...</p>
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌐</div>
            <h3 className="empty-state-title">No Municipal Areas Match</h3>
            <p className="empty-state-text">
              No area data matches your search query. Try clearing your filters.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchArea('');
                setSelectedHealth('All');
              }}
            >
              🔄 Reset Search
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ marginTop: '1.25rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Municipal Area / Zone</th>
                  <th>Health Status</th>
                  <th>Resolution Rate</th>
                  <th>Issues (Total / Pending)</th>
                  <th>Active Collection Routine</th>
                  <th style={{ textAlign: 'right' }}>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAreas.map((area) => (
                  <tr key={area.areaName} className="community-row">
                    <td>
                      <div className="area-cell">
                        <span className="area-icon">📍</span>
                        <strong className="area-name">{area.areaName}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`health-pill ${area.healthClass}`}>
                        {area.healthBadge}
                      </span>
                    </td>
                    <td>
                      <div className="resolution-progress-cell">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${area.resolutionRate}%`,
                              backgroundColor:
                                area.resolutionRate >= 75
                                  ? '#059669'
                                  : area.resolutionRate >= 50
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="progress-text">{area.resolutionRate}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="report-count-summary">
                        <strong>{area.totalReports}</strong> total &nbsp;|&nbsp;{' '}
                        <span style={{ color: area.pending > 0 ? '#d97706' : '#059669', fontWeight: 600 }}>
                          {area.pending} pending
                        </span>
                      </span>
                    </td>
                    <td>
                      {area.schedules.length > 0 ? (
                        <div className="area-schedules-list">
                          {area.schedules.slice(0, 2).map((s) => (
                            <span key={s._id} className="mini-schedule-tag">
                              📅 {s.collectionDay} ({s.wasteType})
                            </span>
                          ))}
                          {area.schedules.length > 2 && (
                            <span className="mini-schedule-more">+{area.schedules.length - 2} more</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          No scheduled routine
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions-container">
                        <button
                          type="button"
                          className="btn-action btn-action-edit"
                          onClick={() => onNavigate && onNavigate('reports')}
                          title="Report an issue in this area"
                        >
                          📢 Report
                        </button>
                        <button
                          type="button"
                          className="btn-action"
                          onClick={() => onNavigate && onNavigate('schedules')}
                          title="View collection schedules"
                        >
                          📅 Schedules
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityStatusView;
