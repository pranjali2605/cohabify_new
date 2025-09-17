import React, { useState } from 'react';

interface Roommate {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

interface RoommateAnalytics {
  totalChores: number;
  completedChores: number;
  totalExpenses: number;
  yourShare: number;
}

const RoomMate: React.FC = () => {
  // Mock data
  const mockRoommates: Roommate[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', joinedAt: '2024-01-15' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', joinedAt: '2024-01-20' },
    { id: '3', name: 'Mike Davis', email: 'mike@example.com', joinedAt: '2024-02-01' }
  ];

  const mockAnalytics: RoommateAnalytics = {
    totalChores: 24,
    completedChores: 18,
    totalExpenses: 450,
    yourShare: 150
  };

  const [roommates] = useState<Roommate[]>(mockRoommates);
  const [analytics] = useState<RoommateAnalytics>(mockAnalytics);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInviteRoommate = () => {
    if (inviteEmail.trim()) {
      console.log('Inviting:', inviteEmail);
      setInviteEmail('');
      setShowInviteForm(false);
      // In real app, would call API
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">RoomMate Dashboard</h1>
        <button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <span className="text-lg">👥</span>
          <span>Invite Roommate</span>
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Invite Roommate</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="roommate@example.com"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteRoommate}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Chores</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalChores}</p>
            </div>
            <span className="text-2xl">📋</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completedChores}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.totalExpenses}</p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Share</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.yourShare}</p>
            </div>
            <span className="text-2xl">💳</span>
          </div>
        </div>
      </div>

      {/* Roommates List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Current Roommates</h3>
        {roommates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roommates.map((roommate) => (
              <div key={roommate.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{roommate.name}</h4>
                    <p className="text-sm text-gray-600">{roommate.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(roommate.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">👥</span>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No roommates yet</h4>
            <p className="text-gray-600">Invite your roommates to start managing chores and expenses together!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Chore Management</h3>
          <p className="text-gray-600 mb-4">Assign and track household chores with your roommates.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Manage Chores
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Expense Tracking</h3>
          <p className="text-gray-600 mb-4">Split bills and track shared expenses easily.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Track Expenses
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomMate;
