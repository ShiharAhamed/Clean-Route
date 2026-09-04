import { Schedule } from '../models/Schedule.js';

// @desc    Get all schedules
// @route   GET /api/schedules
export const getAllSchedules = async (req, res, next) => {
  try {
    const { areaName, wasteType, status } = req.query;
    const filter = {};

    if (areaName) filter.areaName = new RegExp(areaName, 'i');
    if (wasteType) filter.wasteType = wasteType;
    if (status) filter.status = status;

    const schedules = await Schedule.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single schedule by ID
// @route   GET /api/schedules/:id
export const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    return res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
export const createSchedule = async (req, res, next) => {
  try {
    const { areaName, collectionDay, collectionTime, wasteType, status } = req.body;
    const schedule = await Schedule.create({
      areaName,
      collectionDay,
      collectionTime,
      wasteType,
      status: status || 'Active',
    });
    return res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
export const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    return res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
export const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    return res.status(200).json({ success: true, message: 'Schedule removed successfully' });
  } catch (error) {
    next(error);
  }
};
