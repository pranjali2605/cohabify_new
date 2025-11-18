import Habit from '../models/Habit.js';
import Mood from '../models/Mood.js';
import Room from '../models/Room.js';
import Secret from '../models/Secret.js';

// Initialize default data for a new user
export const initializeUserData = async (userId) => {
  try {
    // Don't create any default habits - start with 0 habits
    const defaultHabits = [];

    // Don't create any default mood entries - start with 0
    const defaultMood = null;

    // Create a personal room for the user with all metrics at 0
    const defaultRoom = {
      name: 'My Personal Space',
      description: 'Your personal room for tracking habits and moods',
      createdBy: userId,
      members: [userId],
      isPrivate: true,
      stats: {
        totalHabits: 0,
        completedToday: 0,
        averageStreak: 0,
        weeklyPerformance: 0
      }
    };

    // Don't create any default secrets - start with 0
    const welcomeSecret = null;

    // Only create the room (with stats set to 0)
    // Other collections will be empty initially
    await Room.create(defaultRoom);

    return true;
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

export default {
  initializeUserData
};
