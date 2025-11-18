import type { Route } from './+types/dashboard';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { Dashboard } from '../components/Dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - shopifake' },
    { name: 'description', content: 'Manage your online store' },
  ];
}

export default function DashboardRoute() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // Initialize theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('shopifake_theme');
    return (savedTheme as 'dark' | 'light') || 'dark';
  });
  const [language, _setLanguage] = useState<'en' | 'fr'>(() => {
    // Initialize language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('shopifake_language');
    return (savedLanguage as 'en' | 'fr') || 'en';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    role: 'admin' | 'manager';
  } | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('shopifake_user');
    const authTime = localStorage.getItem('shopifake_auth_time');

    if (user && authTime) {
      // Check if auth is still valid (10 minutes = 600000 ms)
      const authDate = parseInt(authTime);
      const now = Date.now();

      if (now - authDate < 600000) {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
      } else {
        // Auth expired
        localStorage.removeItem('shopifake_user');
        localStorage.removeItem('shopifake_auth_time');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('shopifake_theme', theme);
  }, [theme]);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('shopifake_language', language);
  }, [language]);

  const handleLogout = () => {
    localStorage.removeItem('shopifake_user');
    localStorage.removeItem('shopifake_auth_time');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
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
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Dashboard
      language={language}
      theme={theme}
      setTheme={setTheme}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}
