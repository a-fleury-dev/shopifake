import { useState, useMemo } from 'react';
import { useNavigate, useParams, type MetaFunction } from 'react-router';
import { Search, ShoppingCart, X, Menu } from 'lucide-react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { storefrontTranslations } from '../lib/translations/storefront';
import { VariantCard } from '../components/storefront/VariantCard';
import { CategorySidebar } from '../components/storefront/CategorySidebar';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { 
  mockStorefrontShop, 
  mockCategories, 
  getAllVariantsWithProductInfo 
} from '../lib/mock/storefront-data';
import type { ProductVariant } from '../lib/types/storefront';

export const meta: MetaFunction = () => {
  return [
    { title: `${mockStorefrontShop.name} - Shop` },
    { name: 'description', content: mockStorefrontShop.description || 'Welcome to our shop' },
  ];
};

function StorefrontContent() {
  const navigate = useNavigate();
  const { domainName } = useParams();
  const language = 'en'; // TODO: Add language detection/selection
  const t = storefrontTranslations[language];
  const { cart, removeFromCart } = useCart();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // TODO: Replace with actual API call based on domainName
  const shop = mockStorefrontShop;
  const categories = mockCategories;
  const allVariants = getAllVariantsWithProductInfo();

  const filteredVariants = useMemo(() => {
    const getCategoryWithChildren = (categoryId: number): number[] => {
      const ids = [categoryId];
      const children = categories.filter(cat => cat.parentId === categoryId);
      children.forEach(child => {
        ids.push(...getCategoryWithChildren(child.id));
      });
      return ids;
    };

    let filtered = allVariants.filter(v => v.isActive);

    if (selectedCategoryId !== null) {
      const categoryIds = getCategoryWithChildren(selectedCategoryId);
      filtered = filtered.filter(v => 
        v.categoryId && categoryIds.includes(v.categoryId)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.productName?.toLowerCase().includes(query) ||
        v.sku.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allVariants, selectedCategoryId, searchQuery, categories]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleVariantClick = (variant: ProductVariant) => {
    if (variant.productSlug) {
      navigate(`/${domainName}/products/${variant.productSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      {shop.bannerUrl && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <ImageWithFallback
            src={shop.bannerUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                {shop.name}
              </h1>
              {shop.description && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">
                  {shop.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header with Search and Cart */}
      <div className="sticky top-0 z-40 glass-strong-transparent border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Menu Toggle (mobile) */}
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant="ghost"
              size="icon"
              className="flex-shrink-0 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search (centered) */}
            <div className="flex-1 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.navigation.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-xl ios-surface border-0 text-center"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Cart Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="relative flex-shrink-0 w-12 h-12 rounded-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>{t.cart.title}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{t.cart.empty}</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {cart.items.map((item) => (
                          <div
                            key={item.variant.id}
                            className="flex gap-4 p-4 rounded-xl ios-surface"
                          >
                            <ImageWithFallback
                              src={item.variant.imageUrl || ''}
                              alt={item.variant.productName || ''}
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">
                                {item.variant.productName}
                              </h4>
                              <div className="flex gap-1 mt-1">
                                {item.variant.attributes.map((attr, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-0.5 rounded-full bg-muted"
                                  >
                                    {attr.attributeValue}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-muted-foreground">
                                  {t.product.quantity}: {item.quantity}
                                </span>
                                <span className="font-semibold text-primary">
                                  {formatPrice(item.variant.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.variant.id, t.cart.itemRemoved)}
                              className="flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>{t.cart.subtotal}</span>
                          <span className="text-primary">{formatPrice(cart.total)}</span>
                        </div>
                        <Button className="w-full h-12 text-base" size="lg">
                          {t.cart.checkout}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border/30 sticky top-[73px] h-[calc(100vh-73px)] overflow-hidden glass-strong-transparent">
          <CategorySidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            allCategoriesLabel={t.navigation.allCategories}
            language={language}
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <CategorySidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(id) => {
                setSelectedCategoryId(id);
                setIsSidebarOpen(false);
              }}
              allCategoriesLabel={t.navigation.allCategories}
              language={language}
            />
          </SheetContent>
        </Sheet>

        {/* Products Grid */}
        <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
          {filteredVariants.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold mb-2">{t.search.noResults}</h3>
              <p className="text-muted-foreground">{t.search.tryDifferent}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {filteredVariants.length} {language === 'en' ? 'products' : 'produits'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    onClick={() => handleVariantClick(variant)}
                    language={language}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  return (
    <CartProvider>
      <StorefrontContent />
    </CartProvider>
  );
}
