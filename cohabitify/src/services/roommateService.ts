import { apiClient } from '../lib/api';
import { Roommate, Chore, CreateChoreData, Expense, CreateExpenseData, RoommateAnalytics } from '../types';

export const roommateService = {
  // Roommates
  async getRoommates(): Promise<Roommate[]> {
    const response = await apiClient.get('/roommate/roommates');
    return response.data;
  },

  async inviteRoommate(email: string): Promise<void> {
    await apiClient.post('/roommate/invite', { email });
  },

  async removeRoommate(id: string): Promise<void> {
    await apiClient.delete(`/roommate/roommates/${id}`);
  },

  // Chores
  async getChores(): Promise<Chore[]> {
    const response = await apiClient.get('/roommate/chores');
    return response.data;
  },

  async createChore(data: CreateChoreData): Promise<Chore> {
    const response = await apiClient.post('/roommate/chores', data);
    return response.data;
  },

  async updateChore(id: string, data: Partial<Chore>): Promise<Chore> {
    const response = await apiClient.put(`/roommate/chores/${id}`, data);
    return response.data;
  },

  async deleteChore(id: string): Promise<void> {
    await apiClient.delete(`/roommate/chores/${id}`);
  },

  async completeChore(id: string): Promise<Chore> {
    const response = await apiClient.post(`/roommate/chores/${id}/complete`);
    return response.data;
  },

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const response = await apiClient.get('/roommate/expenses');
    return response.data;
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await apiClient.post('/roommate/expenses', data);
    return response.data;
  },

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    const response = await apiClient.put(`/roommate/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await apiClient.delete(`/roommate/expenses/${id}`);
  },

  // Roommate analytics
  async getRoommateAnalytics(): Promise<RoommateAnalytics> {
    const response = await apiClient.get('/roommate/analytics');
    return response.data;
  }
};
