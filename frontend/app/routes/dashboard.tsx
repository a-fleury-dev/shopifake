import type { Route } from './+types/dashboard';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { Dashboard } from '../components/Dashboard';
import { useTheme } from '../contexts/ThemeContext';
import type {User} from "../lib/types/auth";
import {useAuth} from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - shopifake' },
    { name: 'description', content: 'Manage your online store' },
  ];
}

export default function DashboardRoute() {
  const { theme, setTheme, language } = useTheme();
  const { user, logout } = useAuth();

  // Check authentication on mount
  useEffect(() => {

    if (!user) {
        window.location.href = '/auth';
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Show loading state while checking auth
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Dashboard
      language={language}
      theme={theme}
      setTheme={setTheme}
      currentUser={user}
      onLogout={handleLogout}
    />
  );
}
