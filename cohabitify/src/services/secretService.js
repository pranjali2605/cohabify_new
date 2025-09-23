import apiClient from '../lib/api';

export const secretService = {
  // Get all secrets
  async getSecrets() {
    const response = await apiClient.get('/secrets');
    return response.data.secrets;
  },

  // Create new secret post
  async createSecret(data) {
    const response = await apiClient.post('/secrets', data);
    return response.data;
  },

  // Delete secret
  async deleteSecret(id) {
    await apiClient.delete(`/secrets/${id}`);
  },

  // Like/unlike secret
  async toggleLike(id) {
    const response = await apiClient.post(`/secrets/${id}/like`);
    return response.data;
  },

  // Get comments for secret
  async getComments(secretId) {
    const response = await apiClient.get(`/secrets/${secretId}/comments`);
    return response.data;
  },

  // Add comment to secret
  async addComment(secretId, content) {
    const response = await apiClient.post(`/secrets/${secretId}/comments`, { content });
    return response.data;
  },

  // Delete comment
  async deleteComment(secretId, commentId) {
    await apiClient.delete(`/secrets/${secretId}/comments/${commentId}`);
  }
};
