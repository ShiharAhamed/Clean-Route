import axiosClient from './axiosClient';

export const reportService = {
  // GET /api/reports
  getReports: (params) => axiosClient.get('/reports', { params }),

  // GET /api/reports/:id
  getReportById: (id) => axiosClient.get(`/reports/${id}`),

  // POST /api/reports
  createReport: (data) => axiosClient.post('/reports', data),

  // PUT /api/reports/:id
  updateReport: (id, data) => axiosClient.put(`/reports/${id}`, data),

  // DELETE /api/reports/:id
  deleteReport: (id) => axiosClient.delete(`/reports/${id}`),
};
