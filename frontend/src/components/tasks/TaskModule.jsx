import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import StatusBadge from '../common/StatusBadge';

/**
 * Component 3: Collection Task Management
 * Assigned Developer: Developer 3
 * Responsibilities:
 * - Waste collection team / supervisor operational board
 * - Filter reported issues by status, priority, or area
 * - Update report status (Pending -> In Progress -> Resolved)
 * - Add resolution notes
 */
const TaskModule = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await reportService.getReports(params);
      setReports(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load operational tasks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>🛠️ Collection Task Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Triage, assign, and resolve reported community waste issues.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filter Status:</label>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {error && <div className="notice-box notice-error">{error}</div>}

        {loading ? (
          <p>Loading collection tasks...</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Issue Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reporter</th>
                  <th>Reported Time</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No tasks found for current filter.
                    </td>
                  </tr>
                ) : (
                  reports.map((task) => (
                    <tr key={task._id}>
                      <td><strong>{task.area}</strong></td>
                      <td>{task.issueType}</td>
                      <td><StatusBadge type="priority" value={task.priority} /></td>
                      <td><StatusBadge type="status" value={task.status} /></td>
                      <td>{task.reporterName} ({task.phone})</td>
                      <td>{new Date(task.reportedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModule;
