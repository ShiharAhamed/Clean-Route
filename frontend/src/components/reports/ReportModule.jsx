import React, { useState, useEffect, useMemo } from 'react';
import { reportService } from '../../services/reportService';
import ReportForm from './ReportForm';
import ReportFilterBar from './ReportFilterBar';
import ReportDetailModal from './ReportDetailModal';
import ReportDeleteModal from './ReportDeleteModal';

/**
 * Component 2: Waste Issue Reporting
 * Features:
 * - Public citizen submission form (POST /api/reports) with required field validation
 * - Newly created reports strictly default to 'Pending'
 * - View reports list with priority and status badges (GET /api/reports)
 * - Search and multi-filter reports (Area, Issue Type, Priority, Status)
 * - Detailed inspection & status/resolution update modal (GET /api/reports/:id & PUT /api/reports/:id)
 * - Delete report confirmation modal (DELETE /api/reports/:id)
 * - Responsive UI with live counts and empty/loading states
 */
const ReportModule = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Active Tab View: 'list' (Manage Reports) or 'create' (Submit Report)
  const [activeTab, setActiveTab] = useState('list');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssueType, setSelectedIssueType] = useState('All Issues');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Detail / Status Modal State
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await reportService.getReports();
      setReports(res.data || []);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to load reports. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 4500);
    } else {
      setErrorMessage(msg);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Open Detail / Update Modal
  const handleOpenDetailModal = async (report) => {
    try {
      // Fetch latest report details via GET /api/reports/:id
      const res = await reportService.getReportById(report._id);
      setSelectedReport(res.data || report);
    } catch {
      setSelectedReport(report);
    }
    setIsDetailModalOpen(true);
  };

  // Update Report (PUT /api/reports/:id)
  const handleUpdateReport = async (id, updateData) => {
    setIsUpdating(true);
    try {
      const res = await reportService.updateReport(id, updateData);
      setReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      showNotification(`Report #${id.slice(-6).toUpperCase()} updated successfully!`);
      setIsDetailModalOpen(false);
      setSelectedReport(null);
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to update report. Please try again.',
        false
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (report) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete (DELETE /api/reports/:id)
  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      await reportService.deleteReport(reportToDelete._id);
      setReports((prev) => prev.filter((r) => r._id !== reportToDelete._id));
      showNotification(`Report #${reportToDelete._id.slice(-6).toUpperCase()} deleted successfully.`);
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to delete report. Please try again.',
        false
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Callback when report is submitted via ReportForm
  const handleReportCreated = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
    showNotification(`New waste issue report created with status "Pending"!`);
    setActiveTab('list');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIssueType('All Issues');
    setSelectedPriority('All Priorities');
    setSelectedStatus('All Statuses');
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        report.area?.toLowerCase().includes(query) ||
        report.reporterName?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query) ||
        report.issueType?.toLowerCase().includes(query);

      const matchesIssueType =
        selectedIssueType === 'All Issues' ||
        report.issueType?.toLowerCase() === selectedIssueType.toLowerCase();

      const matchesPriority =
        selectedPriority === 'All Priorities' ||
        report.priority?.toLowerCase() === selectedPriority.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All Statuses' ||
        report.status?.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesIssueType && matchesPriority && matchesStatus;
    });
  }, [reports, searchQuery, selectedIssueType, selectedPriority, selectedStatus]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status?.toLowerCase() === 'pending').length;
    const inProgress = reports.filter((r) => r.status?.toLowerCase() === 'in progress').length;
    const resolved = reports.filter((r) => r.status?.toLowerCase() === 'resolved').length;
    return { total, pending, inProgress, resolved };
  }, [reports]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityBadge = (priority) => {
    const val = (priority || '').toLowerCase();
    if (val === 'high') return <span className="badge badge-high">🔴 High</span>;
    if (val === 'medium') return <span className="badge badge-medium">🟡 Medium</span>;
    return <span className="badge badge-low">🟢 Low</span>;
  };

  const getStatusBadge = (status) => {
    const val = (status || '').toLowerCase().replace(/\s+/g, '-');
    if (val === 'resolved') return <span className="badge badge-resolved">✅ Resolved</span>;
    if (val === 'in-progress') return <span className="badge badge-in-progress">🔄 In Progress</span>;
    return <span className="badge badge-pending">⏳ Pending</span>;
  };

  const getIssueTypeIcon = (type) => {
    const val = (type || '').toLowerCase();
    if (val.includes('missed')) return '🚛';
    if (val.includes('overflow')) return '🗑️';
    if (val.includes('dumping')) return '🚯';
    return '⚠️';
  };

  return (
    <div className="module-container">
      {/* Top Main Card */}
      <div className="card report-main-card">
        <div className="report-header-row">
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>📢</span> Waste Issue Reporting & Resolution
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Public citizen reporting and municipal workflow tracking for missed collections, illegal dumping, and overflows.
            </p>
          </div>

          <div className="report-view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              📋 View Reports ({reports.length})
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              ➕ Report Issue
            </button>
          </div>
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

        {/* Quick Metric Cards */}
        <div className="report-stats-grid">
          <div className="report-stat-card">
            <span className="report-stat-title">Total Reports</span>
            <span className="report-stat-num">{stats.total}</span>
          </div>
          <div className="report-stat-card card-stat-pending">
            <span className="report-stat-title">⏳ Pending</span>
            <span className="report-stat-num text-amber">{stats.pending}</span>
          </div>
          <div className="report-stat-card card-stat-inprogress">
            <span className="report-stat-title">🔄 In Progress</span>
            <span className="report-stat-num text-blue">{stats.inProgress}</span>
          </div>
          <div className="report-stat-card card-stat-resolved">
            <span className="report-stat-title">✅ Resolved</span>
            <span className="report-stat-num text-green">{stats.resolved}</span>
          </div>
        </div>

        {/* Tab 1: Submit Issue Form */}
        {activeTab === 'create' ? (
          <div className="report-create-view fade-in">
            <div className="form-intro-banner">
              <h3 className="section-title">📝 Report a New Waste Issue</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Fill in the details below. Once submitted, municipal officers will receive the ticket as <strong>Pending</strong>.
              </p>
            </div>
            <ReportForm onReportCreated={handleReportCreated} />
          </div>
        ) : (
          /* Tab 2: Manage Reports List */
          <div className="report-list-view fade-in">
            {/* Search and Filters */}
            <ReportFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedIssueType={selectedIssueType}
              onIssueTypeChange={setSelectedIssueType}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onResetFilters={handleResetFilters}
              totalCount={reports.length}
              filteredCount={filteredReports.length}
            />

            {/* Content Table / States */}
            {loading ? (
              <div className="schedule-loading-state">
                <div className="spinner"></div>
                <p>Loading waste reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📢</div>
                <h3 className="empty-state-title">No Waste Reports Yet</h3>
                <p className="empty-state-text">
                  There are currently no citizen waste reports recorded in the system.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('create')}
                >
                  ➕ Submit First Report
                </button>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">No Matching Reports</h3>
                <p className="empty-state-text">
                  No reports match your current filter or search criteria.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetFilters}
                >
                  🔄 Reset Filters
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ref / Area</th>
                      <th>Issue Type</th>
                      <th>Citizen / Contact</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Reported</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((item) => (
                      <tr key={item._id} className="report-table-row">
                        <td>
                          <div>
                            <span className="report-ref-badge">
                              #{item._id ? item._id.slice(-6).toUpperCase() : ''}
                            </span>
                            <div className="area-cell" style={{ marginTop: '0.2rem' }}>
                              <span className="area-icon">📍</span>
                              <strong className="area-name">{item.area}</strong>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="issue-type-cell">
                            <span>{getIssueTypeIcon(item.issueType)}</span>
                            <span>{item.issueType}</span>
                          </div>
                        </td>
                        <td>
                          <div className="reporter-cell">
                            <span className="reporter-name-text">{item.reporterName}</span>
                            <span className="reporter-phone-text">📞 {item.phone}</span>
                          </div>
                        </td>
                        <td>{getPriorityBadge(item.priority)}</td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {formatDate(item.reportedAt)}
                        </td>
                        <td>
                          <div className="table-actions-container">
                            <button
                              type="button"
                              className="btn-action btn-action-edit"
                              onClick={() => handleOpenDetailModal(item)}
                              title="View & Update Report"
                              aria-label={`View details for report from ${item.reporterName}`}
                            >
                              🔍 View / Resolve
                            </button>
                            <button
                              type="button"
                              className="btn-action btn-action-delete"
                              onClick={() => handleOpenDeleteModal(item)}
                              title="Delete Report"
                              aria-label={`Delete report from ${item.reporterName}`}
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
        )}
      </div>

      {/* Detail / Status Update Modal */}
      <ReportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        onUpdateReport={handleUpdateReport}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ReportDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReportToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        report={reportToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ReportModule;
