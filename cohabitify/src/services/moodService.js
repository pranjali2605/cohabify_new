import apiClient from '../lib/api';

export const moodService = {
  // Get all mood logs
  async getMoods() {
    const response = await apiClient.get('/moods');
    return response.data.moods;
  },

  // Get mood by date
  async getMoodByDate(date) {
    const response = await apiClient.get(`/moods/date/${date}`);
    return response.data;
  },

  // Log daily mood
  async logMood(data) {
    const response = await apiClient.post('/moods', data);
    return response.data;
  },

  // Update mood log
  async updateMood(id, data) {
    const response = await apiClient.put(`/moods/${id}`, data);
    return response.data;
  },

  // Delete mood log
  async deleteMood(id) {
    await apiClient.delete(`/moods/${id}`);
  },

  // Get mood analytics
  async getMoodAnalytics() {
    const response = await apiClient.get('/moods/analytics');
    return response.data;
  },

  // Get mood insights
  async getMoodInsights() {
    const response = await apiClient.get('/moods/insights');
    return response.data;
  }
};
