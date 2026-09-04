const Schedule = require('../models/Schedule');

// @desc    Get all schedules (with optional search and filters)
// @route   GET /api/schedules
exports.getSchedules = async (req, res) => {
  try {
    const { search, areaName, collectionDay, wasteType, status } = req.query;
    const filter = {};

    // Search by area name (regex case-insensitive)
    if (search) {
      filter.areaName = { $regex: search, $options: 'i' };
    } else if (areaName) {
      filter.areaName = { $regex: areaName, $options: 'i' };
    }

    // Filter by specific day
    if (collectionDay && collectionDay !== 'All') {
      filter.collectionDay = collectionDay;
    }

    // Filter by waste type
    if (wasteType && wasteType !== 'All') {
      filter.wasteType = wasteType;
    }

    // Filter by status
    if (status && status !== 'All') {
      filter.status = status;
    }

    const schedules = await Schedule.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single schedule
// @route   GET /api/schedules/:id
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
exports.createSchedule = async (req, res) => {
  try {
    const { areaName, collectionDay, collectionTime, wasteType, status } = req.body;

    // Validation
    if (!areaName || !collectionDay || !collectionTime || !wasteType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide areaName, collectionDay, collectionTime, and wasteType',
      });
    }

    const schedule = await Schedule.create({
      areaName: areaName.trim(),
      collectionDay: collectionDay.trim(),
      collectionTime: collectionTime.trim(),
      wasteType: wasteType.trim(),
      status: status ? status.trim() : 'Active',
    });

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
exports.updateSchedule = async (req, res) => {
  try {
    const { areaName, collectionDay, collectionTime, wasteType, status } = req.body;

    if (areaName !== undefined && !areaName.trim()) {
      return res.status(400).json({ success: false, message: 'Area name cannot be empty' });
    }

    const updateData = {};
    if (areaName) updateData.areaName = areaName.trim();
    if (collectionDay) updateData.collectionDay = collectionDay.trim();
    if (collectionTime) updateData.collectionTime = collectionTime.trim();
    if (wasteType) updateData.wasteType = wasteType.trim();
    if (status) updateData.status = status.trim();

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
