import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [delivered, setDelivered] = useState(null); // null | boolean
  const [validationErrors, setValidationErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);
    // Client-side validation to avoid 400 from backend
    const errs = [];
    const name = (formData.name || '').trim();
    const email = (formData.email || '').trim();
    const subject = (formData.subject || '').trim();
    const message = (formData.message || '').trim();
    if (name.length < 2) errs.push('Full Name must be at least 2 characters.');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) errs.push('Please enter a valid email address.');
    if (message.length < 5) errs.push('Message must be at least 5 characters.');
    if (subject.length > 150) errs.push('Subject cannot exceed 150 characters.');
    if (errs.length > 0) {
      setValidationErrors(errs);
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/support/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      let data = null;
      try {
        data = await res.json();
      } catch (_) {}
      if (!res.ok) throw new Error(data?.message || 'Failed to send');
      setDelivered(data?.delivered !== false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cohabify</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link to="/#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
              <Link to="/#faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
              <Link to="/contact" className="text-blue-600 font-medium">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about Cohabify? Need help getting started? We're here to help you create better living experiences.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600 mb-2">Get help with your account, billing, or technical issues</p>
                    <a href="mailto:harshita.g.2k@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                      harshita.g.2k@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-gray-600 mb-2">Chat with our support team in real-time</p>
                    <p className="text-sm text-gray-500">Available Mon-Fri, 9AM-6PM PST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-gray-600 mb-2">Speak directly with our support team</p>
                    <p className="text-blue-600 font-medium">+91 9988321773</p>
                    <p className="text-sm text-gray-500">Available Mon-Fri, 9AM-6PM PST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Location</h3>
                    <p className="text-gray-600">
                      Chitkara University<br />
                      Rajpura, Patiala<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-sm font-bold">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-sm font-bold">t</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-sm font-bold">in</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-sm font-bold">ig</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-green-600 text-xl mr-3">✅</span>
                    <div>
                      <h3 className="font-semibold text-green-800">Message Sent!</h3>
                      <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                      {delivered === false && (
                        <p className="text-yellow-700 text-xs mt-2">
                          Note: Email delivery is pending. We've received your message and will follow up shortly.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-600 text-xl mr-3">❌</span>
                    <div>
                      <h3 className="font-semibold text-red-800">Error Sending Message</h3>
                      {validationErrors.length > 0 ? (
                        <ul className="text-red-700 text-sm list-disc ml-5">
                          {validationErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>


              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-gray-600 mb-8">
            Check out our frequently asked questions for instant help
          </p>
          <Link 
            to="/#faq" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            View FAQ →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">Cohabify</span>
              </div>
              <p className="text-gray-400">
                Building better habits and harmonious homes, one household at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/#features" className="hover:text-white">Features</Link></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cohabify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
