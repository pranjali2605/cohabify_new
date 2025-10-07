import React from 'react';
import { Link } from 'react-router-dom';

const roles = [
  { title: 'Frontend Engineer', location: 'Remote', type: 'Full-time', icon: '💻', id: 'frontend-engineer' },
  { title: 'Product Designer', location: 'Remote', type: 'Contract', icon: '🎨', id: 'product-designer' },
  { title: 'Community Manager', location: 'Remote', type: 'Part-time', icon: '🌱', id: 'community-manager' },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header like dashboard */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Open Roles</h1>
          <span className="text-sm text-gray-600">Join our remote-first team</span>
        </div>

        {/* Summary cards similar to dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Work Type</p>
                <p className="text-2xl font-bold text-gray-900">Remote</p>
              </div>
              <span className="text-3xl">🌍</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">3–5 days</p>
              </div>
              <span className="text-3xl">⏱️</span>
            </div>
          </div>
        </div>

        {/* Roles list styled like dashboard cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Current openings</h2>
          <div className="space-y-4">
            {roles.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">{r.icon}</div>
                  <div>
                    <p className="font-medium text-gray-900">{r.title}</p>
                    <p className="text-sm text-gray-600">{r.location} • {r.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/careers/apply/${r.id}`}
                    className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">Don’t see a fit? Email us at <a className="text-blue-600 hover:text-blue-700" href="mailto:careers@cohabify.app">careers@cohabify.app</a></p>
      </div>
    </div>
  );
};

export default Careers;
