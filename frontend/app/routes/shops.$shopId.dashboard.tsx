import { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router';
import { Dashboard } from '../components/Dashboard';
import { fetchShopById } from '../clients/shopApiClient';
import type { ShopDTO } from '../lib/shops/dto';
import type { Shop } from '../lib/shops/types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../lib/hooks/useAuth';

// Transform ShopDTO to Shop format expected by Dashboard
function transformShopDTOToShop(dto: ShopDTO): Shop {
  return {
    id: dto.id.toString(),
    name: dto.name,
    domain: dto.domainName,
    banner: dto.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    description: dto.description || undefined,
    createdAt: dto.createdAt.split('T')[0],
    userRole: 'admin', // Always admin for now (temporary)
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      language: 'en',
    },
  };
}

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
  const { isAuthenticated: checkAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    role: 'admin' | 'manager';
  } | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and fetch shop on mount
  useEffect(() => {
    const loadShop = async () => {
      const user = localStorage.getItem('shopifake_user');
      const authTime = localStorage.getItem('shopifake_auth_time');

      if (user && authTime) {
        const authDate = parseInt(authTime);
        const now = Date.now();

        if (now - authDate < 600000) {
          setCurrentUser(JSON.parse(user));
          setIsAuthenticated(true);
          
          // Fetch the shop from API
          if (shopId) {
            try {
              setIsLoading(true);
              const shopDTO = await fetchShopById(parseInt(shopId, 10));
              const shop = transformShopDTOToShop(shopDTO);
              setCurrentShop(shop);
            } catch (err) {
              console.error('Failed to fetch shop:', err);
              setError(err instanceof Error ? err.message : 'Failed to load shop');
            } finally {
              setIsLoading(false);
            }
          }
        } else {
          localStorage.removeItem('shopifake_user');
          localStorage.removeItem('shopifake_auth_time');
          localStorage.removeItem('shopifake_temp_admin_id');
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    loadShop();
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

  // Show loading state while checking auth or fetching shop
  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shop...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/shops')}
            className="text-primary hover:underline"
          >
            Back to Shops
          </button>
        </div>
      </div>
    );
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
