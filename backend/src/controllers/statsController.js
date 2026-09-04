import { Report } from '../models/Report.js';
import { Schedule } from '../models/Schedule.js';

// @desc    Get dashboard statistics and summaries
// @route   GET /api/stats
export const getStats = async (req, res, next) => {
  try {
    const [
      totalReports,
      pendingReports,
      inProgressReports,
      resolvedReports,
      highPriorityReports,
      totalSchedules,
      reportsByIssueType,
      reportsByArea,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'Pending' }),
      Report.countDocuments({ status: 'In Progress' }),
      Report.countDocuments({ status: 'Resolved' }),
      Report.countDocuments({ priority: 'High', status: { $ne: 'Resolved' } }),
      Schedule.countDocuments(),
      Report.aggregate([
        { $group: { _id: '$issueType', count: { $sum: 1 } } },
        { $project: { issueType: '$_id', count: 1, _id: 0 } },
      ]),
      Report.aggregate([
        { $group: { _id: '$area', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { area: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        inProgressReports,
        resolvedReports,
        highPriorityReports,
        totalSchedules,
        reportsByIssueType,
        reportsByArea,
      },
    });
  } catch (error) {
    next(error);
  }
};
