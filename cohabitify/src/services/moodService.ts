import { apiClient } from '../lib/api';
import { Mood, CreateMoodData, MoodAnalytics, MoodInsights } from '../types';

export const moodService = {
  // Get all mood logs
  async getMoods(): Promise<Mood[]> {
    const response = await apiClient.get('/moods');
    return response.data;
  },

  // Get mood by date
  async getMoodByDate(date: string): Promise<Mood | null> {
    const response = await apiClient.get(`/moods/date/${date}`);
    return response.data;
  },

  // Log daily mood
  async logMood(data: CreateMoodData): Promise<Mood> {
    const response = await apiClient.post('/moods', data);
    return response.data;
  },

  // Update mood log
  async updateMood(id: string, data: Partial<Mood>): Promise<Mood> {
    const response = await apiClient.put(`/moods/${id}`, data);
    return response.data;
  },

  // Delete mood log
  async deleteMood(id: string): Promise<void> {
    await apiClient.delete(`/moods/${id}`);
  },

  // Get mood analytics
  async getMoodAnalytics(): Promise<MoodAnalytics> {
    const response = await apiClient.get('/moods/analytics');
    return response.data;
  },

  // Get mood insights
  async getMoodInsights(): Promise<MoodInsights> {
    const response = await apiClient.get('/moods/insights');
    return response.data;
  }
};
