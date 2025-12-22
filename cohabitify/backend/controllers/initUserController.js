import Habit from '../models/Habit.js';
import Mood from '../models/Mood.js';
import Room from '../models/Room.js';
import Secret from '../models/Secret.js';

// Initialize default data for a new user
export const initializeUserData = async (userId) => {
  try {
    // Helper to generate a simple alphanumeric room code
    function generateCode(length = 6) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid ambiguous chars
      let code = '';
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    // Ensure unique code
    async function generateUniqueCode() {
      for (let i = 0; i < 5; i++) {
        const code = generateCode();
        const exists = await Room.findOne({ code });
        if (!exists) return code;
      }
      // Fallback longer code
      return generateCode(8);
    }

    // Don't create any default habits - start with 0 habits
    const defaultHabits = [];

    // Don't create any default mood entries - start with 0
    const defaultMood = null;

    // Create a personal room for the user with all metrics at 0
    const defaultRoom = {
      name: 'My Personal Space',
      description: 'Your personal room for tracking habits and moods',
      owner: userId,
      members: [userId],
    };

    // Don't create any default secrets - start with 0
    const welcomeSecret = null;

    // Only create the room (with stats set to 0)
    // Other collections will be empty initially
    const code = await generateUniqueCode();
    await Room.create({ ...defaultRoom, code });

    return true;
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

export default {
  initializeUserData
};
