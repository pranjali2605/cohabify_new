import React, { useState } from 'react';

const MoodMirror = () => {
  // Mock data
  const mockMoods = [
    { id: '1', rating: 8, note: 'Great day at work!', tags: ['work', 'productive'], date: '2024-01-15' },
    { id: '2', rating: 6, note: 'Feeling okay, a bit tired', tags: ['tired'], date: '2024-01-14' },
    { id: '3', rating: 9, note: 'Amazing weekend with friends', tags: ['social', 'fun'], date: '2024-01-13' }
  ];

  const mockAnalytics = {
    averageRating: 7.7,
    moodTrend: 'improving'
  };

  const [moods, setMoods] = useState(mockMoods);
  const [analytics] = useState(mockAnalytics);
  const [todayMood, setTodayMood] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newMood, setNewMood] = useState({
    rating: 5,
    note: '',
    tags: [],
    date: new Date().toISOString().split('T')[0]
  });

  const handleLogMood = () => {
    const mood = {
      id: Date.now().toString(),
      ...newMood
    };
    setMoods([mood, ...moods]);
    setTodayMood(mood);
    setNewMood({ rating: 5, note: '', tags: [], date: new Date().toISOString().split('T')[0] });
    setShowLogForm(false);
  };

  const getMoodEmoji = (rating) => {
    if (rating >= 9) return '😄';
    if (rating >= 7) return '😊';
    if (rating >= 5) return '😐';
    if (rating >= 3) return '😔';
    return '😢';
  };

  const getMoodColor = (rating) => {
    if (rating >= 8) return 'bg-green-100 text-green-800';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood Mirror</h1>
          <p className="text-gray-600 mt-1">Track your daily emotions and mental well-being</p>
        </div>
        <button 
          onClick={() => setShowLogForm(!showLogForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700"
        >
          <span>💝</span>
          <span>Log Mood</span>
        </button>
      </div>

      {/* Log Mood Form */}
      {showLogForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood Rating (1-10): {newMood.rating}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={newMood.rating}
                onChange={(e) => setNewMood({...newMood, rating: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>😢 Very Bad</span>
                <span className="text-2xl">{getMoodEmoji(newMood.rating)}</span>
                <span>😄 Excellent</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={newMood.note}
                onChange={(e) => setNewMood({...newMood, note: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="What's affecting your mood today?"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleLogMood}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Save Mood
              </button>
              <button
                onClick={() => setShowLogForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Mood */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Today's Mood</h3>
        {todayMood ? (
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{getMoodEmoji(todayMood.rating)}</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayMood.rating}/10</p>
              <p className="text-gray-600">{todayMood.note}</p>
              {todayMood.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {todayMood.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">😐</span>
            <p className="text-gray-600 mb-4">You haven't logged your mood today</p>
            <button
              onClick={() => setShowLogForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Log Your Mood
            </button>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</p>
            </div>
            <span className="text-3xl">📈</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mood Trend</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{analytics.moodTrend}</p>
            </div>
            <span className="text-3xl">💝</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Days Logged</p>
              <p className="text-2xl font-bold text-gray-900">{moods.length}</p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </div>
      </div>

      {/* Mood Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Weekly Mood Trend</h3>
        <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📊</span>
            <p className="text-gray-600">Mood chart visualization</p>
            <p className="text-sm text-gray-500">Average: {analytics.averageRating.toFixed(1)}/10</p>
          </div>
        </div>
      </div>

      {/* Recent Moods */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Mood Logs</h3>
        {moods.length > 0 ? (
          <div className="space-y-4">
            {moods.slice(0, 5).map((mood) => (
              <div key={mood.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getMoodEmoji(mood.rating)}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(mood.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{mood.note}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-sm rounded-full ${getMoodColor(mood.rating)}`}>
                  {mood.rating}/10
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">💝</span>
            <p className="text-gray-600">Start tracking your mood to see patterns and insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodMirror;
