import { useState, useEffect, useRef } from 'react';
import { CMSModule } from './CMSModule';
import { SettingsModule } from './SettingsModule';
import { CategoriesView, ProductsView, VariantsView, StockView } from './dashboard/backoffice';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import {
  DashboardHome,
  SalesView,
  StockView as AuditStockView,
} from './dashboard/audit';
import type { DashboardProps, CategoryType } from './dashboard/types';
import { translations } from '../lib/translations';

// Auto logout after 10 minutes of inactivity
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

export function Dashboard({ 
  language, 
  theme, 
  setTheme, 
  currentUser, 
  onLogout, 
  currentShop,
  onBackToShops 
}: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('audit');
  const [activeTab, setActiveTab] = useState('audit-sales');

  // Inactivity timer for auto-logout
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    lastActivityRef.current = Date.now();

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      onLogout();
    }, INACTIVITY_TIMEOUT);
  };

  // Setup activity listeners
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dt = translations[language].dashboard;

  // Handle category change
  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    // Set default tab for each category
    switch (category) {
      case 'audit':
        setActiveTab('audit-sales');
        break;
      case 'cms':
        setActiveTab('cms-pages');
        break;
      case 'backoffice':
        setActiveTab('backoffice-categories');
        break;
      case 'settings':
        setActiveTab('settings-store');
        break;
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    // Audit category views
    if (activeTab === 'audit-sales') {
      return <SalesView language={language} translations={dt} />;
    }
    if (activeTab === 'audit-stock') {
      return <AuditStockView language={language} translations={dt} />;
    }

    // CMS category views
    if (activeTab.startsWith('cms-')) {
      const sectionName = activeTab.replace('cms-', '') as
        | 'pages'
        | 'blog'
        | 'media'
        | 'menus'
        | 'blocks'
        | 'templates'
        | 'collections';
      return (
        <CMSModule language={language} currentUser={currentUser} initialSection={sectionName} />
      );
    }

    // Back-office category views
    if (activeTab.startsWith('backoffice-')) {
      const sectionName = activeTab.replace('backoffice-', '');

      if (sectionName === 'categories') {
        return <CategoriesView language={language} currentUser={currentUser} />;
      }
      if (sectionName === 'products') {
        return <ProductsView language={language} currentUser={currentUser} />;
      }
      if (sectionName === 'variants') {
        return <VariantsView language={language} currentUser={currentUser} />;
      }
      if (sectionName === 'stock') {
        return <StockView language={language} currentUser={currentUser} />;
      }
    }

    // Settings category views
    if (activeTab.startsWith('settings-')) {
      const sectionName = activeTab.replace('settings-', '') as
        | 'store'
        | 'domains';
      return <SettingsModule language={language} initialSection={sectionName} />;
    }

    // Default view
    return <DashboardHome language={language} translations={dt} />;
  };

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-xl relative">
      {/* Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <DashboardSidebar
          language={language}
          theme={theme}
          setTheme={setTheme}
          currentUser={currentUser}
          activeCategory={activeCategory}
          activeTab={activeTab}
          onCategoryChange={handleCategoryChange}
          onTabChange={setActiveTab}
          onLogout={onLogout}
          translations={dt}
          currentShop={currentShop}
          onBackToShops={onBackToShops}
        />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
