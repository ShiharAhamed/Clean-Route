import React, { useEffect } from 'react';

const ReportDeleteModal = ({ isOpen, onClose, onConfirm, report, isDeleting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !report) return null;

  return (
    <div className="modal-backdrop" onClick={!isDeleting ? onClose : undefined}>
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-report-title"
        aria-describedby="delete-report-desc"
      >
        <div className="modal-header">
          <div>
            <h3 id="delete-report-title" className="modal-title delete-title">
              ⚠️ Delete Waste Report
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p id="delete-report-desc" style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
            Are you sure you want to delete report{' '}
            <strong>#{report._id ? report._id.slice(-6).toUpperCase() : ''}</strong> from{' '}
            <strong>{report.reporterName}</strong>?
          </p>

          <div className="delete-details-card">
            <div className="delete-detail-row">
              <span className="delete-detail-label">Area:</span>
              <span className="delete-detail-value">{report.area}</span>
            </div>
            <div className="delete-detail-row">
              <span className="delete-detail-label">Issue Type:</span>
              <span className="delete-detail-value">{report.issueType}</span>
            </div>
            <div className="delete-detail-row">
              <span className="delete-detail-label">Status:</span>
              <span className="delete-detail-value">{report.status}</span>
            </div>
          </div>

          <p className="delete-warning-note">
            This will permanently remove this report from municipal records.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDeleteModal;
