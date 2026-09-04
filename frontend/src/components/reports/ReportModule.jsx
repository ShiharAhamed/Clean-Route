import React, { useState } from 'react';
import { reportService } from '../../services/reportService';

/**
 * Component 2: Waste Issue Reporting
 * Assigned Developer: Developer 2
 * Responsibilities:
 * - Public citizen submission form for waste issues
 * - Capture reporter details, area, issueType, priority, description
 * - Submit to POST /api/reports
 */
const ReportModule = () => {
  const [formData, setFormData] = useState({
    reporterName: '',
    phone: '',
    area: '',
    issueType: 'Missed Collection',
    priority: 'Medium',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const issueTypes = ['Missed Collection', 'Overflowing Waste', 'Illegal Dumping', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      await reportService.createReport(formData);
      setSuccessMessage('Your waste issue report has been submitted successfully.');
      setFormData({
        reporterName: '',
        phone: '',
        area: '',
        issueType: 'Missed Collection',
        priority: 'Medium',
        description: '',
      });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-container">
      <div className="card">
        <h2 className="card-title">📢 Report a Waste Issue</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Report missed collections, illegal dumping, or overflowing bins in your neighborhood.
        </p>

        {successMessage && <div className="notice-box notice-success">{successMessage}</div>}
        {errorMessage && <div className="notice-box notice-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="reporterName"
                className="form-input"
                placeholder="e.g. Kasun Perera"
                value={formData.reporterName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="e.g. 0771234567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Area / Location *</label>
              <input
                type="text"
                name="area"
                className="form-input"
                placeholder="e.g. Colombo 07, Cinnamon Gardens"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Issue Type *</label>
              <select
                name="issueType"
                className="form-select"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                {issueTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority *</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe the waste issue and exact landmarks..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Issue Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModule;
