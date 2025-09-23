import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cohabify</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Discover the new way to live better together
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Unified Platform for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Habits, Harmony & Home
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cohabify combines habit tracking, roommate coordination, and anonymous emotional 
            expression into one powerful app. Simplify shared living, boost productivity, and foster 
            harmony in your home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center"
            >
              Get Started Now →
            </Link>
            <button className="text-gray-600 hover:text-gray-900 px-8 py-4 font-semibold text-lg">
              Learn more →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for better living
            </h2>
            <p className="text-xl text-gray-600">
              Four powerful tools in one seamless platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Habit Tracker</h3>
              <p className="text-gray-600">
                Build and maintain healthy habits with streak tracking and progress analytics.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">RoomMate</h3>
              <p className="text-gray-600">
                Coordinate chores, split expenses, and manage household tasks effortlessly.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">💭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">SecretCircle</h3>
              <p className="text-gray-600">
                Share thoughts anonymously with roommates in a safe, supportive environment.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🌈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">MoodMirror</h3>
              <p className="text-gray-600">
                Track your daily emotions and mental well-being with insights and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why choose Cohabify?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl mt-1">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">All-in-One Solution</h3>
                    <p className="text-gray-600">No need for multiple apps - everything you need in one place.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl mt-1">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Privacy First</h3>
                    <p className="text-gray-600">Your data is secure with end-to-end encryption and anonymous options.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl mt-1">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Sync</h3>
                    <p className="text-gray-600">Stay updated with roommates instantly across all devices.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl mt-1">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics & Insights</h3>
                    <p className="text-gray-600">Track progress and get insights to improve your living experience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of users who have transformed their living experience with Cohabify.
                </p>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold inline-flex items-center"
                >
                  Start Free Trial →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What our users are saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who transformed their living experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "Cohabify completely changed how my roommates and I manage our apartment. The habit tracker keeps us all accountable, and the anonymous sharing feature helped us address issues we were too shy to bring up before."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">SM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Martinez</h4>
                  <p className="text-gray-600 text-sm">College Student, Austin</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "As someone who struggled with maintaining routines, the habit tracker in Cohabify has been a game-changer. The mood tracking feature also helps me understand my patterns better. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Johnson</h4>
                  <p className="text-gray-600 text-sm">Software Engineer, Seattle</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "Living with three other people used to be chaotic. Cohabify's roommate management tools made everything so much easier - from splitting bills to coordinating chores. We're all happier now!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">AL</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Alex Lee</h4>
                  <p className="text-gray-600 text-sm">Graduate Student, Boston</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
              <span className="text-blue-600 font-semibold">4.9/5</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">Based on 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Cohabify
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does Cohabify work?
              </h3>
              <p className="text-gray-600">
                Cohabify is an all-in-one platform that combines four essential tools: Habit Tracker for personal growth, RoomMate for household management, SecretCircle for anonymous communication, and MoodMirror for emotional well-being. Simply create an account, invite your roommates, and start using the features that matter most to you.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my data secure and private?
              </h3>
              <p className="text-gray-600">
                Absolutely! We use end-to-end encryption for all sensitive data. Your personal habits, mood tracking, and anonymous posts in SecretCircle are completely private. We never sell your data to third parties, and you have full control over what you share with your roommates.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I use Cohabify if I live alone?
              </h3>
              <p className="text-gray-600">
                Yes! While Cohabify is designed for shared living, many features like Habit Tracker and MoodMirror work perfectly for individual use. You can always invite roommates later or use it to prepare for future shared living situations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How much does Cohabify cost?
              </h3>
              <p className="text-gray-600">
                Cohabify offers a free tier with basic features for up to 3 roommates. Our Premium plan ($9.99/month per household) includes unlimited roommates, advanced analytics, custom habit categories, and priority support. We also offer a 30-day free trial of Premium features.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if my roommates don't want to use the app?
              </h3>
              <p className="text-gray-600">
                You can still benefit from personal features like habit tracking and mood monitoring. For household features, we recommend starting small - perhaps just expense splitting or chore coordination. Many users find that once roommates see the benefits, they naturally want to participate more.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a mobile app?
              </h3>
              <p className="text-gray-600">
                Cohabify is currently available as a responsive web application that works great on all devices. Native iOS and Android apps are in development and will be available in Q2 2024. You can add our web app to your home screen for a native-like experience.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I get started?
              </h3>
              <p className="text-gray-600">
                Getting started is easy! Click "Get Started" to create your free account, set up your profile, and start exploring the features. You can invite roommates anytime by sharing a simple invite link. Our onboarding guide will walk you through each feature step by step.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a href="mailto:support@cohabify.com" className="text-blue-600 hover:text-blue-700 font-semibold">
              Contact our support team →
            </a>
          </div>
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
                <li><a href="#" className="hover:text-white">Features</a></li>
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
                <li><a href="#" className="hover:text-white">Contact</a></li>
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

export default LandingPage;
