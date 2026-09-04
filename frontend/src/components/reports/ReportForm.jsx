import React, { useState } from 'react';
import { reportService } from '../../services/reportService';

const ISSUE_TYPES = [
  'Missed Collection',
  'Overflowing Waste',
  'Illegal Dumping',
  'Other',
];

const PRIORITIES = [
  { value: 'Low', label: '🟢 Low — Minor inconvenience' },
  { value: 'Medium', label: '🟡 Medium — Standard attention needed' },
  { value: 'High', label: '🔴 High — Urgent hazard / block' },
];

const AREA_SUGGESTIONS = [
  'Colombo 03 - Kollupitiya',
  'Colombo 07 - Cinnamon Gardens',
  'Dehiwala - Mount Lavinia',
  'Sri Jayawardenepura Kotte',
  'Kandy Municipal Council',
  'Galle Fort Area',
  'Negombo Central',
  'Maharagama Town',
];

const ReportForm = ({ onReportCreated }) => {
  const [formData, setFormData] = useState({
    reporterName: '',
    phone: '',
    area: '',
    issueType: 'Missed Collection',
    priority: 'Medium',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'reporterName':
        if (!value || !value.trim()) {
          return 'Your full name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return '';
      case 'phone':
        if (!value || !value.trim()) {
          return 'Phone number is required';
        }
        // Sri Lankan phone number pattern or general 9-12 digits
        const cleanPhone = value.replace(/[\s-]/g, '');
        if (!/^(?:0|94|\+94)?[0-9]{9,10}$/.test(cleanPhone)) {
          return 'Please enter a valid phone number (e.g. 0771234567)';
        }
        return '';
      case 'area':
        if (!value || !value.trim()) {
          return 'Area / Location is required';
        }
        if (value.trim().length < 3) {
          return 'Area must be at least 3 characters';
        }
        return '';
      case 'issueType':
        if (!value || !value.trim()) {
          return 'Please select an issue type';
        }
        return '';
      case 'priority':
        if (!value || !value.trim()) {
          return 'Please select a priority level';
        }
        return '';
      case 'description':
        if (!value || !value.trim()) {
          return 'Detailed description is required';
        }
        if (value.trim().length < 10) {
          return 'Please provide more details (at least 10 characters)';
        }
        return '';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAreaSuggestion = (area) => {
    setFormData((prev) => ({ ...prev, area }));
    setTouched((prev) => ({ ...prev, area: true }));
    setErrors((prev) => ({ ...prev, area: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {
      reporterName: true,
      phone: true,
      area: true,
      issueType: true,
      priority: true,
      description: true,
    };
    setTouched(allTouched);

    if (!validateAll()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      // Status automatically defaults to 'Pending' in backend
      const res = await reportService.createReport(formData);

      setSuccessMessage(
        `Report submitted successfully! Ticket reference #${res.data?._id?.slice(-6) || 'NEW'} has been logged with status "Pending".`
      );

      // Reset form
      setFormData({
        reporterName: '',
        phone: '',
        area: '',
        issueType: 'Missed Collection',
        priority: 'Medium',
        description: '',
      });
      setTouched({});
      setErrors({});

      if (onReportCreated) {
        onReportCreated(res.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit report. Please check your connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-form-container">
      {successMessage && (
        <div className="notice-box notice-success fade-in">
          <span>✅ {successMessage}</span>
          <button
            type="button"
            className="notice-dismiss-btn"
            onClick={() => setSuccessMessage('')}
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="notice-box notice-error fade-in">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            className="notice-dismiss-btn"
            onClick={() => setErrorMessage('')}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Reporter Name */}
          <div className="form-group">
            <label htmlFor="reporterName" className="form-label-required">
              Citizen / Reporter Name
            </label>
            <input
              id="reporterName"
              type="text"
              name="reporterName"
              className={`form-input ${
                touched.reporterName && errors.reporterName ? 'input-error' : ''
              }`}
              placeholder="e.g. Kasun Perera"
              value={formData.reporterName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.reporterName && errors.reporterName && (
              <span className="field-error-text">{errors.reporterName}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label-required">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              className={`form-input ${touched.phone && errors.phone ? 'input-error' : ''}`}
              placeholder="e.g. 0771234567 or +94771234567"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.phone && errors.phone && (
              <span className="field-error-text">{errors.phone}</span>
            )}
          </div>

          {/* Area / Location */}
          <div className="form-group">
            <label htmlFor="area" className="form-label-required">
              Area / Neighborhood
            </label>
            <input
              id="area"
              type="text"
              name="area"
              className={`form-input ${touched.area && errors.area ? 'input-error' : ''}`}
              placeholder="e.g. Colombo 07, Cinnamon Gardens"
              value={formData.area}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.area && errors.area && (
              <span className="field-error-text">{errors.area}</span>
            )}

            {/* Quick area suggestions */}
            <div className="quick-suggestions-container">
              <span className="quick-suggestion-label">Quick select:</span>
              <div className="quick-suggestion-chips">
                {AREA_SUGGESTIONS.slice(0, 4).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleAreaSuggestion(item)}
                    disabled={isSubmitting}
                  >
                    {item.split(' - ')[1] || item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Issue Type */}
          <div className="form-group">
            <label htmlFor="issueType" className="form-label-required">
              Issue Category
            </label>
            <select
              id="issueType"
              name="issueType"
              className={`form-select ${touched.issueType && errors.issueType ? 'input-error' : ''}`}
              value={formData.issueType}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            >
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {touched.issueType && errors.issueType && (
              <span className="field-error-text">{errors.issueType}</span>
            )}
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority" className="form-label-required">
              Urgency Priority
            </label>
            <select
              id="priority"
              name="priority"
              className={`form-select ${touched.priority && errors.priority ? 'input-error' : ''}`}
              value={formData.priority}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {touched.priority && errors.priority && (
              <span className="field-error-text">{errors.priority}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label htmlFor="description" className="form-label-required">
            Issue Description & Landmarks
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-textarea ${
              touched.description && errors.description ? 'input-error' : ''
            }`}
            placeholder="Provide exact details, nearby landmarks, or duration of the issue (e.g. Garbage uncollected for 3 days near 5th Cross Street)..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            rows={4}
          />
          {touched.description && errors.description && (
            <span className="field-error-text">{errors.description}</span>
          )}
        </div>

        <div className="form-submit-row">
          <div className="default-pending-notice">
            <span>ℹ️ New reports are automatically registered with status <strong>Pending</strong>.</span>
          </div>
          <button
            type="submit"
            className="btn btn-primary submit-report-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting Report...' : '📢 Submit Waste Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
