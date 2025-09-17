import React, { useState } from 'react';

interface Secret {
  id: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  likes: number;
  createdAt: string;
  comments: SecretComment[];
}

interface SecretComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}


const SecretCircle: React.FC = () => {
  // Mock data
  const mockSecrets: Secret[] = [
    {
      id: '1',
      content: 'Sometimes I eat the last slice of pizza and pretend I don\'t know who did it 🍕',
      author: 'Anonymous',
      isAnonymous: true,
      likes: 5,
      createdAt: '2024-01-15',
      comments: [
        { id: '1', content: 'We all know it\'s you, Mike! 😂', author: 'Sarah', createdAt: '2024-01-15' }
      ]
    },
    {
      id: '2',
      content: 'I really appreciate how everyone keeps the common areas clean. It makes me happy to come home! ✨',
      author: 'Alex',
      isAnonymous: false,
      likes: 8,
      createdAt: '2024-01-14',
      comments: []
    }
  ];

  const [secrets, setSecrets] = useState<Secret[]>(mockSecrets);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSecret, setNewSecret] = useState({ content: '', isAnonymous: true });

  const handleCreateSecret = () => {
    if (newSecret.content.trim()) {
      const secret: Secret = {
        id: Date.now().toString(),
        content: newSecret.content,
        author: newSecret.isAnonymous ? 'Anonymous' : 'You',
        isAnonymous: newSecret.isAnonymous,
        likes: 0,
        createdAt: new Date().toISOString(),
        comments: []
      };
      setSecrets([secret, ...secrets]);
      setNewSecret({ content: '', isAnonymous: true });
      setShowCreateForm(false);
    }
  };

  const handleToggleLike = (id: string) => {
    setSecrets(secrets.map(secret => 
      secret.id === id 
        ? { ...secret, likes: secret.likes + 1 }
        : secret
    ));
  };

  const handleDeleteSecret = (id: string) => {
    setSecrets(secrets.filter(secret => secret.id !== id));
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

      <div className="space-y-4">
        {secrets.map((secret) => (
          <div key={secret.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">💭</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {secret.isAnonymous ? 'Anonymous' : secret.author}
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
                <span>{secret.comments.length} comments</span>
              </div>
            </div>

            {secret.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  {secret.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">💬</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{comment.author}</span>
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
