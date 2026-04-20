import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col text-white antialiased">
      <Navbar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
