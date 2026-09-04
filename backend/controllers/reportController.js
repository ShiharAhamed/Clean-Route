const Report = require('../models/Report');

// @desc    Get all reports (with optional filtering)
// @route   GET /api/reports
exports.getReports = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All Statuses') {
      filter.status = req.query.status;
    }
    if (req.query.priority && req.query.priority !== 'All Priorities') {
      filter.priority = req.query.priority;
    }
    if (req.query.issueType && req.query.issueType !== 'All Issues') {
      filter.issueType = req.query.issueType;
    }
    if (req.query.area) {
      filter.area = new RegExp(req.query.area, 'i');
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { area: searchRegex },
        { reporterName: searchRegex },
        { description: searchRegex },
        { issueType: searchRegex },
      ];
    }

    const reports = await Report.find(filter).sort({ reportedAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new report (newly created reports strictly default to 'Pending')
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { reporterName, phone, area, issueType, description, priority } = req.body;

    if (!reporterName || !phone || !area || !issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: reporterName, phone, area, issueType, description',
      });
    }

    const report = await Report.create({
      reporterName: reporterName.trim(),
      phone: phone.trim(),
      area: area.trim(),
      issueType: issueType.trim(),
      description: description.trim(),
      priority: priority || 'Medium',
      status: 'Pending', // A newly created report must default to Pending
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update report (e.g. status, resolutionNote, etc.)
// @route   PUT /api/reports/:id
exports.updateReport = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    const report = await Report.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
