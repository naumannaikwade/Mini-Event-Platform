import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative text-center py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Events
              </span>
              {' '}Near You
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of people discovering, creating, and attending incredible events.
              From tech conferences to social gatherings, find your next adventure.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              {!user ? (
                <>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    to="/events" 
                    className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-800"
                  >
                    Browse Events
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/events/create" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Create Event
                  </Link>
                  <Link 
                    to="/events" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Browse Events
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-800"
                  >
                    My Dashboard
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 hover:border-blue-200 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-700 mb-3">100+</div>
                <div className="text-xl font-semibold text-gray-900 mb-3">Events Created</div>
                <p className="text-gray-800">
                  Join our growing community of event organizers
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 hover:border-purple-200 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-700 mb-3">1,000+</div>
                <div className="text-xl font-semibold text-gray-900 mb-3">Active Users</div>
                <p className="text-gray-800">
                  Connect with people who share your interests
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 hover:border-emerald-200 transition-all duration-300">
                <div className="text-4xl font-bold text-emerald-700 mb-3">24/7</div>
                <div className="text-xl font-semibold text-gray-900 mb-3">Platform Access</div>
                <p className="text-gray-800">
                  Create and join events anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose EventPlatform?</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Built with cutting-edge technology and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-10 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Events Easily</h3>
              <p className="text-gray-800 text-lg leading-relaxed">
                Simple event creation with image uploads, capacity management, and detailed descriptions.
                Reach your target audience effortlessly with our intuitive interface.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-10 border border-gray-100 transform md:-translate-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart RSVP System</h3>
              <p className="text-gray-800 text-lg leading-relaxed">
                Advanced concurrency handling prevents overbooking with MongoDB transactions.
                Real-time capacity tracking ensures smooth event management.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-10 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Responsive Design</h3>
              <p className="text-gray-800 text-lg leading-relaxed">
                Beautiful, mobile-first interface that works perfectly on all devices.
                Access your events seamlessly on desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Full-stack MERN application with robust architecture
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-4">MongoDB</div>
              <p className="text-gray-300">NoSQL database with transaction support</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-4">Express.js</div>
              <p className="text-gray-300">Robust backend API with JWT authentication</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-400 mb-4">React.js</div>
              <p className="text-gray-300">Modern frontend with responsive design</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-emerald-400 mb-4">Node.js</div>
              <p className="text-gray-300">High-performance JavaScript runtime</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
          <p className="text-2xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who are already creating and attending amazing events.
            No credit card required to start your event management journey.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to={user ? "/events/create" : "/register"} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-5 rounded-2xl text-xl font-semibold transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              {user ? "Create Your First Event" : "Start Free Today"}
              <svg className="w-5 h-5 ml-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
            
            <Link 
              to="/events" 
              className="bg-gray-900 hover:bg-black text-white px-12 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-gray-800"
            >
              Explore Events
              <svg className="w-5 h-5 ml-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">✓ Secure</div>
              <div className="text-gray-700">JWT Authentication</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">✓ Fast</div>
              <div className="text-gray-700">Real-time Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">✓ Scalable</div>
              <div className="text-gray-700">Cloud Database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">✓ Mobile</div>
              <div className="text-gray-700">Responsive Design</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;