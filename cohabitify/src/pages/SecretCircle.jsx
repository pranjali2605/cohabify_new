import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import apiClient from '../lib/api';

const SecretCircle = () => {
  const { user, secrets, addSecret, deleteSecret: deleteSecretContext } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch secrets on component mount
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/secrets');
        setError(null);
      } catch (err) {
        console.error('Failed to fetch secrets:', err);
        setError('Failed to load secrets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecrets();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchSecrets, 30000);
    
    return () => clearInterval(interval);
  }, []);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSecret, setNewSecret] = useState({ content: '', isAnonymous: true });

  const handleCreateSecret = async () => {
    if (!newSecret.content.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient.post('/secrets', {
        content: newSecret.content,
        isAnonymous: newSecret.isAnonymous
      });
      
      addSecret(response.data.secret);
      setNewSecret({ content: '', isAnonymous: true });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create secret:', err);
      setError('Failed to post secret. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async (id) => {
    try {
      const response = await apiClient.post(`/secrets/${id}/like`);
      
      // Update local state with the updated secret
      setSecrets(secrets.map(secret => 
        secret._id === id ? response.data.secret : secret
      ));
    } catch (err) {
      console.error('Failed to like secret:', err);
      setError('Failed to like secret. Please try again.');
    }
  };

  const handleDeleteSecret = async (id) => {
    if (!window.confirm('Are you sure you want to delete this secret?')) return;
    
    try {
      await apiClient.delete(`/secrets/${id}`);
      deleteSecretContext(id);
    } catch (err) {
      console.error('Failed to delete secret:', err);
      setError('Failed to delete secret. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SecretCircle</h1>
          <p className="text-gray-600 mt-1">Share your thoughts anonymously with your roommates</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
        >
          <span className="text-lg">💭</span>
          <span>Share Secret</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Share a Secret</h3>
          <div className="space-y-4">
            <textarea
              value={newSecret.content}
              onChange={(e) => setNewSecret({ ...newSecret, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Share your thoughts, feelings, or anything you want to get off your chest..."
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={newSecret.isAnonymous}
                onChange={(e) => setNewSecret({ ...newSecret, isAnonymous: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Post anonymously
              </label>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSecret}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Share Secret
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && secrets.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading secrets...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="space-y-4">
        {secrets.map((secret) => (
          <div key={secret._id || secret.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">💭</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {secret.isAnonymous ? 'Anonymous' : (secret.author?.username || 'You')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(secret.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteSecret(secret.id)}
                className="text-gray-400 hover:text-red-600 text-sm"
              >
                🗑️
              </button>
            </div>

            <p className="text-gray-800 mb-4">{secret.content}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleToggleLike(secret.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
              >
                <span className="text-lg">❤️</span>
                <span>{secret.likes}</span>
              </button>

              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm">💬</span>
                <span>{secret.comments?.length || 0} comments</span>
              </div>
            </div>

            {secret.comments?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  {secret.comments?.map((comment) => (
                    <div key={comment._id || comment.id} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">💬</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.isAnonymous ? 'Anonymous' : (comment.author?.username || 'You')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {secrets.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">💭</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No secrets shared yet</h3>
          <p className="text-gray-600 mb-4">Be the first to share something with your roommates!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Share Your First Secret
          </button>
        </div>
      )}
    </div>
  );
};

export default SecretCircle;
