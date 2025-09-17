import { apiClient } from '../lib/api';
import { Secret, CreateSecretData, Comment } from '../types';

export const secretService = {
  // Get all secrets
  async getSecrets(): Promise<Secret[]> {
    const response = await apiClient.get('/secrets');
    return response.data;
  },

  // Create new secret post
  async createSecret(data: CreateSecretData): Promise<Secret> {
    const response = await apiClient.post('/secrets', data);
    return response.data;
  },

  // Delete secret
  async deleteSecret(id: string): Promise<void> {
    await apiClient.delete(`/secrets/${id}`);
  },

  // Like/unlike secret
  async toggleLike(id: string): Promise<Secret> {
    const response = await apiClient.post(`/secrets/${id}/like`);
    return response.data;
  },

  // Get comments for secret
  async getComments(secretId: string): Promise<Comment[]> {
    const response = await apiClient.get(`/secrets/${secretId}/comments`);
    return response.data;
  },

  // Add comment to secret
  async addComment(secretId: string, content: string): Promise<Comment> {
    const response = await apiClient.post(`/secrets/${secretId}/comments`, { content });
    return response.data;
  },

  // Delete comment
  async deleteComment(secretId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/secrets/${secretId}/comments/${commentId}`);
  }
};
