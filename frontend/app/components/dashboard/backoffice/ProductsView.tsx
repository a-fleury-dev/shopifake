import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Save,
  X,
  Package,
  Loader2,
  FolderTree,
} from 'lucide-react';
import {
  fetchProductsByShop,
  createProduct,
  updateProduct,
} from '../../../clients/storefrontApiClient';
import { CategorySelectorModal } from './CategorySelectorModal';
import type { ProductDTO } from '../../../lib/storefront/dto';

interface ProductsViewProps {
  language: 'en' | 'fr';
  currentUser: any;
  shopId?: number;
}

export function ProductsView({ language, shopId }: ProductsViewProps) {
  // Data state
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    categoryId: 0,
    categoryName: '',
    name: '',
    description: '',
    isActive: true,
    attributeDefinitions: [''],
  });

  const text = {
    en: {
      title: 'Products',
      search: 'Search products by name...',
      createProduct: 'Create Product',
      editProduct: 'Edit Product',
      productName: 'Product Name',
      category: 'Category',
      selectCategory: 'Select a category',
      changeCategory: 'Change Category',
      description: 'Description',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      backToList: 'Back to List',
      noProducts: 'No products found',
      loading: 'Loading products...',
      noShop: 'No shop selected',
      errorLoading: 'Error loading products',
      attributeDefinitions: 'Attribute Definitions',
      addAttribute: 'Add Attribute',
      attributePlaceholder: 'e.g. Color, Size, Material',
    },
    fr: {
      title: 'Produits',
      search: 'Rechercher des produits par nom...',
      createProduct: 'Créer un Produit',
      editProduct: 'Modifier le Produit',
      productName: 'Nom du Produit',
      category: 'Catégorie',
      selectCategory: 'Sélectionner une catégorie',
      changeCategory: 'Changer de Catégorie',
      description: 'Description',
      active: 'Actif',
      inactive: 'Inactif',
      save: 'Enregistrer',
      cancel: 'Annuler',
      backToList: 'Retour à la Liste',
      noProducts: 'Aucun produit trouvé',
      loading: 'Chargement des produits...',
      noShop: 'Aucune boutique sélectionnée',
      errorLoading: 'Erreur lors du chargement des produits',
      attributeDefinitions: 'Définitions d\'Attributs',
      addAttribute: 'Ajouter un Attribut',
      attributePlaceholder: 'ex: Couleur, Taille, Matière',
    },
  };

  const t = text[language];

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      if (!shopId) {
        setError(t.noShop);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedProducts = await fetchProductsByShop(shopId);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err instanceof Error ? err.message : t.errorLoading);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const refreshProducts = async () => {
    if (!shopId) return;
    try {
      const fetchedProducts = await fetchProductsByShop(shopId);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to refresh products:', err);
    }
  };

  const handleCreateProduct = async () => {
    if (!formData.name.trim() || !formData.categoryId || !shopId || isSaving) return;

    setIsSaving(true);
    try {
      // Filter out empty attribute definitions
      const attributeDefinitions = formData.attributeDefinitions
        .filter(attr => attr.trim() !== '')
        .map((attributeName, index) => ({ attributeName, position: index }));

      await createProduct(shopId, {
        categoryId: formData.categoryId,
        shopId: shopId,
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
        attributeDefinitions: attributeDefinitions.length > 0 ? attributeDefinitions : undefined,
      });

      setIsCreating(false);
      resetForm();
      await refreshProducts();
    } catch (err) {
      console.error('Failed to create product:', err);
      alert(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProduct = (product: ProductDTO) => {
    setSelectedProduct(product);
    setFormData({
      categoryId: product.categoryId,
      categoryName: '', // Will be set when category modal is opened if needed
      name: product.name,
      description: product.description || '',
      isActive: product.isActive,
      attributeDefinitions: product.attributeDefinitions?.map(a => a.attributeName) || [''],
    });
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct || !formData.name.trim() || !shopId || isSaving) return;

    setIsSaving(true);
    try {
      await updateProduct(shopId, selectedProduct.id, {
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
      });

      setSelectedProduct(null);
      resetForm();
      await refreshProducts();
    } catch (err) {
      console.error('Failed to update product:', err);
      alert(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: 0,
      categoryName: '',
      name: '',
      description: '',
      isActive: true,
      attributeDefinitions: [''],
    });
  };

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    setFormData({ ...formData, categoryId, categoryName });
  };

  const addAttributeField = () => {
    setFormData({
      ...formData,
      attributeDefinitions: [...formData.attributeDefinitions, ''],
    });
  };

  const updateAttribute = (index: number, value: string) => {
    const newAttrs = [...formData.attributeDefinitions];
    newAttrs[index] = value;
    setFormData({ ...formData, attributeDefinitions: newAttrs });
  };

  const removeAttribute = (index: number) => {
    const newAttrs = formData.attributeDefinitions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attributeDefinitions: newAttrs.length > 0 ? newAttrs : [''],
    });
  };

  // Filter products
  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-foreground">{t.title}</h1>
        <Card className="liquid-card">
          <CardContent className="p-6">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show form view when creating or editing
  if (isCreating || selectedProduct) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-foreground">{isCreating ? t.createProduct : t.editProduct}</h1>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setSelectedProduct(null);
                resetForm();
              }}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              {t.backToList}
            </Button>
          </div>

          <Card className="liquid-card">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">{t.productName}</Label>
                <Input
                  id="productName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.productName}
                  disabled={isSaving}
                />
              </div>

              {isCreating && (
                <div className="space-y-2">
                  <Label>{t.category}</Label>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsCategoryModalOpen(true)}
                    disabled={isSaving}
                  >
                    <FolderTree className="w-4 h-4 mr-2" />
                    {formData.categoryName || t.selectCategory}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.description}
                  rows={4}
                  disabled={isSaving}
                />
              </div>

              {isCreating && (
                <div className="space-y-2">
                  <Label>{t.attributeDefinitions}</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'en' 
                      ? 'Define variant attributes (e.g., Color, Size). These cannot be changed later.' 
                      : 'Définissez les attributs de variants (ex: Couleur, Taille). Ils ne pourront pas être modifiés ultérieurement.'}
                  </p>
                  {formData.attributeDefinitions.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={attr}
                        onChange={(e) => updateAttribute(index, e.target.value)}
                        placeholder={t.attributePlaceholder}
                        disabled={isSaving}
                      />
                      {formData.attributeDefinitions.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeAttribute(index)}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addAttributeField}
                    disabled={isSaving}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addAttribute}
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  disabled={isSaving}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {t.active}
                </Label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedProduct(null);
                    resetForm();
                  }}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
                <Button
                  onClick={isCreating ? handleCreateProduct : handleSaveProduct}
                  className="liquid-button"
                  disabled={isSaving || !formData.name.trim() || (isCreating && !formData.categoryId)}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t.save}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {shopId && (
          <CategorySelectorModal
            language={language}
            shopId={shopId}
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            onSelect={handleCategorySelect}
            selectedCategoryId={formData.categoryId}
          />
        )}
      </>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{t.title}</h1>
        <Button onClick={() => setIsCreating(true)} className="liquid-button" disabled={isLoading || !shopId}>
          <Plus className="w-4 h-4 mr-2" />
          {t.createProduct}
        </Button>
      </div>

      <Card className="liquid-card">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">{t.loading}</span>
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">{t.noProducts}</div>
          )}

          {!isLoading && filteredProducts.map((product) => (
            <div
              key={product.id}
              className="ios-surface p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleEditProduct(product)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Package className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.slug}
                    </div>
                    {product.description && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {product.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? t.active : t.inactive}
                  </Badge>
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
