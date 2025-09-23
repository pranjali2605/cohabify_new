import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { showSettings, setShowSettings } = useData();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    // theme removed
    emailUpdates: true,
    habitReminders: true,
    roommateUpdates: true
  });
  const [account, setAccount] = useState({ username: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // No theme initialization

  // Initialize account fields from user
  useEffect(() => {
    if (user) {
      setAccount({ username: user.username || '', email: user.email || '' });
    }
  }, [user?.username, user?.email]);

  // No theme application

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    // Basic validation
    if (!account.username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setSaving(true);
    try {
      // Note: Profile update via API is currently disabled because updateProfile
      // is not exposed by AuthContext. Persist local UI settings only.
      setSuccess('Settings saved locally');
    } catch (e) {
      console.error('Failed to save settings', e);
      setError(e?.message || 'Failed to save settings');
    } finally {
      // Optionally keep other local UI settings in localStorage
      localStorage.setItem('cohabify_settings', JSON.stringify(settings));
      setSaving(false);
    }
  };

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-900">
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
          {/* Feedback */}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Account</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  value={account.username}
                  onChange={(e) => setAccount(a => ({ ...a, username: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount(a => ({ ...a, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-600">
                <p><strong>Member since:</strong> -</p>
              </div>
            </div>
          </div>

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

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50`}
            >
              {saving ? 'Saving...' : 'Save Settings'}
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
