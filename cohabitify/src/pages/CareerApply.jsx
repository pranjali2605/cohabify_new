import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const roleCatalog = [
  { id: 'frontend-engineer', title: 'Frontend Engineer' },
  { id: 'product-designer', title: 'Product Designer' },
  { id: 'community-manager', title: 'Community Manager' },
];

const CareerApply = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const role = useMemo(() => roleCatalog.find(r => r.id === roleId), [roleId]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    links: '', // portfolio / github / linkedin
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Simulate submission; in real app, call backend API here
    setSubmitted(true);
    // Optionally navigate back to careers after a delay
    // setTimeout(() => navigate('/careers'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:text-blue-700 mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply{role ? `: ${role.title}` : ''}</h1>
        <p className="text-gray-600 mb-8">Fill out the form and well get back to you within 32 business days.</p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
            <p className="font-semibold">Application submitted!</p>
            <p className="text-sm">Thanks for applying. Well review your profile and reach out shortly.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">Location</label>
                <input id="location" name="location" value={form.location} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="links">Links</label>
              <input id="links" name="links" placeholder="Portfolio / GitHub / LinkedIn" value={form.links} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Submit Application</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CareerApply;
