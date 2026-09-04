import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';

/**
 * Component 1: Collection Schedule Management
 * Assigned Developer: Developer 1
 * Responsibilities:
 * - View schedules list
 * - Add new collection schedule
 * - Edit / Delete collection schedule
 */
const ScheduleModule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await scheduleService.getSchedules();
      setSchedules(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load schedules. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-container">
      <div className="card">
        <h2 className="card-title">📅 Waste Collection Schedule Management</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Manage and publish weekly garbage collection routines for Sri Lankan municipal areas.
        </p>

        {error && <div className="notice-box notice-error">{error}</div>}

        {loading ? (
          <p>Loading schedules...</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Waste Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No collection schedules registered yet.
                    </td>
                  </tr>
                ) : (
                  schedules.map((item) => (
                    <tr key={item._id}>
                      <td><strong>{item.areaName}</strong></td>
                      <td>{item.collectionDay}</td>
                      <td>{item.collectionTime}</td>
                      <td>{item.wasteType}</td>
                      <td>{item.status}</td>
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

export default ScheduleModule;
