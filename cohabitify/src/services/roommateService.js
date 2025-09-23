import apiClient from '../lib/api';

export const roommateService = {
  // Roommates
  async getRoommates() {
    const response = await apiClient.get('/roommates');
    return response.data;
  },

  async inviteRoommate(email) {
    await apiClient.post('/roommates/invite', { email });
  },

  // Roommate analytics
  async getRoommateAnalytics() {
    const response = await apiClient.get('/roommates/analytics');
    return response.data;
  }
};
