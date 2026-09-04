import React from 'react';

const ISSUE_TYPES = [
  'All Issues',
  'Missed Collection',
  'Overflowing Waste',
  'Illegal Dumping',
  'Other',
];

const PRIORITIES = [
  'All Priorities',
  'Low',
  'Medium',
  'High',
];

const STATUSES = [
  'All Statuses',
  'Pending',
  'In Progress',
  'Resolved',
];

const ReportFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedIssueType,
  onIssueTypeChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedIssueType !== 'All Issues' ||
    selectedPriority !== 'All Priorities' ||
    selectedStatus !== 'All Statuses';

  return (
    <div className="filter-bar-container">
      <div className="filter-grid">
        {/* Search Query */}
        <div className="filter-item search-filter">
          <label htmlFor="report-search" className="filter-label">
            🔍 Search Reports
          </label>
          <div className="search-input-wrapper">
            <input
              id="report-search"
              type="text"
              className="form-input"
              placeholder="Search by area, reporter, or keywords..."
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

        {/* Filter by Issue Type */}
        <div className="filter-item">
          <label htmlFor="filter-issue-type" className="filter-label">
            ⚠️ Issue Type
          </label>
          <select
            id="filter-issue-type"
            className="form-select"
            value={selectedIssueType}
            onChange={(e) => onIssueTypeChange(e.target.value)}
          >
            {ISSUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Priority */}
        <div className="filter-item">
          <label htmlFor="filter-priority" className="filter-label">
            🔥 Priority
          </label>
          <select
            id="filter-priority"
            className="form-select"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="filter-item">
          <label htmlFor="filter-status" className="filter-label">
            📊 Status
          </label>
          <select
            id="filter-status"
            className="form-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Footer */}
      <div className="filter-footer">
        <span className="filter-count-badge">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> reports
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

export default ReportFilterBar;
