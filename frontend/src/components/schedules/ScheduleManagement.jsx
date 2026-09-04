import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../api/scheduleService';

export const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [areaFilter, setAreaFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    areaName: '',
    collectionDay: 'Monday',
    collectionTime: '08:00 AM',
    wasteType: 'General Waste',
    status: 'Active',
  });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scheduleService.getSchedules(areaFilter ? { areaName: areaFilter } : {});
      setSchedules(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load collection schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [areaFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await scheduleService.createSchedule(formData);
      setShowAddModal(false);
      setFormData({
        areaName: '',
        collectionDay: 'Monday',
        collectionTime: '08:00 AM',
        wasteType: 'General Waste',
        status: 'Active',
      });
      fetchSchedules();
    } catch (err) {
      alert(err.message || 'Error creating schedule');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await scheduleService.deleteSchedule(id);
      fetchSchedules();
    } catch (err) {
      alert(err.message || 'Error deleting schedule');
    }
  };

  return (
    <div className="schedule-module">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📅 Collection Schedule Management</h2>
            <p className="card-subtitle">
              Manage and view weekly waste pickup timings across Sri Lankan municipal areas.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(!showAddModal)}>
            {showAddModal ? '✕ Close Form' : '+ New Schedule'}
          </button>
        </div>

        {/* Add Schedule Form */}
        {showAddModal && (
          <form onSubmit={handleCreateSchedule} className="card" style={{ background: '#f8fafc', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add Collection Schedule</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Area Name *</label>
                <input
                  type="text"
                  name="areaName"
                  className="form-control"
                  placeholder="e.g. Colombo 07, Kandy City, Galle Fort"
                  value={formData.areaName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Collection Day *</label>
                <select
                  name="collectionDay"
                  className="form-control"
                  value={formData.collectionDay}
                  onChange={handleInputChange}
                  required
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Collection Time *</label>
                <input
                  type="text"
                  name="collectionTime"
                  className="form-control"
                  placeholder="e.g. 07:30 AM - 10:00 AM"
                  value={formData.collectionTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Waste Type *</label>
                <select
                  name="wasteType"
                  className="form-control"
                  value={formData.wasteType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="General Waste">General Waste</option>
                  <option value="Organic / Food Waste">Organic / Food Waste</option>
                  <option value="Recyclable Plastics & Paper">Recyclable Plastics & Paper</option>
                  <option value="Glass & Metal">Glass & Metal</option>
                  <option value="E-Waste / Bulk Waste">E-Waste / Bulk Waste</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Schedule
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search schedules by area (e.g. Dehiwala, Maharagama)..."
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>

        {/* Schedules Table */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading schedules...</p>
        ) : error ? (
          <div style={{ color: 'var(--danger)', padding: '1rem 0' }}>{error}</div>
        ) : schedules.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>
            No collection schedules found. Click "+ New Schedule" to create one.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Day</th>
                  <th>Time Window</th>
                  <th>Waste Type</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td style={{ fontWeight: 600 }}>{schedule.areaName}</td>
                    <td>{schedule.collectionDay}</td>
                    <td>{schedule.collectionTime}</td>
                    <td>{schedule.wasteType}</td>
                    <td>
                      <span className="badge badge-resolved">{schedule.status || 'Active'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleDeleteSchedule(schedule._id)}
                      >
                        Delete
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
