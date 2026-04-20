import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';

import GroupsPage from './pages/GroupsPage';
import SettingsPage from './pages/SettingsPage';
import ContentPage from './pages/ContentPage';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<ContentPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
