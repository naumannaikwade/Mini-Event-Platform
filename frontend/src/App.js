import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Event Components
import EventList from './components/events/EventList';
import EventForm from './components/events/EventForm';
import EventDetail from './components/events/EventDetail';

// Import CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          } />
          
          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>
          } />
          
          <Route path="/events" element={
            <Layout>
              <EventList />
            </Layout>
          } />
          
          <Route path="/events/:id" element={
            <Layout>
              <EventDetail />
            </Layout>
          } />

          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/events/create" element={
            <ProtectedRoute>
              <Layout>
                <EventForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/events/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <EventForm edit={true} />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <Layout>
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-8">The page you are looking for doesn't exist.</p>
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Go Home
                </a>
              </div>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;