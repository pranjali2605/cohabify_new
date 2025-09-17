import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const Settings: React.FC = () => {
  const { showSettings, setShowSettings, user } = useData();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    habitReminders: true,
    roommateUpdates: true
  });

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('cohabitify_settings', JSON.stringify(settings));
    setShowSettings(false);
  };

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Push Notifications</span>
            <button
              onClick={() => setSettings({...settings, notifications: !settings.notifications})}
              className={`w-12 h-6 rounded-full ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Dark Mode</span>
            <button
              onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
              className={`w-12 h-6 rounded-full ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Email Updates</span>
            <button
              onClick={() => setSettings({...settings, emailUpdates: !settings.emailUpdates})}
              className={`w-12 h-6 rounded-full ${settings.emailUpdates ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.emailUpdates ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Habit Reminders</span>
            <button
              onClick={() => setSettings({...settings, habitReminders: !settings.habitReminders})}
              className={`w-12 h-6 rounded-full ${settings.habitReminders ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.habitReminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Roommate Updates</span>
            <button
              onClick={() => setSettings({...settings, roommateUpdates: !settings.roommateUpdates})}
              className={`w-12 h-6 rounded-full ${settings.roommateUpdates ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.roommateUpdates ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Account:</strong> {user?.role === 'admin' ? 'Administrator' : 'User'}</p>
              <p><strong>Member since:</strong> {user?.joinedDate}</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Settings
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
