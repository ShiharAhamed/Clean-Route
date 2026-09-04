import React, { useState, useEffect, useMemo } from 'react';
import { scheduleService } from '../../services/scheduleService';
import ScheduleFilterBar from './ScheduleFilterBar';
import ScheduleFormModal from './ScheduleFormModal';
import ScheduleDeleteModal from './ScheduleDeleteModal';

/**
 * Component 1: Collection Schedule Management
 * Features:
 * - View schedules list with real-time stats
 * - Add new collection schedule (POST /api/schedules)
 * - Edit collection schedule (PUT /api/schedules/:id & GET /api/schedules/:id)
 * - Delete collection schedule (DELETE /api/schedules/:id)
 * - Multi-criteria search & filtering (Area, Day, Waste Type, Status)
 * - Form validation and error handling
 */
const ScheduleModule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('All Days');
  const [selectedWasteType, setSelectedWasteType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await scheduleService.getSchedules();
      setSchedules(res.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to load schedules. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(msg);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setSelectedSchedule(null);
    setIsFormModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = async (schedule) => {
    try {
      // Fetch latest schedule details by ID to satisfy GET /api/schedules/:id
      const res = await scheduleService.getScheduleById(schedule._id);
      setSelectedSchedule(res.data || schedule);
    } catch {
      // Fallback to local item if fetch fails
      setSelectedSchedule(schedule);
    }
    setIsFormModalOpen(true);
  };

  // Submit Create or Edit
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedSchedule && selectedSchedule._id) {
        // PUT /api/schedules/:id
        const res = await scheduleService.updateSchedule(selectedSchedule._id, formData);
        setSchedules((prev) =>
          prev.map((s) => (s._id === selectedSchedule._id ? res.data : s))
        );
        showNotification(`Schedule for "${formData.areaName}" updated successfully!`);
      } else {
        // POST /api/schedules
        const res = await scheduleService.createSchedule(formData);
        setSchedules((prev) => [res.data, ...prev]);
        showNotification(`New schedule for "${formData.areaName}" created successfully!`);
      }
      setIsFormModalOpen(false);
      setSelectedSchedule(null);
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to save schedule. Please check all fields.',
        false
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open modal for Delete
  const handleOpenDeleteModal = (schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!scheduleToDelete) return;
    setIsDeleting(true);
    try {
      // DELETE /api/schedules/:id
      await scheduleService.deleteSchedule(scheduleToDelete._id);
      setSchedules((prev) => prev.filter((s) => s._id !== scheduleToDelete._id));
      showNotification(`Schedule for "${scheduleToDelete.areaName}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to delete schedule. Please try again.',
        false
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDay('All Days');
    setSelectedWasteType('All Types');
    setSelectedStatus('All Statuses');
  };

  // Filtered schedules list
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // Search query match in areaName or wasteType
      const matchesSearch =
        searchQuery.trim() === '' ||
        schedule.areaName?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        schedule.wasteType?.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // Day match
      const matchesDay =
        selectedDay === 'All Days' ||
        schedule.collectionDay?.toLowerCase() === selectedDay.toLowerCase();

      // Waste type match
      const matchesWasteType =
        selectedWasteType === 'All Types' ||
        schedule.wasteType?.toLowerCase() === selectedWasteType.toLowerCase();

      // Status match
      const matchesStatus =
        selectedStatus === 'All Statuses' ||
        schedule.status?.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesDay && matchesWasteType && matchesStatus;
    });
  }, [schedules, searchQuery, selectedDay, selectedWasteType, selectedStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status) => {
    const val = (status || '').toLowerCase().trim();
    if (val === 'active') return 'badge badge-active';
    if (val === 'pending') return 'badge badge-pending';
    if (val === 'completed') return 'badge badge-completed';
    if (val === 'suspended') return 'badge badge-suspended';
    return 'badge badge-low';
  };

  const getWasteTypeBadgeClass = (wasteType) => {
    const val = (wasteType || '').toLowerCase();
    if (val.includes('organic')) return 'waste-pill waste-pill-organic';
    if (val.includes('recyclable') || val.includes('plastic') || val.includes('paper')) {
      return 'waste-pill waste-pill-recyclable';
    }
    if (val.includes('hazardous') || val.includes('e-waste')) {
      return 'waste-pill waste-pill-hazardous';
    }
    return 'waste-pill waste-pill-general';
  };

  return (
    <div className="module-container">
      {/* Top Header Card */}
      <div className="card schedule-main-card">
        <div className="schedule-header-row">
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>📅</span> Waste Collection Schedule Management
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Manage municipal garbage collection routines, routes, and waste categories across Sri Lanka.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary create-schedule-btn"
            onClick={handleOpenCreateModal}
          >
            <span>➕</span> Add New Schedule
          </button>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="notice-box notice-success fade-in">
            <span>✅ {successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="notice-box notice-error fade-in">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Search and Multi-Filter Controls */}
        <ScheduleFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          selectedWasteType={selectedWasteType}
          onWasteTypeChange={setSelectedWasteType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onResetFilters={handleResetFilters}
          totalCount={schedules.length}
          filteredCount={filteredSchedules.length}
        />

        {/* Main Schedule Content Table / States */}
        {loading ? (
          <div className="schedule-loading-state">
            <div className="spinner"></div>
            <p>Loading collection schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No Collection Schedules Found</h3>
            <p className="empty-state-text">
              Get started by creating the first garbage collection schedule for your municipality.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreateModal}
            >
              ➕ Create Schedule Now
            </button>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No Matching Schedules</h3>
            <p className="empty-state-text">
              No schedules match your current search or filter criteria. Try adjusting your filters.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              🔄 Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area / Zone</th>
                  <th>Collection Day</th>
                  <th>Pickup Time</th>
                  <th>Waste Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((item) => (
                  <tr key={item._id} className="schedule-row">
                    <td>
                      <div className="area-cell">
                        <span className="area-icon">📍</span>
                        <strong className="area-name">{item.areaName}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="day-badge">{item.collectionDay}</span>
                    </td>
                    <td>
                      <span className="time-text">🕒 {item.collectionTime}</span>
                    </td>
                    <td>
                      <span className={getWasteTypeBadgeClass(item.wasteType)}>
                        {item.wasteType}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <div className="table-actions-container">
                        <button
                          type="button"
                          className="btn-action btn-action-edit"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Schedule"
                          aria-label={`Edit schedule for ${item.areaName}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-action-delete"
                          onClick={() => handleOpenDeleteModal(item)}
                          title="Delete Schedule"
                          aria-label={`Delete schedule for ${item.areaName}`}
                        >
                          🗑️ Delete
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

      {/* Create / Edit Schedule Modal */}
      <ScheduleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSchedule(null);
        }}
        onSubmit={handleFormSubmit}
        schedule={selectedSchedule}
        isSubmitting={isSubmitting}
      />

      {/* Delete Schedule Confirmation Modal */}
      <ScheduleDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setScheduleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        schedule={scheduleToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ScheduleModule;
