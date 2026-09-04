const Schedule = require('../models/Schedule');
const Report = require('../models/Report');

// @desc    Get aggregate statistics for community dashboard
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const totalSchedules = await Schedule.countDocuments();
    const activeSchedules = await Schedule.countDocuments({ status: 'Active' });

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const inProgressReports = await Report.countDocuments({ status: 'In Progress' });
    const resolvedReports = await Report.countDocuments({ status: 'Resolved' });

    const lowPriority = await Report.countDocuments({ priority: 'Low' });
    const mediumPriority = await Report.countDocuments({ priority: 'Medium' });
    const highPriority = await Report.countDocuments({ priority: 'High' });

    const missedCollection = await Report.countDocuments({ issueType: 'Missed Collection' });
    const overflowingWaste = await Report.countDocuments({ issueType: 'Overflowing Waste' });
    const illegalDumping = await Report.countDocuments({ issueType: 'Illegal Dumping' });
    const otherIssues = await Report.countDocuments({ issueType: 'Other' });

    const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        schedules: {
          total: totalSchedules,
          active: activeSchedules,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          inProgress: inProgressReports,
          resolved: resolvedReports,
          resolutionRate: `${resolutionRate}%`,
        },
        byPriority: {
          low: lowPriority,
          medium: mediumPriority,
          high: highPriority,
        },
        byIssueType: {
          missedCollection,
          overflowingWaste,
          illegalDumping,
          other: otherIssues,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
