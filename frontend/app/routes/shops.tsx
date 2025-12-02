import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Plus, Store as StoreIcon, Shield, Eye, Settings as SettingsIcon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getAllShops } from '../lib/shops/shopService';
import type { Shop, ShopRole } from '../lib/shops/types';
import { translations } from '../lib/translations';
import { ShopsHeader } from '../components/shops/ShopsHeader';
import { useTheme } from '../contexts/ThemeContext';

export function meta() {
  return [
    { title: 'My Shops - shopifake' },
    { name: 'description', content: 'Manage your online stores' },
  ];
}

function getRoleIcon(role: ShopRole) {
  switch (role) {
    case 'admin':
      return Shield;
    case 'manager':
      return SettingsIcon;
    case 'reader':
      return Eye;
  }
}

function getRoleBadgeVariant(role: ShopRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'admin':
      return 'default';
    case 'manager':
      return 'secondary';
    case 'reader':
      return 'outline';
  }
}

export default function ShopsRoute() {
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('shopifake_user');
    const authTime = localStorage.getItem('shopifake_auth_time');

    if (user && authTime) {
      const authDate = parseInt(authTime);
      const now = Date.now();

      if (now - authDate < 600000) {
        setIsAuthenticated(true);
        setShops(getAllShops());
      } else {
        localStorage.removeItem('shopifake_user');
        localStorage.removeItem('shopifake_auth_time');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const t = translations[language].shops.myShops;

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
              const RoleIcon = getRoleIcon(shop.userRole);
              const roleKey = `role${shop.userRole.charAt(0).toUpperCase() + shop.userRole.slice(1)}` as keyof typeof t;
              const roleText = t[roleKey];
              
              return (
                <Card
                  key={shop.id}
                  className="liquid-card overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/shops/${shop.id}/dashboard`)}
                >
                  {/* Banner Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={shop.banner}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    
                    {/* Role Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={getRoleBadgeVariant(shop.userRole)}
                        className="ios-surface flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <RoleIcon className="w-3.5 h-3.5" />
                        {roleText}
                      </Badge>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    <h3 className="text-foreground mb-2 group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {shop.domain}.shopifake.com
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
