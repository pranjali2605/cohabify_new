import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Helper function to safely parse localStorage data
  const getStoredData = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored && stored !== 'undefined' && stored !== 'null') {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn(`Error parsing localStorage data for ${key}:`, error);
    }
    return defaultValue;
  };

  // Initialize with localStorage data or fallback to defaults
  const [user, setUser] = useState(() => {
    return getStoredData('cohabify_user', {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      avatar: '👤',
      role: 'user',
      joinedDate: '2024-01-01'
    });
  });

  const [habits, setHabits] = useState(() => {
    return getStoredData('cohabify_habits', [
      { 
        id: '1', 
        name: 'Morning Exercise', 
        description: '30 minutes workout', 
        frequency: 'daily', 
        streak: 5, 
        longestStreak: 8,
        completed: false, 
        category: 'Health',
        color: '#10B981',
        icon: '💪',
        createdDate: '2024-01-01',
        checkIns: [],
        isActive: true,
        difficulty: 'medium',
        points: 15
      },
      { 
        id: '2', 
        name: 'Read Books', 
        description: 'Read for 1 hour', 
        frequency: 'daily', 
        streak: 3, 
        longestStreak: 5,
        completed: false, 
        category: 'Learning',
        color: '#3B82F6',
        icon: '📚',
        createdDate: '2024-01-02',
        checkIns: [],
        isActive: true,
        difficulty: 'easy',
        points: 10
      },
      { 
        id: '3', 
        name: 'Meditation', 
        description: '15 minutes mindfulness', 
        frequency: 'daily', 
        streak: 7, 
        longestStreak: 10,
        completed: false, 
        category: 'Wellness',
        color: '#8B5CF6',
        icon: '🧘',
        createdDate: '2024-01-03',
        checkIns: [],
        isActive: true,
        difficulty: 'easy',
        points: 10
      }
    ]);
  });

  const [roommates, setRoommates] = useState(() => {
    return getStoredData('cohabify_roommates', [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '👩', joinedDate: '2024-01-15', habits: 8, points: 245 },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: '👨', joinedDate: '2024-01-10', habits: 6, points: 189 }
    ]);
  });

  const [secrets, setSecrets] = useState(() => {
    return getStoredData('cohabify_secrets', [
      { id: '1', content: 'I secretly love doing dishes when no one is around', author: 'Anonymous', timestamp: '2024-01-15T10:30:00Z', likes: 12, comments: ['Same here!', 'That\'s so wholesome'], isAnonymous: true },
      { id: '2', content: 'Sometimes I pretend to be asleep when it\'s my turn to take out trash', author: 'john_doe', timestamp: '2024-01-14T15:45:00Z', likes: 8, comments: ['We all do this 😅'], isAnonymous: false }
    ]);
  });

  const [moods, setMoods] = useState(() => {
    return getStoredData('cohabify_moods', [
      { id: '1', rating: 8, note: 'Great day at work!', tags: ['work', 'productive'], date: '2024-01-15' },
      { id: '2', rating: 6, note: 'Feeling okay, a bit tired', tags: ['tired'], date: '2024-01-14' },
      { id: '3', rating: 9, note: 'Amazing weekend with friends', tags: ['social', 'fun'], date: '2024-01-13' }
    ]);
  });

  const [badges, setBadges] = useState(() => {
    return getStoredData('cohabify_badges', [
      { id: '1', name: 'First Step', description: 'Complete your first habit check-in', icon: '🎯', earnedDate: '2024-01-01' },
      { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', progress: 5, target: 7 },
      { id: '3', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '👑', progress: 15, target: 30 },
      { id: '4', name: 'Never Miss Monday', description: 'Complete habits every Monday for a month', icon: '📅', progress: 2, target: 4 }
    ]);
  });

  const [habitDuels, setHabitDuels] = useState(() => {
    return getStoredData('cohabify_habitDuels', []);
  });

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Save to localStorage whenever data changes with error handling
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cohabify_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('cohabify_habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits data to localStorage:', error);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem('cohabify_roommates', JSON.stringify(roommates));
    } catch (error) {
      console.error('Error saving roommates data to localStorage:', error);
    }
  }, [roommates]);

  useEffect(() => {
    try {
      localStorage.setItem('cohabify_secrets', JSON.stringify(secrets));
    } catch (error) {
      console.error('Error saving secrets data to localStorage:', error);
    }
  }, [secrets]);

  useEffect(() => {
    try {
      localStorage.setItem('cohabify_moods', JSON.stringify(moods));
    } catch (error) {
      console.error('Error saving moods data to localStorage:', error);
    }
  }, [moods]);

  useEffect(() => {
    try {
      localStorage.setItem('cohabify_badges', JSON.stringify(badges));
    } catch (error) {
      console.error('Error saving badges data to localStorage:', error);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem('cohabify_habitDuels', JSON.stringify(habitDuels));
    } catch (error) {
      console.error('Error saving habit duels data to localStorage:', error);
    }
  }, [habitDuels]);

  // Habit functions
  const addHabit = (habit) => {
    const difficultyPoints = { easy: 10, medium: 15, hard: 20 };
    const newHabit = { 
      ...habit, 
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
      checkIns: [],
      streak: 0,
      longestStreak: 0,
      points: difficultyPoints[habit.difficulty]
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const updateHabit = (id, updates) => {
    setHabits(prev => prev.map(habit => habit.id === id ? { ...habit, ...updates } : habit));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const checkInHabit = (id, date) => {
    const checkDate = date || new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCheckIn = { date: checkDate, completed: true, timestamp };
        const updatedCheckIns = [...habit.checkIns, newCheckIn];
        const newStreak = habit.streak + 1;
        const newLongestStreak = Math.max(habit.longestStreak, newStreak);
        
        return {
          ...habit,
          checkIns: updatedCheckIns,
          streak: newStreak,
          longestStreak: newLongestStreak,
          completed: true,
          lastCheckIn: checkDate
        };
      }
      return habit;
    }));
    
    checkAndAwardBadges(id);
  };

  const checkAndAwardBadges = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    setBadges(prev => prev.map(badge => {
      let updatedBadge = { ...badge };
      
      // First Step badge
      if (badge.id === '1' && !badge.earnedDate && habit.checkIns.length === 1) {
        updatedBadge.earnedDate = new Date().toISOString().split('T')[0];
      }
      
      // Week Warrior badge
      if (badge.id === '2' && habit.streak >= 7 && !badge.earnedDate) {
        updatedBadge.earnedDate = new Date().toISOString().split('T')[0];
      } else if (badge.id === '2' && !badge.earnedDate) {
        updatedBadge.progress = habit.streak;
      }
      
      // Month Master badge
      if (badge.id === '3' && habit.streak >= 30 && !badge.earnedDate) {
        updatedBadge.earnedDate = new Date().toISOString().split('T')[0];
      } else if (badge.id === '3' && !badge.earnedDate) {
        updatedBadge.progress = habit.streak;
      }
      
      return updatedBadge;
    }));
  };

  const createHabitDuel = (habitId, participants, duration) => {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const newDuel = {
      id: Date.now().toString(),
      habitId,
      participants,
      startDate,
      endDate,
      status: 'active'
    };
    
    setHabitDuels(prev => [newDuel, ...prev]);
  };

  const updateHabitDuel = (id, updates) => {
    setHabitDuels(prev => prev.map(duel => duel.id === id ? { ...duel, ...updates } : duel));
  };

  // Roommate functions
  const addRoommate = (roommate) => {
    const newRoommate = { ...roommate, id: Date.now().toString() };
    setRoommates(prev => [newRoommate, ...prev]);
  };

  const updateRoommate = (id, updates) => {
    setRoommates(prev => prev.map(roommate => roommate.id === id ? { ...roommate, ...updates } : roommate));
  };

  const removeRoommate = (id) => {
    setRoommates(prev => prev.filter(roommate => roommate.id !== id));
  };

  // Secret functions
  const addSecret = (secret) => {
    const newSecret = { ...secret, id: Date.now().toString() };
    setSecrets(prev => [newSecret, ...prev]);
  };

  const updateSecret = (id, updates) => {
    setSecrets(prev => prev.map(secret => secret.id === id ? { ...secret, ...updates } : secret));
  };

  const deleteSecret = (id) => {
    setSecrets(prev => prev.filter(secret => secret.id !== id));
  };

  // Mood functions
  const addMood = (mood) => {
    const newMood = { ...mood, id: Date.now().toString() };
    setMoods(prev => [newMood, ...prev]);
  };

  const updateMood = (id, updates) => {
    setMoods(prev => prev.map(mood => mood.id === id ? { ...mood, ...updates } : mood));
  };

  const deleteMood = (id) => {
    setMoods(prev => prev.filter(mood => mood.id !== id));
  };

  const value = {
    user,
    setUser,
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    checkInHabit,
    badges,
    checkAndAwardBadges,
    habitDuels,
    createHabitDuel,
    updateHabitDuel,
    roommates,
    addRoommate,
    updateRoommate,
    removeRoommate,
    secrets,
    addSecret,
    updateSecret,
    deleteSecret,
    moods,
    addMood,
    updateMood,
    deleteMood,
    showProfileEdit,
    setShowProfileEdit,
    showSettings,
    setShowSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
