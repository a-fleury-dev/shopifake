import { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router';
import { Dashboard } from '../components/Dashboard';
import { getShopById } from '../lib/shops/shopService';
import type { Shop } from '../lib/shops/types';
import { useTheme } from '../contexts/ThemeContext';

export function meta() {
  return [
    { title: 'Shop Dashboard - shopifake' },
    { name: 'description', content: 'Manage your online store' },
  ];
}

export default function ShopDashboardRoute() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { theme, setTheme, language } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    role: 'admin' | 'manager';
  } | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('shopifake_user');
    const authTime = localStorage.getItem('shopifake_auth_time');

    if (user && authTime) {
      const authDate = parseInt(authTime);
      const now = Date.now();

      if (now - authDate < 600000) {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
        
        // Find the shop
        const shop = getShopById(shopId!);
        if (shop) {
          setCurrentShop(shop);
        }
      } else {
        localStorage.removeItem('shopifake_user');
        localStorage.removeItem('shopifake_auth_time');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [shopId]);

  const handleLogout = () => {
    localStorage.removeItem('shopifake_user');
    localStorage.removeItem('shopifake_auth_time');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleBackToShops = () => {
    navigate('/shops');
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

  // Redirect to shops if shop not found
  if (!currentShop) {
    return <Navigate to="/shops" replace />;
  }

  return (
    <Dashboard
      language={language}
      theme={theme}
      setTheme={setTheme}
      currentUser={currentUser}
      onLogout={handleLogout}
      currentShop={currentShop}
      onBackToShops={handleBackToShops}
    />
  );
}
