import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { habits, updateHabit, addHabit } = useData();
  const [showQuickAddHabit, setShowQuickAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const handleQuickAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName,
        description: '',
        frequency: 'daily',
        completed: false,
        category: 'General',
        color: '#3B82F6',
        icon: '🎯',
        isActive: true,
        difficulty: 'medium'
      });
      setNewHabitName('');
      setShowQuickAddHabit(false);
    }
  };

  const toggleHabitCompletion = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      updateHabit(habitId, { 
        completed: !habit.completed,
        streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
      });
    }
  };

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const averageStreak = totalHabits > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / totalHabits) : 0;

  const weeklyData = [
    { day: 'Mon', completed: 8 },
    { day: 'Tue', completed: 6 },
    { day: 'Wed', completed: 9 },
    { day: 'Thu', completed: 7 },
    { day: 'Fri', completed: 8 },
    { day: 'Sat', completed: 5 },
    { day: 'Sun', completed: 6 },
  ];


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Habits & Streaks</h1>
        <button 
          onClick={() => setShowQuickAddHabit(!showQuickAddHabit)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <span className="text-lg">➕</span>
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Quick Add Habit Form */}
      {showQuickAddHabit && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Add New Habit</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && handleQuickAddHabit()}
            />
            <button
              onClick={handleQuickAddHabit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowQuickAddHabit(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Habits</p>
              <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
            </div>
            <span className="text-3xl">🎯</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Streak</p>
              <p className="text-2xl font-bold text-gray-900">{averageStreak}</p>
            </div>
            <span className="text-3xl">🔥</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <span className="text-3xl">📈</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Calendar</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={index} className="font-medium text-gray-600 py-2">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, index) => (
              <div key={index} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                {index + 1 <= 31 ? index + 1 : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
          <div className="space-y-3">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{day.day}</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(day.completed / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{day.completed}/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Habits */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Today's Habits</h3>
        <div className="space-y-3">
          {habits.slice(0, 6).map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${habit.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                >
                  {habit.completed && <span className="text-white text-sm">✓</span>}
                </button>
                <div>
                  <p className={`font-medium ${habit.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {habit.name}
                  </p>
                  <p className="text-sm text-gray-500">🔥 {habit.streak} day streak</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${habit.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {habit.frequency}
                </span>
                <button 
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`px-3 py-1 text-sm rounded-lg ${habit.completed ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {habit.completed ? 'Done' : 'Mark Done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/dashboard/habits')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View All Habits
          </button>
          <button 
            onClick={() => navigate('/dashboard/roommate')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Roommate Dashboard
          </button>
          <button 
            onClick={() => navigate('/dashboard/secrets')}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Secret Circle
          </button>
          <button 
            onClick={() => navigate('/dashboard/mood')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Mood Mirror
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
