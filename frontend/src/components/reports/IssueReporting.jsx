import React, { useState, useEffect } from 'react';
import { reportService } from '../../api/reportService';
import { StatusBadge } from '../common/StatusBadge';

export const IssueReporting = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    reporterName: '',
    phone: '',
    area: '',
    issueType: 'Missed Collection',
    description: '',
    priority: 'Medium',
  });

  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportService.getReports();
      setReports(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportService.createReport(formData);
      setSubmittedSuccess(true);
      setFormData({
        reporterName: '',
        phone: '',
        area: '',
        issueType: 'Missed Collection',
        description: '',
        priority: 'Medium',
      });
      fetchRecentReports();
      setTimeout(() => setSubmittedSuccess(false), 4000);
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    }
  };

  return (
    <div className="reporting-module">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📢 Waste Issue Reporting</h2>
            <p className="card-subtitle">
              Report missed collection, illegal dumping, or overflowing waste bins in your neighborhood.
            </p>
          </div>
        </div>

        {submittedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600 }}>
            ✓ Thank you! Your waste report has been submitted to the municipal task queue.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                name="reporterName"
                className="form-control"
                placeholder="e.g. Kasun Perera"
                value={formData.reporterName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="e.g. 0771234567"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Area / Location *</label>
              <input
                type="text"
                name="area"
                className="form-control"
                placeholder="e.g. Nugegoda, Kaduwela, Negombo"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue Type *</label>
              <select
                name="issueType"
                className="form-control"
                value={formData.issueType}
                onChange={handleInputChange}
                required
              >
                <option value="Missed Collection">Missed Collection</option>
                <option value="Overflowing Waste">Overflowing Waste</option>
                <option value="Illegal Dumping">Illegal Dumping</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Estimated Urgency / Priority *</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Specific Landmark Details *</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              placeholder="Describe the issue, exact road/junction, and any health hazard details..."
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary">
              Submit Waste Issue Report
            </button>
          </div>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Recent Community Reports
        </h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading submitted reports...</p>
        ) : error ? (
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        ) : reports.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No reports recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Reported Date</th>
                  <th>Area</th>
                  <th>Issue Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 10).map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(r.reportedAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.area}</td>
                    <td>{r.issueType}</td>
                    <td><StatusBadge type="priority" value={r.priority} /></td>
                    <td><StatusBadge type="status" value={r.status} /></td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.description}
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
