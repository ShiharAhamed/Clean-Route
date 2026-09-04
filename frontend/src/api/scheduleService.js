import axiosClient from './axiosClient';

export const scheduleService = {
  // GET /api/schedules
  getSchedules: (params) => axiosClient.get('/schedules', { params }),

  // GET /api/schedules/:id
  getScheduleById: (id) => axiosClient.get(`/schedules/${id}`),

  // POST /api/schedules
  createSchedule: (data) => axiosClient.post('/schedules', data),

  // PUT /api/schedules/:id
  updateSchedule: (id, data) => axiosClient.put(`/schedules/${id}`, data),

  // DELETE /api/schedules/:id
  deleteSchedule: (id) => axiosClient.delete(`/schedules/${id}`),
};
