import { DashboardLogo } from './DashboardLogo';
import { SidebarItem } from './SidebarItem';
import { UserFooter } from './UserFooter';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import {
  DollarSign,
  Package,
  MessageCircle,
  TestTube,
  Clock,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Menu as MenuIcon,
  Layout,
  Grid3x3,
  Tags,
  Store,
  Globe,
  CreditCard,
  Truck,
  Bell,
  BarChart3,
  ShoppingBag,
  FileEdit,
  Settings as SettingsIcon,
} from 'lucide-react';
import type { CategoryType } from './types';

interface DashboardSidebarProps {
  language: 'en' | 'fr';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentUser: {
    name: string;
    email: string;
    role: 'admin' | 'manager';
  };
  activeCategory: CategoryType;
  activeTab: string;
  onCategoryChange: (category: CategoryType) => void;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  translations: any;
}

export function DashboardSidebar({
  language,
  theme,
  setTheme,
  currentUser,
  activeCategory,
  activeTab,
  onCategoryChange,
  onTabChange,
  onLogout,
  translations,
}: DashboardSidebarProps) {
  const dt = translations;

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'audit':
        return BarChart3;
      case 'backoffice':
        return ShoppingBag;
      case 'cms':
        return FileEdit;
      case 'settings':
        return SettingsIcon;
    }
  };

  const getCategoryLabel = (category: CategoryType) => {
    switch (category) {
      case 'audit':
        return dt.sidebar.audit;
      case 'backoffice':
        return dt.sidebar.backoffice;
      case 'cms':
        return dt.sidebar.cms;
      case 'settings':
        return dt.sidebar.settings;
    }
  };

  const CategoryIcon = getCategoryIcon(activeCategory);

  return (
    <div className="w-80 h-screen sticky top-0 flex flex-col p-6 glass-strong-transparent bg-transparent border-r border-border/30">
      <DashboardLogo />

      {/* Category Selector */}
      <div className="mb-6">
        <Select
          value={activeCategory}
          onValueChange={(value) => onCategoryChange(value as CategoryType)}
        >
          <SelectTrigger className="w-full ios-surface border-0 rounded-2xl h-14 text-left font-semibold">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-primary" />
              </div>
              <span>{getCategoryLabel(activeCategory)}</span>
            </div>
          </SelectTrigger>
          <SelectContent className="w-[280px]">
            <SelectItem value="audit" className="text-left py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{dt.sidebar.audit}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Analytics & Reports' : 'Analyses & Rapports'}
                  </div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="backoffice" className="text-left py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{dt.sidebar.backoffice}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Products & Inventory' : 'Produits & Inventaire'}
                  </div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="cms" className="text-left py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileEdit className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{dt.sidebar.cms}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Content Management' : 'Gestion de Contenu'}
                  </div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="settings" className="text-left py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{dt.sidebar.settings}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Store Configuration' : 'Configuration Boutique'}
                  </div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <nav className="flex-1 space-y-2 bg-transparent">
        {/* Audit Category */}
        {activeCategory === 'audit' && (
          <>
            <SidebarItem
              id="audit-sales"
              icon={DollarSign}
              label={dt.sidebar.sales}
              isActive={activeTab === 'audit-sales'}
              onClick={() => onTabChange('audit-sales')}
            />
            <SidebarItem
              id="audit-stock"
              icon={Package}
              label={dt.sidebar.stock}
              isActive={activeTab === 'audit-stock'}
              onClick={() => onTabChange('audit-stock')}
            />
            <SidebarItem
              id="audit-chatbot"
              icon={MessageCircle}
              label={dt.sidebar.chatbot}
              isActive={activeTab === 'audit-chatbot'}
              onClick={() => onTabChange('audit-chatbot')}
            />
            <SidebarItem
              id="audit-ab-testing"
              icon={TestTube}
              label={dt.sidebar.abTesting}
              isActive={activeTab === 'audit-ab-testing'}
              onClick={() => onTabChange('audit-ab-testing')}
            />
            <SidebarItem
              id="audit-history"
              icon={Clock}
              label={dt.sidebar.history}
              isActive={activeTab === 'audit-history'}
              onClick={() => onTabChange('audit-history')}
            />
          </>
        )}

        {/* CMS Category */}
        {activeCategory === 'cms' && (
          <>
            <SidebarItem
              id="cms-pages"
              icon={FileText}
              label={dt.sidebar.pages}
              isActive={activeTab === 'cms-pages'}
              onClick={() => onTabChange('cms-pages')}
            />
            <SidebarItem
              id="cms-blog"
              icon={BookOpen}
              label={dt.sidebar.blog}
              isActive={activeTab === 'cms-blog'}
              onClick={() => onTabChange('cms-blog')}
            />
            <SidebarItem
              id="cms-media"
              icon={ImageIcon}
              label={dt.sidebar.media}
              isActive={activeTab === 'cms-media'}
              onClick={() => onTabChange('cms-media')}
            />
            <SidebarItem
              id="cms-menus"
              icon={MenuIcon}
              label={dt.sidebar.menus}
              isActive={activeTab === 'cms-menus'}
              onClick={() => onTabChange('cms-menus')}
            />
            <SidebarItem
              id="cms-blocks"
              icon={Layout}
              label={dt.sidebar.blocks}
              isActive={activeTab === 'cms-blocks'}
              onClick={() => onTabChange('cms-blocks')}
            />
            <SidebarItem
              id="cms-templates"
              icon={Grid3x3}
              label={dt.sidebar.templates}
              isActive={activeTab === 'cms-templates'}
              onClick={() => onTabChange('cms-templates')}
            />
            <SidebarItem
              id="cms-collections"
              icon={Tags}
              label={dt.sidebar.collections}
              isActive={activeTab === 'cms-collections'}
              onClick={() => onTabChange('cms-collections')}
            />
          </>
        )}

        {/* Back-office Category */}
        {activeCategory === 'backoffice' && (
          <>
            <SidebarItem
              id="backoffice-categories"
              icon={Tags}
              label={dt.sidebar.categories}
              isActive={activeTab === 'backoffice-categories'}
              onClick={() => onTabChange('backoffice-categories')}
            />
            <SidebarItem
              id="backoffice-products"
              icon={Package}
              label={dt.sidebar.productsVariants}
              isActive={activeTab === 'backoffice-products'}
              onClick={() => onTabChange('backoffice-products')}
            />
            <SidebarItem
              id="backoffice-stock"
              icon={Package}
              label={dt.sidebar.stockManagement}
              isActive={activeTab === 'backoffice-stock'}
              onClick={() => onTabChange('backoffice-stock')}
            />
          </>
        )}

        {/* Settings Category */}
        {activeCategory === 'settings' && (
          <>
            <SidebarItem
              id="settings-store"
              icon={Store}
              label={dt.sidebar.storeInfo}
              isActive={activeTab === 'settings-store'}
              onClick={() => onTabChange('settings-store')}
            />
            <SidebarItem
              id="settings-domains"
              icon={Globe}
              label={dt.sidebar.domains}
              isActive={activeTab === 'settings-domains'}
              onClick={() => onTabChange('settings-domains')}
            />
            <SidebarItem
              id="settings-payment"
              icon={CreditCard}
              label={dt.sidebar.paymentSettings}
              isActive={activeTab === 'settings-payment'}
              onClick={() => onTabChange('settings-payment')}
            />
            <SidebarItem
              id="settings-shipping"
              icon={Truck}
              label={dt.sidebar.shippingSettings}
              isActive={activeTab === 'settings-shipping'}
              onClick={() => onTabChange('settings-shipping')}
            />
            <SidebarItem
              id="settings-notifications"
              icon={Bell}
              label={dt.sidebar.notificationSettings}
              isActive={activeTab === 'settings-notifications'}
              onClick={() => onTabChange('settings-notifications')}
            />
          </>
        )}
      </nav>

      <UserFooter currentUser={currentUser} theme={theme} setTheme={setTheme} onLogout={onLogout} />
    </div>
  );
}
