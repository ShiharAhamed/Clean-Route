import api from './api';

export const statsService = {
  // GET /api/stats
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};
