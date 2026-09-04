import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';
import StatusBadge from '../common/StatusBadge';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const WASTE_TYPES = [
  'Organic / Food Waste',
  'Plastic & Polythene',
  'Paper & Cardboard',
  'Glass & Metal',
  'Electronic Waste',
  'General Residual Waste',
];

const INITIAL_FORM = {
  areaName: '',
  collectionDay: 'Monday',
  collectionTime: '',
  wasteType: 'Organic / Food Waste',
  status: 'Active',
};

const ScheduleModule = () => {
  // Schedules data state
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Alerts & Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedWasteType, setSelectedWasteType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Form State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch schedules on initial load and when filters change
  useEffect(() => {
    fetchSchedules();
  }, [selectedDay, selectedWasteType, selectedStatus]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedDay !== 'All') params.collectionDay = selectedDay;
      if (selectedWasteType !== 'All') params.wasteType = selectedWasteType;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await scheduleService.getSchedules(params);
      setSchedules(res.data || []);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch collection schedules.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchedules();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDay('All');
    setSelectedWasteType('All');
    setSelectedStatus('All');
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!formData.areaName.trim()) {
      errors.areaName = 'Area name is required.';
    } else if (formData.areaName.trim().length < 3) {
      errors.areaName = 'Area name must be at least 3 characters.';
    }

    if (!formData.collectionDay) {
      errors.collectionDay = 'Collection day is required.';
    }

    if (!formData.collectionTime.trim()) {
      errors.collectionTime = 'Collection time is required (e.g. 06:30 AM - 08:30 AM).';
    }

    if (!formData.wasteType) {
      errors.wasteType = 'Waste type is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal with loaded data
  const openEditModal = (schedule) => {
    setIsEditing(true);
    setCurrentId(schedule._id);
    setFormData({
      areaName: schedule.areaName || '',
      collectionDay: schedule.collectionDay || 'Monday',
      collectionTime: schedule.collectionTime || '',
      wasteType: schedule.wasteType || 'Organic / Food Waste',
      status: schedule.status || 'Active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(INITIAL_FORM);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for field on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Create or Update Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      if (isEditing) {
        await scheduleService.updateSchedule(currentId, formData);
        setSuccessMessage('Schedule updated successfully!');
      } else {
        await scheduleService.createSchedule(formData);
        setSuccessMessage('New schedule created successfully!');
      }

      closeModal();
      fetchSchedules();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      setActionLoading(true);
      await scheduleService.deleteSchedule(id);
      setSuccessMessage('Schedule deleted successfully!');
      setDeleteConfirmId(null);
      fetchSchedules();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="module-container">
      {/* Header Bar */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>📅 Collection Schedule Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Configure, update, and search municipal garbage collection schedules.
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            ➕ Add New Schedule
          </button>
        </div>

        {/* Notifications */}
        {successMessage && <div className="notice-box notice-success">{successMessage}</div>}
        {errorMessage && <div className="notice-box notice-error">{errorMessage}</div>}

        {/* Search and Filters Toolbar */}
        <div className="toolbar">
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1', gap: '0.5rem', minWidth: '220px' }}>
            <input
              type="text"
              className="form-input toolbar-input"
              placeholder="Search area (e.g. Kandy, Colombo 03)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              🔍 Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="All">All Days</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedWasteType}
              onChange={(e) => setSelectedWasteType(e.target.value)}
            >
              <option value="All">All Waste Types</option>
              {WASTE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {(searchTerm || selectedDay !== 'All' || selectedWasteType !== 'All' || selectedStatus !== 'All') && (
              <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                ✖ Reset
              </button>
            )}
          </div>
        </div>

        {/* Schedules Data Table */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading collection schedules...
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>Collection Day</th>
                  <th>Collection Time</th>
                  <th>Waste Type</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No schedules found matching your criteria. Click "Add New Schedule" to create one.
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td><strong>{schedule.areaName}</strong></td>
                      <td>{schedule.collectionDay}</td>
                      <td>{schedule.collectionTime}</td>
                      <td>{schedule.wasteType}</td>
                      <td>
                        <StatusBadge type="status" value={schedule.status} />
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {schedule.createdAt ? new Date(schedule.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {deleteConfirmId === schedule._id ? (
                          <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>Confirm?</span>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(schedule._id)}
                              disabled={actionLoading}
                            >
                              Yes
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => openEditModal(schedule)}
                              title="Edit Schedule"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#dc2626' }}
                              onClick={() => setDeleteConfirmId(schedule._id)}
                              title="Delete Schedule"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Schedule Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isEditing ? '✏️ Edit Collection Schedule' : '➕ Create New Collection Schedule'}
              </h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Area / Location Name *</label>
                <input
                  type="text"
                  name="areaName"
                  className="form-input"
                  placeholder="e.g. Maharagama Central, Colombo 06"
                  value={formData.areaName}
                  onChange={handleFormChange}
                />
                {formErrors.areaName && (
                  <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{formErrors.areaName}</span>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Collection Day *</label>
                  <select
                    name="collectionDay"
                    className="form-select"
                    value={formData.collectionDay}
                    onChange={handleFormChange}
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  {formErrors.collectionDay && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{formErrors.collectionDay}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Collection Time *</label>
                  <input
                    type="text"
                    name="collectionTime"
                    className="form-input"
                    placeholder="e.g. 06:30 AM - 09:00 AM"
                    value={formData.collectionTime}
                    onChange={handleFormChange}
                  />
                  {formErrors.collectionTime && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{formErrors.collectionTime}</span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Waste Type *</label>
                  <select
                    name="wasteType"
                    className="form-select"
                    value={formData.wasteType}
                    onChange={handleFormChange}
                  >
                    {WASTE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formErrors.wasteType && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{formErrors.wasteType}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : isEditing ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleModule;
