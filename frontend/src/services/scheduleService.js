import api from './api';

export const scheduleService = {
  // GET /api/schedules
  getSchedules: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },

  // GET /api/schedules/:id
  getScheduleById: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  // POST /api/schedules
  createSchedule: async (scheduleData) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  // PUT /api/schedules/:id
  updateSchedule: async (id, scheduleData) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },

  // DELETE /api/schedules/:id
  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },
};
