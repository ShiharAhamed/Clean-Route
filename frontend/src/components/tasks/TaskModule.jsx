import React, { useState, useEffect, useCallback } from 'react';
import { taskService } from '../../services/taskService';
import StatusBadge from '../common/StatusBadge';

/**
 * Component 3: Collection Task Management
 * Assigned Developer: Developer 3
 *
 * Staff operational board — view reports as tasks, filter, and drive
 * status transitions: Pending → In Progress → Resolved (with note).
 */

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

const ResolveModal = ({ task, onConfirm, onCancel }) => {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!note.trim()) {
      setError('Please enter a resolution note before resolving.');
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          ✅ Resolve Task
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <strong>Area:</strong> {task.area} &nbsp;|&nbsp;
          <strong>Issue:</strong> {task.issueType}
        </p>

        <div className="form-group">
          <label>Resolution Note *</label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Describe what action was taken to resolve this issue..."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error) setError('');
            }}
          />
          {error && (
            <span style={{ color: '#991b1b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {error}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            Confirm Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskModule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Resolve modal state
  const [resolveTarget, setResolveTarget] = useState(null); // task being resolved
  const [updatingId, setUpdatingId] = useState(null);       // task id being updated

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await taskService.getTasks(params);
      setTasks(res.data || []);
    } catch (err) {
      setError('Failed to load collection tasks. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side search on area, issueType, reporterName
  const filteredTasks = tasks.filter((t) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (
      t.area?.toLowerCase().includes(q) ||
      t.issueType?.toLowerCase().includes(q) ||
      t.reporterName?.toLowerCase().includes(q)
    );
  });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleStartTask = async (task) => {
    try {
      setUpdatingId(task._id);
      await taskService.updateTaskStatus(task._id, 'In Progress');
      showSuccess(`Task in "${task.area}" marked as In Progress.`);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenResolve = (task) => {
    setResolveTarget(task);
  };

  const handleConfirmResolve = async (note) => {
    const task = resolveTarget;
    setResolveTarget(null);
    try {
      setUpdatingId(task._id);
      await taskService.updateTaskStatus(task._id, 'Resolved', note);
      showSuccess(`Task in "${task.area}" resolved successfully.`);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve task.');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    resolved: tasks.filter((t) => t.status === 'Resolved').length,
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>🛠️ Collection Task Management</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Triage, action, and resolve reported community waste issues.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchTasks}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Summary counters */}
        <div style={styles.counters}>
          <CounterPill label="Total" value={counts.total} color="#6b7280" />
          <CounterPill label="Pending" value={counts.pending} color="#92400e" bg="#fef3c7" />
          <CounterPill label="In Progress" value={counts.inProgress} color="#1e40af" bg="#dbeafe" />
          <CounterPill label="Resolved" value={counts.resolved} color="#065f46" bg="#d1fae5" />
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem', padding: '1rem 1.5rem' }}>
        <div style={styles.filterRow}>
          <div style={{ flex: 2, minWidth: 180 }}>
            <label style={styles.filterLabel}>Search</label>
            <input
              type="text"
              className="form-input"
              placeholder="Area, issue type, reporter name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={styles.filterLabel}>Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 130 }}>
            <label style={styles.filterLabel}>Priority</label>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {(statusFilter || priorityFilter || searchText) && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setStatusFilter('');
                  setPriorityFilter('');
                  setSearchText('');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notices */}
      {successMsg && <div className="notice-box notice-success">{successMsg}</div>}
      {error && (
        <div className="notice-box notice-error">
          {error}
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: '1rem' }}
            onClick={() => { setError(null); fetchTasks(); }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Task Table */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={styles.centeredMsg}>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Loading collection tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={styles.centeredMsg}>
            <span style={{ fontSize: '1.5rem' }}>📭</span>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {tasks.length === 0 ? 'No tasks found.' : 'No tasks match the current filters.'}
            </p>
            {(statusFilter || priorityFilter || searchText) && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.75rem' }}
                onClick={() => { setStatusFilter(''); setPriorityFilter(''); setSearchText(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 'var(--radius)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Issue Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reporter</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredTasks]
                  .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3))
                  .map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      isUpdating={updatingId === task._id}
                      onStart={() => handleStartTask(task)}
                      onResolve={() => handleOpenResolve(task)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredTasks.length > 0 && (
          <div style={styles.tableFooter}>
            Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Resolve modal */}
      {resolveTarget && (
        <ResolveModal
          task={resolveTarget}
          onConfirm={handleConfirmResolve}
          onCancel={() => setResolveTarget(null)}
        />
      )}
    </div>
  );
};

/* ── Sub-components ───────────────────────────────────────────────────── */

const TaskRow = ({ task, isUpdating, onStart, onResolve }) => (
  <tr style={{ opacity: isUpdating ? 0.6 : 1 }}>
    <td>
      <strong>{task.area}</strong>
      {task.resolutionNote && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: 200 }}>
          📝 {task.resolutionNote.slice(0, 60)}{task.resolutionNote.length > 60 ? '…' : ''}
        </div>
      )}
    </td>
    <td>{task.issueType}</td>
    <td><StatusBadge type="priority" value={task.priority} /></td>
    <td><StatusBadge type="status" value={task.status} /></td>
    <td>
      <div>{task.reporterName}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{task.phone}</div>
    </td>
    <td style={{ whiteSpace: 'nowrap' }}>
      {new Date(task.reportedAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })}
    </td>
    <td>
      {task.status === 'Pending' && (
        <button
          className="btn btn-primary btn-sm"
          disabled={isUpdating}
          onClick={onStart}
          title="Start this collection task"
        >
          {isUpdating ? '...' : '▶ Start'}
        </button>
      )}
      {task.status === 'In Progress' && (
        <button
          className="btn btn-sm"
          style={{ backgroundColor: '#059669', color: '#fff' }}
          disabled={isUpdating}
          onClick={onResolve}
          title="Mark as resolved with a note"
        >
          {isUpdating ? '...' : '✔ Resolve'}
        </button>
      )}
      {task.status === 'Resolved' && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Completed</span>
      )}
    </td>
  </tr>
);

const CounterPill = ({ label, value, color, bg = '#f3f4f6' }) => (
  <div style={{ ...styles.pill, backgroundColor: bg, color }}>
    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{value}</span>
    <span style={{ fontSize: '0.78rem', marginTop: '0.1rem' }}>{label}</span>
  </div>
);

/* ── Styles ───────────────────────────────────────────────────────────── */

const styles = {
  counters: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  pill: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    minWidth: 72,
    fontWeight: 600,
  },
  filterRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  filterLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '0.3rem',
    color: 'var(--text-main)',
  },
  centeredMsg: {
    padding: '3rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tableFooter: {
    padding: '0.6rem 1rem',
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    textAlign: 'right',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-md)',
    padding: '1.75rem',
    width: '100%',
    maxWidth: 480,
  },
};

export default TaskModule;
