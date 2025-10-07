import React from 'react';

const Blog = () => {
  const posts = [
    { title: 'Building Better Habits with Roommates', excerpt: 'Tips to form sustainable habits together and keep each other accountable.', tag: 'Habits' },
    { title: 'Setting Up a Chore System That Sticks', excerpt: 'A simple, fair approach to split chores without stress.', tag: 'RoomMate' },
    { title: 'Emotional Check-ins: Why They Matter', excerpt: 'How sharing feelings safely can improve your home dynamic.', tag: 'Well-being' },
  ];
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition">
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 mb-3">{p.tag}</span>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{p.title}</h2>
              <p className="text-sm text-gray-600">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
