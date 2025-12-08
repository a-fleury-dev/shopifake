import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Plus, Store as StoreIcon, Shield, Eye, Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { fetchShopsByAdminId } from '../clients/shopApiClient';
import type { ShopDTO } from '../lib/shops/dto';
import { translations } from '../lib/translations';
import { ShopsHeader } from '../components/shops/ShopsHeader';
import { useTheme } from '../contexts/ThemeContext';
import {useAuth} from "../contexts/AuthContext";

export function meta() {
  return [
    { title: 'My Shops - shopifake' },
    { name: 'description', content: 'Manage your online stores' },
  ];
}

export default function ShopsRoute() {
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage } = useTheme();
  const { user, tokens, logout, isLoading: authLoading, getUserData } = useAuth();
  const [shops, setShops] = useState<ShopDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and fetch shops on mount
  useEffect(() => {
    const loadShops = async () => {
      // Wait for auth context to load from localStorage
      if (authLoading) {
        return;
      }

      // If not authenticated, don't try to load shops
      if (!tokens) {
        setIsLoading(false);
        return;
      }

      // If we have tokens but no user, fetch user data
      if (!user) {
        try {
          await getUserData();
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          setError('Failed to load user data');
          setIsLoading(false);
          return;
        }
      }

      // Now we should have user data
      if (user?.id) {
        try {
          setIsLoading(true);
          const fetchedShops = await fetchShopsByAdminId(user.id);
          setShops(fetchedShops);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch shops:', err);
          setError(err instanceof Error ? err.message : 'Failed to load shops');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No admin ID found');
        setIsLoading(false);
      }
    };

    loadShops();
  }, [tokens, user, authLoading, getUserData]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shops...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!tokens) {
    return <Navigate to="/auth" replace />;
  }

  const t = translations[language].shops.myShops;

  // Show error state if fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-background/95 backdrop-blur-xl relative">
        <ShopsHeader 
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
        />
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
          <Card className="liquid-card p-12 text-center border-red-400/30">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-foreground mb-2">Failed to load shops</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="liquid-button"
            >
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-xl relative">
      <ShopsHeader 
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />
      
      {/* Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-foreground mb-2">{t.title}</h1>
              <p className="text-muted-foreground text-lg md:text-xl">{t.subtitle}</p>
            </div>
            <Button
              onClick={() => navigate('/shops/new')}
              className="liquid-button px-6 py-3 gap-2 self-start md:self-auto"
            >
              <Plus className="w-5 h-5" />
              {t.addShop}
            </Button>
          </div>
          
          <div className="ios-surface inline-flex items-center gap-2 px-4 py-2 rounded-lg">
            <StoreIcon className="w-5 h-5 text-primary" />
            <span className="text-foreground">
              {shops.length} {shops.length === 1 ? t.shopCount : t.shopCountPlural}
            </span>
          </div>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <Card className="liquid-card p-12 text-center">
            <StoreIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground mb-2">{t.noShops}</h3>
            <p className="text-muted-foreground mb-6">{t.noShopsDesc}</p>
            <Button onClick={() => navigate('/shops/new')} className="liquid-button">
              <Plus className="w-5 h-5 mr-2" />
              {t.addShop}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => {
              return (
                <Card
                  key={shop.id}
                  className="liquid-card overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/shops/${shop.id}/dashboard`)}
                >
                  {/* Banner Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={shop.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    
                    {/* Admin Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="default"
                        className="ios-surface flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {t.roleAdmin || 'Admin'}
                      </Badge>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    <h3 className="text-foreground mb-2 group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {shop.domainName}.shopifake.com
                    </p>

                    {shop.description && (
                      <p className="text-sm text-muted-foreground-enhanced mb-4 line-clamp-2">
                        {shop.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Created' : 'Créé le'}{' '}
                        {new Date(shop.createdAt).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'fr-FR'
                        )}
                      </div>
                      <div className="text-sm text-primary group-hover:translate-x-1 transition-transform">
                        {t.clickToManage} →
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
