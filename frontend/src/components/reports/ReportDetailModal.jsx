import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

const ReportDetailModal = ({ isOpen, onClose, report, onUpdateReport, isUpdating }) => {
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    if (report) {
      setStatus(report.status || 'Pending');
      setPriority(report.priority || 'Medium');
      setResolutionNote(report.resolutionNote || '');
    }
  }, [report]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isUpdating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUpdating, onClose]);

  if (!isOpen || !report) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateReport(report._id, {
      status,
      priority,
      resolutionNote: resolutionNote.trim(),
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityBadge = (p) => {
    const val = (p || '').toLowerCase();
    if (val === 'high') return <span className="badge badge-high">🔴 High Priority</span>;
    if (val === 'medium') return <span className="badge badge-medium">🟡 Medium Priority</span>;
    return <span className="badge badge-low">🟢 Low Priority</span>;
  };

  const getStatusBadge = (s) => {
    const val = (s || '').toLowerCase().replace(/\s+/g, '-');
    if (val === 'resolved') return <span className="badge badge-resolved">✅ Resolved</span>;
    if (val === 'in-progress') return <span className="badge badge-in-progress">🔄 In Progress</span>;
    return <span className="badge badge-pending">⏳ Pending</span>;
  };

  return (
    <div className="modal-backdrop" onClick={!isUpdating ? onClose : undefined}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-detail-title"
      >
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h3 id="report-detail-title" className="modal-title">
                📋 Waste Issue Details
              </h3>
              <span className="report-id-tag">
                #{report._id ? report._id.slice(-6).toUpperCase() : 'REPORT'}
              </span>
            </div>
            <p className="modal-subtitle">
              Review citizen report submission, manage workflow status, and record resolution notes.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close details modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Summary Overview Grid */}
          <div className="report-summary-box">
            <div className="report-info-grid">
              <div className="report-info-item">
                <span className="report-info-label">👤 Citizen / Reporter</span>
                <strong className="report-info-val">{report.reporterName}</strong>
              </div>
              <div className="report-info-item">
                <span className="report-info-label">📞 Contact Phone</span>
                <strong className="report-info-val">
                  <a href={`tel:${report.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {report.phone}
                  </a>
                </strong>
              </div>
              <div className="report-info-item">
                <span className="report-info-label">📍 Area / Location</span>
                <strong className="report-info-val">{report.area}</strong>
              </div>
              <div className="report-info-item">
                <span className="report-info-label">⚠️ Issue Type</span>
                <strong className="report-info-val">{report.issueType}</strong>
              </div>
              <div className="report-info-item">
                <span className="report-info-label">📅 Reported At</span>
                <span className="report-info-val" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(report.reportedAt)}
                </span>
              </div>
              <div className="report-info-item">
                <span className="report-info-label">🕒 Last Updated</span>
                <span className="report-info-val" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(report.updatedAt)}
                </span>
              </div>
            </div>

            <div className="report-status-pills-row">
              <div>
                <span className="report-info-label" style={{ display: 'block', marginBottom: '0.2rem' }}>
                  Current Priority
                </span>
                {getPriorityBadge(report.priority)}
              </div>
              <div>
                <span className="report-info-label" style={{ display: 'block', marginBottom: '0.2rem' }}>
                  Current Status
                </span>
                {getStatusBadge(report.status)}
              </div>
            </div>

            {/* Description */}
            <div className="report-desc-container">
              <span className="report-info-label">📝 Issue Description:</span>
              <p className="report-desc-text">{report.description}</p>
            </div>
          </div>

          {/* Workflow & Resolution Note Form */}
          <form onSubmit={handleSubmit}>
            <div className="resolution-section">
              <h4 className="section-subtitle">⚙️ Update Status & Resolution</h4>

              <div className="form-grid" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="modal-status">Change Status</label>
                  <select
                    id="modal-status"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isUpdating}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modal-priority">Change Priority</label>
                  <select
                    id="modal-priority"
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={isUpdating}
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modal-resolution">
                  Resolution / Municipal Action Note
                </label>
                <textarea
                  id="modal-resolution"
                  className="form-textarea"
                  placeholder="e.g. Cleared by Municipal Truck #12 at 10:30 AM. Area sanitized and verified."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  disabled={isUpdating}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving Updates...' : '💾 Save Status & Notes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
