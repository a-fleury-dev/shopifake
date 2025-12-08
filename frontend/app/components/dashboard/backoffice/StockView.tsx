import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Plus,
  Minus,
  Search,
  Package,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
} from 'lucide-react';
import {
  fetchProductsByShop,
  fetchVariantsByProduct,
  performStockAction,
} from '../../../clients/storefrontApiClient';
import type { ProductDTO, ProductVariantDTO } from '../../../lib/storefront/dto';

interface StockViewProps {
  language: 'en' | 'fr';
  currentUser: any;
  shopId?: number;
}

export function StockView({ language, shopId }: StockViewProps) {
  // Data state
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [variants, setVariants] = useState<ProductVariantDTO[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Stock action form
  const [quantity, setQuantity] = useState('');

  // Translations
  const t = {
    en: {
      title: 'Stock Management',
      selectProduct: 'Select a product',
      selectVariant: 'Select a variant',
      noProductSelected: 'No product selected',
      noVariantSelected: 'No variant selected',
      selectProductHint: 'Please select a product from the list to view its variants',
      selectVariantHint: 'Please select a variant to manage its stock',
      products: 'Products',
      variants: 'Variants',
      stockManagement: 'Stock Management',
      noVariants: 'No variants',
      search: 'Search products...',
      currentStock: 'Current Stock',
      quantity: 'Quantity',
      quantityPlaceholder: 'Enter quantity',
      addStock: 'Add Stock',
      removeStock: 'Remove Stock',
      sku: 'SKU',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      attributes: 'Attributes',
      loading: 'Loading...',
      processing: 'Processing...',
      error: 'Error',
      success: 'Stock updated successfully',
      actionAdded: 'units added',
      actionRemoved: 'units removed',
      required: 'Required',
      mustBePositive: 'Quantity must be positive',
    },
    fr: {
      title: 'Gestion du Stock',
      selectProduct: 'Sélectionner un produit',
      selectVariant: 'Sélectionner un variant',
      noProductSelected: 'Aucun produit sélectionné',
      noVariantSelected: 'Aucun variant sélectionné',
      selectProductHint: 'Veuillez sélectionner un produit dans la liste pour voir ses variants',
      selectVariantHint: 'Veuillez sélectionner un variant pour gérer son stock',
      products: 'Produits',
      variants: 'Variants',
      stockManagement: 'Gestion du Stock',
      noVariants: 'Aucun variant',
      search: 'Rechercher des produits...',
      currentStock: 'Stock Actuel',
      quantity: 'Quantité',
      quantityPlaceholder: 'Entrer la quantité',
      addStock: 'Ajouter du Stock',
      removeStock: 'Retirer du Stock',
      sku: 'SKU',
      price: 'Prix',
      stock: 'Stock',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      attributes: 'Attributs',
      loading: 'Chargement...',
      processing: 'Traitement...',
      error: 'Erreur',
      success: 'Stock mis à jour avec succès',
      actionAdded: 'unités ajoutées',
      actionRemoved: 'unités retirées',
      required: 'Requis',
      mustBePositive: 'La quantité doit être positive',
    },
  };

  const translations = t[language];

  // Load products on mount
  useEffect(() => {
    if (shopId) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  // Load variants when product is selected
  useEffect(() => {
    if (shopId && selectedProductId) {
      loadVariants(selectedProductId);
    } else {
      setVariants([]);
      setSelectedVariant(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, selectedProductId]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => {
        setActionSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  const loadProducts = async () => {
    if (!shopId) return;

    setIsLoadingProducts(true);
    setError(null);

    try {
      const data = await fetchProductsByShop(shopId);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadVariants = async (productId: number) => {
    if (!shopId) return;

    setIsLoadingVariants(true);
    setError(null);

    try {
      const data = await fetchVariantsByProduct(shopId, productId);
      setVariants(data);
    } catch (err) {
      console.error('Failed to load variants:', err);
      setError('Failed to load variants');
    } finally {
      setIsLoadingVariants(false);
    }
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
    setSelectedVariant(null);
    setQuantity('');
  };

  const handleVariantSelect = (variant: ProductVariantDTO) => {
    setSelectedVariant(variant);
    setQuantity('');
  };

  const handleStockAction = async (actionType: 'ADD' | 'REMOVE') => {
    if (!shopId || !selectedVariant) return;

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      alert(translations.mustBePositive);
      return;
    }

    setIsPerformingAction(true);
    setError(null);

    try {
      await performStockAction(shopId, {
        sku: selectedVariant.sku,
        actionType,
        quantity: qty,
      });

      // Update local variant stock
      const updatedVariants = variants.map(v => {
        if (v.id === selectedVariant.id) {
          const newStock = actionType === 'ADD' 
            ? v.stock + qty 
            : Math.max(0, v.stock - qty);
          return { ...v, stock: newStock };
        }
        return v;
      });
      setVariants(updatedVariants);

      // Update selected variant
      const updatedVariant = updatedVariants.find(v => v.id === selectedVariant.id);
      if (updatedVariant) {
        setSelectedVariant(updatedVariant);
      }

      setQuantity('');
      setActionSuccess(true);
    } catch (err) {
      console.error('Failed to perform stock action:', err);
      setError('Failed to update stock');
    } finally {
      setIsPerformingAction(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  if (!shopId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{translations.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{translations.title}</h2>
          <p className="text-muted-foreground">
            {selectedProduct ? selectedProduct.name : translations.selectProduct}
            {selectedVariant && ` → ${selectedVariant.sku}`}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {actionSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {translations.success}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Products List (Column 1) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {translations.products}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={translations.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Products List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {translations.noProductSelected}
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedProductId === product.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{product.name}</div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Variants List (Column 2) */}
        <Card>
          <CardHeader>
            <CardTitle>{translations.variants}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedProductId ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {translations.selectProductHint}
                </p>
              </div>
            ) : isLoadingVariants ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : variants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{translations.noVariants}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium mb-1">{variant.sku}</div>
                    <div className="text-sm opacity-80 flex items-center gap-2">
                      <span>{translations.stock}: {variant.stock}</span>
                      <Badge 
                        variant={variant.isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {variant.isActive ? translations.active : translations.inactive}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(variant.attributes).map(([name, value]) => (
                        <span key={name} className="text-xs opacity-70">
                          {name}: {value}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Management (Columns 3-4) */}
        <div className="lg:col-span-2">
          {!selectedVariant ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {translations.noVariantSelected}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {translations.selectVariantHint}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{translations.stockManagement}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variant Details */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedVariant.sku}</h3>
                    <Badge variant={selectedVariant.isActive ? 'default' : 'secondary'}>
                      {selectedVariant.isActive ? translations.active : translations.inactive}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedVariant.attributes).map(([name, value]) => (
                      <Badge key={name} variant="outline">
                        {name}: {value}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">{translations.price}</div>
                      <div className="text-xl font-bold">${selectedVariant.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{translations.currentStock}</div>
                      <div className="text-xl font-bold">{selectedVariant.stock}</div>
                    </div>
                  </div>
                </div>

                {/* Stock Actions */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">
                      {translations.quantity} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder={translations.quantityPlaceholder}
                      disabled={isPerformingAction}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleStockAction('ADD')}
                      disabled={isPerformingAction || !quantity}
                      className="w-full"
                      variant="default"
                    >
                      {isPerformingAction ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {translations.processing}
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="h-4 w-4 mr-2" />
                          {translations.addStock}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleStockAction('REMOVE')}
                      disabled={isPerformingAction || !quantity}
                      className="w-full"
                      variant="destructive"
                    >
                      {isPerformingAction ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {translations.processing}
                        </>
                      ) : (
                        <>
                          <ArrowDownCircle className="h-4 w-4 mr-2" />
                          {translations.removeStock}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
