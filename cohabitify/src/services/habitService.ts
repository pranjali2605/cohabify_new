import apiClient from '../lib/api';
import { Habit, CreateHabitRequest, UpdateHabitRequest, HabitAnalytics } from '../types';

export const habitService = {
  // Get all habits for the current user
  getHabits: async (): Promise<Habit[]> => {
    const response = await apiClient.get('/habits');
    return response.data.habits;
  },

  // Create a new habit
  createHabit: async (habit: CreateHabitRequest): Promise<Habit> => {
    const response = await apiClient.post('/habits', habit);
    return response.data.habit;
  },

  // Update an existing habit
  updateHabit: async (id: string, habit: UpdateHabitRequest): Promise<Habit> => {
    const response = await apiClient.put(`/habits/${id}`, habit);
    return response.data.habit;
  },

  // Delete a habit
  deleteHabit: async (id: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}`);
  },

  // Mark habit as completed for today
  completeHabit: async (id: string, notes?: string): Promise<Habit> => {
    const response = await apiClient.post(`/habits/${id}/complete`, { notes });
    return response.data.habit;
  },

  // Get habit analytics
  getAnalytics: async (): Promise<HabitAnalytics> => {
    const response = await apiClient.get('/habits/analytics');
    return response.data.analytics;
  },

  // Get habit completion history
  getHistory: async (id: string, days?: number): Promise<any[]> => {
    const response = await apiClient.get(`/habits/${id}/history`, {
      params: { days }
    });
    return response.data;
  }
};
