import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const ProfileEdit = () => {
  const { showProfileEdit, setShowProfileEdit, user, setUser } = useData();
  const { user: authUser } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || authUser?.username || '',
    email: user?.email || authUser?.email || '',
    avatar: user?.avatar || '👤'
  });

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar
      });
    }
    setShowProfileEdit(false);
  };

  if (!showProfileEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={() => setShowProfileEdit(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <div className="flex space-x-2">
              {['👤', '👨', '👩', '🧑', '👦', '👧', '🤵', '👸'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setFormData({...formData, avatar: emoji})}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                    formData.avatar === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowProfileEdit(false)}
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

export default ProfileEdit;
