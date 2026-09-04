import axiosClient from './axiosClient';

export const statsService = {
  // GET /api/stats
  getStats: () => axiosClient.get('/stats'),
};
