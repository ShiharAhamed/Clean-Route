import React from 'react';

const DAYS = [
  'All Days',
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
  'All Types',
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
  'All Statuses',
  'Active',
  'Pending',
  'Completed',
  'Suspended',
];

const ScheduleFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedDay,
  onDayChange,
  selectedWasteType,
  onWasteTypeChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDay !== 'All Days' ||
    selectedWasteType !== 'All Types' ||
    selectedStatus !== 'All Statuses';

  return (
    <div className="filter-bar-container">
      <div className="filter-grid">
        {/* Search by Area */}
        <div className="filter-item search-filter">
          <label htmlFor="schedule-search" className="filter-label">
            🔍 Search Area
          </label>
          <div className="search-input-wrapper">
            <input
              id="schedule-search"
              type="text"
              className="form-input"
              placeholder="Search by area name (e.g. Colombo, Kandy)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter by Day */}
        <div className="filter-item">
          <label htmlFor="filter-day" className="filter-label">
            📅 Collection Day
          </label>
          <select
            id="filter-day"
            className="form-select"
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Waste Type */}
        <div className="filter-item">
          <label htmlFor="filter-waste-type" className="filter-label">
            ♻️ Waste Type
          </label>
          <select
            id="filter-waste-type"
            className="form-select"
            value={selectedWasteType}
            onChange={(e) => onWasteTypeChange(e.target.value)}
          >
            {WASTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="filter-item">
          <label htmlFor="filter-status" className="filter-label">
            🏷️ Status
          </label>
          <select
            id="filter-status"
            className="form-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Stats & Reset */}
      <div className="filter-footer">
        <span className="filter-count-badge">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> schedules
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm filter-reset-btn"
            onClick={onResetFilters}
          >
            🔄 Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleFilterBar;
