import React, { useState, useEffect } from 'react';
import { reportService } from '../../api/reportService';
import { StatusBadge } from '../common/StatusBadge';

export const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Active task being resolved/updated
  const [activeTask, setActiveTask] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [resolutionNote, setResolutionNote] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportService.getReports(statusFilter ? { status: statusFilter } : {});
      setTasks(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load task queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleOpenUpdate = (task) => {
    setActiveTask(task);
    setNewStatus(task.status);
    setResolutionNote(task.resolutionNote || '');
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!activeTask) return;

    try {
      await reportService.updateReport(activeTask._id, {
        status: newStatus,
        resolutionNote,
      });
      setActiveTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  };

  return (
    <div className="task-module">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📋 Collection Task Management</h2>
            <p className="card-subtitle">
              Sanitation worker & dispatch console to resolve reported issues and record field resolution notes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-secondary ${statusFilter === '' ? 'btn-primary' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              All Tasks
            </button>
            <button
              className={`btn btn-secondary ${statusFilter === 'Pending' ? 'btn-primary' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending
            </button>
            <button
              className={`btn btn-secondary ${statusFilter === 'In Progress' ? 'btn-primary' : ''}`}
              onClick={() => setStatusFilter('In Progress')}
            >
              In Progress
            </button>
            <button
              className={`btn btn-secondary ${statusFilter === 'Resolved' ? 'btn-primary' : ''}`}
              onClick={() => setStatusFilter('Resolved')}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Action Modal / Edit Drawer */}
        {activeTask && (
          <form onSubmit={handleSaveUpdate} className="card" style={{ background: '#f8fafc', border: '2px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Update Task #{activeTask._id.slice(-6)} - {activeTask.area} ({activeTask.issueType})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Reported by: <strong>{activeTask.reporterName}</strong> ({activeTask.phone}) • {activeTask.description}
            </p>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Task Status *</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Resolution Note / Action Taken</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Cleared by Truck #4B; Compactor dispatched."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTask(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Update Task Status
              </button>
            </div>
          </form>
        )}

        {/* Tasks List */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
        ) : error ? (
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
            No tasks found for this filter.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Area / Location</th>
                  <th>Issue Type</th>
                  <th>Priority</th>
                  <th>Current Status</th>
                  <th>Reporter Info</th>
                  <th>Resolution Note</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td style={{ fontWeight: 600 }}>{task.area}</td>
                    <td>{task.issueType}</td>
                    <td><StatusBadge type="priority" value={task.priority} /></td>
                    <td><StatusBadge type="status" value={task.status} /></td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {task.reporterName} <br />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{task.phone}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: task.resolutionNote ? 'var(--text-main)' : 'var(--text-light)' }}>
                      {task.resolutionNote || 'None added yet'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleOpenUpdate(task)}
                      >
                        Update Status
                      </button>
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
