import { Report } from '../models/Report.js';

// @desc    Get all reports (with optional status, area, and priority filtering)
// @route   GET /api/reports
export const getAllReports = async (req, res, next) => {
  try {
    const { status, priority, area, issueType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (area) filter.area = new RegExp(area, 'i');
    if (issueType) filter.issueType = issueType;

    const reports = await Report.find(filter).sort({ reportedAt: -1 });
    return res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new report (Citizen Submission)
// @route   POST /api/reports
export const createReport = async (req, res, next) => {
  try {
    const {
      reporterName,
      phone,
      area,
      issueType,
      description,
      priority,
      status,
      resolutionNote,
    } = req.body;

    const report = await Report.create({
      reporterName,
      phone,
      area,
      issueType,
      description,
      priority: priority || 'Medium',
      status: status || 'Pending',
      resolutionNote: resolutionNote || '',
    });

    return res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report (Municipal status progression & resolution notes)
// @route   PUT /api/reports/:id
export const updateReport = async (req, res, next) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const report = await Report.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    return res.status(200).json({ success: true, message: 'Report removed successfully' });
  } catch (error) {
    next(error);
  }
};
