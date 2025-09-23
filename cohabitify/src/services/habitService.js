import apiClient from '../lib/api';

export const habitService = {
  // Get all habits for the current user
  getHabits: async () => {
    const response = await apiClient.get('/habits');
    return response.data.habits;
  },

  // Create a new habit
  createHabit: async (habit) => {
    const response = await apiClient.post('/habits', habit);
    return response.data.habit;
  },

  // Update an existing habit
  updateHabit: async (id, habit) => {
    const response = await apiClient.put(`/habits/${id}`, habit);
    return response.data.habit;
  },

  // Delete a habit
  deleteHabit: async (id) => {
    await apiClient.delete(`/habits/${id}`);
  },

  // Mark habit as completed for today
  completeHabit: async (id, notes) => {
    const response = await apiClient.post(`/habits/${id}/complete`, { notes });
    return response.data.habit;
  },

  // Get habit analytics
  getAnalytics: async () => {
    const response = await apiClient.get('/habits/analytics');
    return response.data.analytics;
  },

  // Get habit completion history
  getHistory: async (id, days) => {
    const response = await apiClient.get(`/habits/${id}/history`, {
      params: { days }
    });
    return response.data;
  }
};
