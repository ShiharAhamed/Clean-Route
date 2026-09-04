import React, { useEffect } from 'react';

const ScheduleDeleteModal = ({ isOpen, onClose, onConfirm, schedule, isDeleting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !schedule) return null;

  return (
    <div className="modal-backdrop" onClick={!isDeleting ? onClose : undefined}>
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
      >
        <div className="modal-header">
          <div>
            <h3 id="delete-modal-title" className="modal-title delete-title">
              ⚠️ Delete Collection Schedule
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
          <p id="delete-modal-desc" style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
            Are you sure you want to permanently delete the collection schedule for{' '}
            <strong>{schedule.areaName}</strong>?
          </p>

          <div className="delete-details-card">
            <div className="delete-detail-row">
              <span className="delete-detail-label">Area:</span>
              <span className="delete-detail-value">{schedule.areaName}</span>
            </div>
            <div className="delete-detail-row">
              <span className="delete-detail-label">Day & Time:</span>
              <span className="delete-detail-value">
                {schedule.collectionDay} ({schedule.collectionTime})
              </span>
            </div>
            <div className="delete-detail-row">
              <span className="delete-detail-label">Waste Type:</span>
              <span className="delete-detail-value">{schedule.wasteType}</span>
            </div>
          </div>

          <p className="delete-warning-note">
            This action cannot be undone. Citizens and waste drivers will no longer see this schedule.
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
            {isDeleting ? 'Deleting...' : 'Yes, Delete Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDeleteModal;
