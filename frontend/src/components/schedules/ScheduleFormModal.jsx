import React, { useState, useEffect } from 'react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Daily',
  'Weekdays',
  'Weekends',
];

const WASTE_TYPES = [
  'Organic Waste',
  'Recyclable Waste',
  'Plastic & Polythene',
  'Paper & Cardboard',
  'Glass & Metal',
  'Hazardous / E-Waste',
  'Bulky Waste',
  'General Mixed Waste',
];

const STATUS_OPTIONS = [
  'Active',
  'Pending',
  'Completed',
  'Suspended',
];

const AREA_SUGGESTIONS = [
  'Colombo 01 - Fort',
  'Colombo 03 - Kollupitiya',
  'Colombo 07 - Cinnamon Gardens',
  'Dehiwala - Mount Lavinia',
  'Sri Jayawardenepura Kotte',
  'Kandy Municipal Council',
  'Galle Fort Area',
  'Negombo Municipal Council',
  'Kurunegala Town Area',
  'Jaffna Central Municipal',
];

const TIME_PRESETS = [
  '06:00 AM - 08:00 AM',
  '07:00 AM - 09:30 AM',
  '08:00 AM - 11:00 AM',
  '09:00 AM - 12:00 PM',
  '01:30 PM - 04:30 PM',
  '05:00 PM - 07:30 PM',
  '06:00 AM',
  '08:00 AM',
  '10:30 AM',
  '02:00 PM',
  '05:30 PM',
];

const ScheduleFormModal = ({ isOpen, onClose, onSubmit, schedule, isSubmitting }) => {
  const isEditMode = Boolean(schedule && schedule._id);

  const [formData, setFormData] = useState({
    areaName: '',
    collectionDay: 'Monday',
    collectionTime: '07:00 AM - 09:30 AM',
    wasteType: 'Organic Waste',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (schedule) {
        setFormData({
          areaName: schedule.areaName || '',
          collectionDay: schedule.collectionDay || 'Monday',
          collectionTime: schedule.collectionTime || '07:00 AM - 09:30 AM',
          wasteType: schedule.wasteType || 'Organic Waste',
          status: schedule.status || 'Active',
        });
      } else {
        setFormData({
          areaName: '',
          collectionDay: 'Monday',
          collectionTime: '07:00 AM - 09:30 AM',
          wasteType: 'Organic Waste',
          status: 'Active',
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, schedule]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const validateField = (name, value) => {
    switch (name) {
      case 'areaName':
        if (!value || !value.trim()) {
          return 'Area Name is required';
        }
        if (value.trim().length < 3) {
          return 'Area Name must be at least 3 characters';
        }
        if (value.trim().length > 100) {
          return 'Area Name cannot exceed 100 characters';
        }
        return '';
      case 'collectionDay':
        if (!value || !value.trim()) {
          return 'Collection Day is required';
        }
        return '';
      case 'collectionTime':
        if (!value || !value.trim()) {
          return 'Collection Time is required';
        }
        if (value.trim().length < 2) {
          return 'Please enter a valid collection time';
        }
        return '';
      case 'wasteType':
        if (!value || !value.trim()) {
          return 'Waste Type is required';
        }
        return '';
      case 'status':
        if (!value || !value.trim()) {
          return 'Status is required';
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
    setFormData((prev) => ({ ...prev, areaName: area }));
    setTouched((prev) => ({ ...prev, areaName: true }));
    setErrors((prev) => ({ ...prev, areaName: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = {
      areaName: true,
      collectionDay: true,
      collectionTime: true,
      wasteType: true,
      status: true,
    };
    setTouched(allTouched);

    if (validateAll()) {
      onSubmit({
        areaName: formData.areaName.trim(),
        collectionDay: formData.collectionDay.trim(),
        collectionTime: formData.collectionTime.trim(),
        wasteType: formData.wasteType.trim(),
        status: formData.status.trim(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={!isSubmitting ? onClose : undefined}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="modal-title" className="modal-title">
              {isEditMode ? '✏️ Edit Collection Schedule' : '➕ Add Collection Schedule'}
            </h3>
            <p className="modal-subtitle">
              {isEditMode
                ? 'Update the scheduled garbage collection routine details below.'
                : 'Define a new municipal waste pickup schedule for a neighborhood.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Area Name */}
            <div className="form-group">
              <label htmlFor="areaName" className="form-label-required">
                Area / Ward Name
              </label>
              <input
                id="areaName"
                type="text"
                name="areaName"
                className={`form-input ${touched.areaName && errors.areaName ? 'input-error' : ''}`}
                placeholder="e.g. Colombo 03 - Kollupitiya"
                value={formData.areaName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {touched.areaName && errors.areaName && (
                <span className="field-error-text">{errors.areaName}</span>
              )}

              {/* Quick Area Suggestions */}
              <div className="quick-suggestions-container">
                <span className="quick-suggestion-label">Quick suggestions:</span>
                <div className="quick-suggestion-chips">
                  {AREA_SUGGESTIONS.slice(0, 4).map((area) => (
                    <button
                      key={area}
                      type="button"
                      className="suggestion-chip"
                      onClick={() => handleAreaSuggestion(area)}
                      disabled={isSubmitting}
                    >
                      {area.split(' - ')[1] || area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-grid">
              {/* Collection Day */}
              <div className="form-group">
                <label htmlFor="collectionDay" className="form-label-required">
                  Collection Day
                </label>
                <select
                  id="collectionDay"
                  name="collectionDay"
                  className={`form-select ${
                    touched.collectionDay && errors.collectionDay ? 'input-error' : ''
                  }`}
                  value={formData.collectionDay}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {touched.collectionDay && errors.collectionDay && (
                  <span className="field-error-text">{errors.collectionDay}</span>
                )}
              </div>

              {/* Waste Type */}
              <div className="form-group">
                <label htmlFor="wasteType" className="form-label-required">
                  Waste Type
                </label>
                <select
                  id="wasteType"
                  name="wasteType"
                  className={`form-select ${
                    touched.wasteType && errors.wasteType ? 'input-error' : ''
                  }`}
                  value={formData.wasteType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                >
                  {WASTE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {touched.wasteType && errors.wasteType && (
                  <span className="field-error-text">{errors.wasteType}</span>
                )}
              </div>
            </div>

            <div className="form-grid">
              {/* Collection Time */}
              <div className="form-group">
                <label htmlFor="collectionTime" className="form-label-required">
                  Collection Time / Window
                </label>
                <input
                  id="collectionTime"
                  type="text"
                  name="collectionTime"
                  list="time-presets-list"
                  className={`form-input ${
                    touched.collectionTime && errors.collectionTime ? 'input-error' : ''
                  }`}
                  placeholder="e.g. 07:00 AM - 09:30 AM"
                  value={formData.collectionTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <datalist id="time-presets-list">
                  {TIME_PRESETS.map((time) => (
                    <option key={time} value={time} />
                  ))}
                </datalist>
                {touched.collectionTime && errors.collectionTime && (
                  <span className="field-error-text">{errors.collectionTime}</span>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status" className="form-label-required">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className={`form-select ${touched.status && errors.status ? 'input-error' : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {touched.status && errors.status && (
                  <span className="field-error-text">{errors.status}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? 'Updating Schedule...'
                  : 'Creating Schedule...'
                : isEditMode
                ? 'Save Changes'
                : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormModal;
