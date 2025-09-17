import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';

const HabitTracker: React.FC = () => {
  const { 
    habits, 
    addHabit, 
    deleteHabit, 
    checkInHabit, 
    badges, 
    habitDuels, 
    createHabitDuel, 
    roommates 
  } = useData();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showDuelForm, setShowDuelForm] = useState(false);
  const [selectedHabitForDuel, setSelectedHabitForDuel] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'stats'>('list');
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'Health',
    description: '',
    frequency: 'daily' as const,
    color: '#3B82F6',
    icon: '🎯',
    difficulty: 'medium' as const,
    reminderTime: '',
    isActive: true
  });

  const categories = [
    { name: 'Health', icon: '💪', color: '#10B981' },
    { name: 'Learning', icon: '📚', color: '#3B82F6' },
    { name: 'Wellness', icon: '🧘', color: '#8B5CF6' },
    { name: 'Productivity', icon: '⚡', color: '#F59E0B' },
    { name: 'Social', icon: '👥', color: '#EF4444' },
    { name: 'Creativity', icon: '🎨', color: '#EC4899' },
    { name: 'Finance', icon: '💰', color: '#059669' },
    { name: 'Fitness', icon: '🏃', color: '#DC2626' }
  ];

  const habitIcons = ['🎯', '💪', '📚', '🧘', '⚡', '🏃', '💧', '🍎', '📝', '🎨', '🎵', '💰'];
  const difficultyColors = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };

  const stats = useMemo(() => {
    const completedToday = habits.filter(h => h.completed).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const bestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
    const totalPoints = habits.reduce((sum, h) => sum + (h.completed ? h.points : 0), 0);
    
    return { completedToday, totalHabits, completionRate, bestStreak, totalPoints };
  }, [habits]);

  const earnedBadges = badges.filter(b => b.earnedDate);

  const createHabit = () => {
    if (newHabit.name.trim()) {
      addHabit({
        ...newHabit,
        completed: false
      });
      setNewHabit({
        name: '',
        category: 'Health',
        description: '',
        frequency: 'daily',
        color: '#3B82F6',
        icon: '🎯',
        difficulty: 'medium',
        reminderTime: '',
        isActive: true
      });
      setShowCreateForm(false);
    }
  };

  const handleCheckIn = (habitId: string) => {
    checkInHabit(habitId);
  };

  const startDuel = () => {
    if (selectedHabitForDuel && roommates.length > 0) {
      createHabitDuel(selectedHabitForDuel, [roommates[0].id], 7);
      setShowDuelForm(false);
      setSelectedHabitForDuel('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Habit Duel Tracker</h1>
          <p className="text-gray-600 mt-1">Build better habits, compete with friends</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBadges(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center space-x-2"
          >
            <span>🏆</span>
            <span>Badges ({earnedBadges.length})</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { mode: 'list', label: 'List View', icon: '📋' },
          { mode: 'calendar', label: 'Calendar', icon: '📅' },
          { mode: 'stats', label: 'Analytics', icon: '📊' }
        ].map(({ mode, label, icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              viewMode === mode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}/{stats.totalHabits}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bestStreak}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl">🔥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Duels</p>
              <p className="text-2xl font-bold text-gray-900">{habitDuels.filter(d => d.status === 'active').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">⚔️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Duels Section */}
      {habitDuels.filter(d => d.status === 'active').length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <span className="mr-2">⚔️</span>
            Active Habit Duels
          </h3>
          <div className="space-y-3">
            {habitDuels.filter(d => d.status === 'active').map(duel => {
              const habit = habits.find(h => h.id === duel.habitId);
              return (
                <div key={duel.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{habit?.name}</h4>
                      <p className="text-sm text-gray-600">
                        Duel ends: {new Date(duel.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">VS Roommates</p>
                      <p className="text-xs text-gray-500">{duel.participants.length} participants</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Your Habits</h2>
          <button
            onClick={() => setShowDuelForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <span>⚔️</span>
            <span>Start Duel</span>
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className="p-4 rounded-lg border-2 transition-all hover:shadow-md"
                style={{ borderColor: habit.color + '20', backgroundColor: habit.color + '05' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{habit.name}</h3>
                      <p className="text-sm text-gray-600">{habit.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckIn(habit.id)}
                    disabled={habit.completed}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      habit.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    {habit.completed && <span className="text-xs">✓</span>}
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: habit.color + '20', 
                        color: habit.color 
                      }}
                    >
                      {habit.category}
                    </span>
                    <span className="text-gray-600">🔥 {habit.streak} day streak</span>
                    <span className="text-gray-600">🏆 Best: {habit.longestStreak}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: difficultyColors[habit.difficulty] }}
                    >
                      {habit.difficulty}
                    </span>
                    <span className="text-gray-600 text-xs">+{habit.points}pts</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">🎯</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-4">Start building better habits today!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Your First Habit
          </button>
        </div>
      )}

      {/* Create Habit Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Habit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Morning Exercise"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {habitIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                      className={`p-2 text-xl border rounded ${
                        newHabit.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={newHabit.difficulty}
                  onChange={(e) => setNewHabit({ ...newHabit, difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy (+10 points)</option>
                  <option value="medium">Medium (+15 points)</option>
                  <option value="hard">Hard (+20 points)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your habit..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createHabit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      {showBadges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Badges</h3>
              <button
                onClick={() => setShowBadges(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`text-center p-4 rounded-lg border ${
                    badge.earnedDate ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${!badge.earnedDate ? 'opacity-50' : ''}`}>
                    {badge.icon}
                  </div>
                  <h5 className="font-medium text-gray-900">{badge.name}</h5>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  {badge.earnedDate ? (
                    <p className="text-xs text-yellow-600 mt-2">
                      Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  ) : badge.progress !== undefined ? (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${((badge.progress || 0) / (badge.target || 1)) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {badge.progress}/{badge.target}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Habit Duel Modal */}
      {showDuelForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Habit Duel</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Habit
                </label>
                <select
                  value={selectedHabitForDuel}
                  onChange={(e) => setSelectedHabitForDuel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a habit...</option>
                  {habits.map(habit => (
                    <option key={habit.id} value={habit.id}>
                      {habit.icon} {habit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">⚔️ Duel Rules</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• 7-day competition with roommates</li>
                  <li>• Most consistent check-ins wins</li>
                  <li>• Winner gets bonus points</li>
                  <li>• Loser does house chores</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDuelForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={startDuel}
                disabled={!selectedHabitForDuel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Start Duel ⚔️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default HabitTracker;
