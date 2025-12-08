import { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router';
import { Dashboard } from '../components/Dashboard';
import { fetchShopById } from '../clients/shopApiClient';
import type { ShopDTO } from '../lib/shops/dto';
import type { Shop } from '../lib/shops/types';
import { useTheme } from '../contexts/ThemeContext';
import {useAuth} from "../contexts/AuthContext";

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
  const { user, logout } = useAuth();
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and fetch shop on mount
  useEffect(() => {
    const loadShop = async () => {

      if (user) {
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
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadShop();
  }, [shopId]);

  const handleLogout = async () => {
      await logout()
      window.location.href = '/';
  };

  const handleBackToShops = () => {
    navigate('/shops');
  };

  // Show loading state while checking auth or fetching shop
  if (isLoading) {
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
  if (!user) {
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
      currentUser={user}
      onLogout={handleLogout}
      currentShop={currentShop}
      onBackToShops={handleBackToShops}
    />
  );
}
