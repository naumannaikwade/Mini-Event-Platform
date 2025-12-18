import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading</h3>
          <p className="text-gray-600">Please wait while we verify your session...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Save the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If route requires no authentication but user is logged in (like login/register pages)
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the children
  return children;
};

// Higher Order Component for protected routes
export const withProtectedRoute = (Component, requireAuth = true) => {
  return function WithProtectedRoute(props) {
    return (
      <ProtectedRoute requireAuth={requireAuth}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export default ProtectedRoute;