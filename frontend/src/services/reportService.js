import api from './api';

export const reportService = {
  // GET /api/reports (with optional filters: { status, priority, issueType, area })
  getReports: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  // GET /api/reports/:id
  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // POST /api/reports
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  // PUT /api/reports/:id
  updateReport: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  // DELETE /api/reports/:id
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};
