import api from './api';

/**
 * taskService — calls /api/tasks which maps to Report documents.
 * No separate Task collection exists; this is a task-view over Reports.
 */
export const taskService = {
  // GET /api/tasks?status=&priority=&area=
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // GET /api/tasks/:id
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // PATCH /api/tasks/:id/status  { status, resolutionNote? }
  updateTaskStatus: async (id, status, resolutionNote = '') => {
    const body = { status };
    if (resolutionNote) body.resolutionNote = resolutionNote;
    const response = await api.patch(`/tasks/${id}/status`, body);
    return response.data;
  },
};
