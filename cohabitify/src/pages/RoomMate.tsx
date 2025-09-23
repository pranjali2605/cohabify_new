import React, { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Member { id?: string; _id?: string; username: string; email: string; }
interface Room {
  _id: string;
  name: string;
  code: string;
  owner: Member;
  members: Member[];
  maxSize: number;
  createdAt: string;
}

const RoomMate: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create form
  const [roomName, setRoomName] = useState('My Room');
  const [maxSize, setMaxSize] = useState<number>(5);

  // Join form
  const [joinCode, setJoinCode] = useState('');

  // Owner-only edit state
  const [editName, setEditName] = useState('');
  const [editMaxSize, setEditMaxSize] = useState<number>(5);

  // Initialize edit fields when room loads/changes
  useEffect(() => {
    if (room) {
      setEditName(room.name);
      setEditMaxSize(room.maxSize);
    }
  }, [room]);

  const fetchMyRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/rooms/me');
      setRoom(res.data.room);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRoom();
  }, []);

  const createRoom = async () => {
    setError(null); setSuccess(null);
    try {
      const res = await apiClient.post('/rooms/create', { name: roomName, maxSize });
      setRoom(res.data.room);
      setSuccess('Room created');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create room');
    }
  };

  const joinRoom = async () => {
    setError(null); setSuccess(null);
    try {
      const code = joinCode.trim().toUpperCase();
      const res = await apiClient.post('/rooms/join', { code });
      setRoom(res.data.room);
      setSuccess('Joined room');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to join room');
    }
  };

  const leaveRoom = async () => {
    setError(null); setSuccess(null);
    try {
      await apiClient.post('/rooms/leave');
      setRoom(null);
      setSuccess('Left room');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to leave room');
    }
  };

  const copyCode = async () => {
    if (!room) return;
    try { await navigator.clipboard.writeText(room.code); setSuccess('Code copied'); } catch {}
  };

  // Determine if current user is the owner
  const isOwner = !!(room && user && (
    (room.owner?.id && room.owner.id === user.id) ||
    ((room.owner as any)?._id && (room.owner as any)._id === user.id)
  ));

  // Owner: save updated room settings
  const saveRoomSettings = async () => {
    if (!room) return;
    setError(null); setSuccess(null);
    try {
      const res = await apiClient.put(`/rooms/${room._id}`, {
        name: editName,
        maxSize: editMaxSize,
      });
      setRoom(res.data.room);
      setSuccess('Room updated');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update room');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
        {room && (
          <button onClick={leaveRoom} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Leave Room</button>
        )}
      </div>

      {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
      {success && <div className="p-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>}

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : room ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>
              <p className="text-sm text-gray-600">Owner: {room.owner?.username}</p>
              <p className="text-sm text-gray-600">Members: {room.members.length}/{room.maxSize}</p>
              <p className="text-sm text-gray-600">Created: {new Date(room.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Room Code</p>
              <div className="flex items-center space-x-2 justify-end">
                <span className="text-2xl font-mono tracking-widest">{room.code}</span>
                <button onClick={copyCode} className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">Copy</button>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="mb-6 p-4 border rounded">
              <h4 className="font-medium text-gray-900 mb-3">Owner Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Members</label>
                  <select
                    value={editMaxSize}
                    onChange={(e) => setEditMaxSize(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2,3,4,5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={saveRoomSettings} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {room.members.map(m => (
                <div key={(m.id || m._id) as string} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{m.username}</div>
                    <div className="text-xs text-gray-600">{m.email}</div>
                  </div>
                  {room.owner?.id === m.id || (room.owner as any)?._id === (m as any)?._id ? (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">Owner</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Create a Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name (optional)</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Room"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <select
                  value={maxSize}
                  onChange={(e) => setMaxSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button onClick={createRoom} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Room</button>
            </div>
          </div>

          {/* Join Room */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Join a Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest"
                  placeholder="e.g., ABC123"
                />
              </div>
              <button onClick={joinRoom} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Join Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomMate;
