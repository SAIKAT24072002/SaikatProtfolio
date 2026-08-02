import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="flex flex-col items-center space-y-4">
          {/* Custom Elegant Spin Loader */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect user to admin login screen, saving the attempted location path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
