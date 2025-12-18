import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <h3 className="text-2xl font-bold">EventPlatform</h3>
            </div>
            <p className="text-gray-400 max-w-md">
              A full-featured event management platform built with MERN stack. 
              Create, discover, and join amazing events with secure authentication 
              and real-time capacity management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors block py-1">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors block py-1">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="text-gray-400 hover:text-white transition-colors block py-1">
                  Create Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Project Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <span>MERN Stack Project</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Full Stack Intern</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Event Management</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} Event Platform. MERN Stack Intern Project.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Built with React, Node.js, Express, MongoDB & Tailwind CSS
              </p>
            </div>
            
            {/* Tech Stack Icons */}
            <div className="flex space-x-4">
              <div className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                React
              </div>
              <div className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                Node.js
              </div>
              <div className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                MongoDB
              </div>
              <div className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                JWT
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;