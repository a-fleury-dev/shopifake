import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
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
  ShoppingCart,
  DollarSign,
} from 'lucide-react';
import {
  fetchProductsByShop,
  fetchVariantsByProduct,
  createVariant,
  updateVariant,
} from '../../../clients/storefrontApiClient';
import type { ProductDTO, ProductVariantDTO } from '../../../lib/storefront/dto';

interface VariantsViewProps {
  language: 'en' | 'fr';
  currentUser: any;
  shopId?: number;
}

export function VariantsView({ language, shopId }: VariantsViewProps) {
  // Data state
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [variants, setVariants] = useState<ProductVariantDTO[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for creation
  const [formData, setFormData] = useState({
    sku: '',
    price: '',
    stock: '',
    isActive: true,
    attributes: {} as Record<string, string>, // Map<attributeName, attributeValue>
  });

  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    sku: '',
    price: '',
    stock: '',
    isActive: true,
  });

  // Translations
  const t = {
    en: {
      title: 'Product Variants',
      selectProduct: 'Select a product',
      noProductSelected: 'No product selected',
      selectProductHint: 'Please select a product from the list to view and manage its variants',
      products: 'Products',
      variants: 'Variants',
      noVariants: 'No variants',
      createVariant: 'Create variant',
      createNewVariant: 'Create new variant',
      editVariant: 'Edit variant',
      search: 'Search products...',
      sku: 'SKU',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      attributes: 'Attributes',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      loading: 'Loading...',
      saving: 'Saving...',
      error: 'Error',
      success: 'Success',
      variantCreated: 'Variant created successfully',
      variantUpdated: 'Variant updated successfully',
      required: 'Required',
      skuPlaceholder: 'e.g., TSHIRT-RED-L',
      pricePlaceholder: 'e.g., 29.99',
      stockPlaceholder: 'e.g., 100',
      attributeValue: 'Value',
      noAttributeDefs: 'This product has no attribute definitions',
      cannotEditAttributes: 'Attributes cannot be modified',
      createdAt: 'Created',
      updatedAt: 'Updated',
    },
    fr: {
      title: 'Variants de produits',
      selectProduct: 'Sélectionner un produit',
      noProductSelected: 'Aucun produit sélectionné',
      selectProductHint: 'Veuillez sélectionner un produit dans la liste pour voir et gérer ses variants',
      products: 'Produits',
      variants: 'Variants',
      noVariants: 'Aucun variant',
      createVariant: 'Créer un variant',
      createNewVariant: 'Créer un nouveau variant',
      editVariant: 'Modifier le variant',
      search: 'Rechercher des produits...',
      sku: 'SKU',
      price: 'Prix',
      stock: 'Stock',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      attributes: 'Attributs',
      actions: 'Actions',
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      loading: 'Chargement...',
      saving: 'Enregistrement...',
      error: 'Erreur',
      success: 'Succès',
      variantCreated: 'Variant créé avec succès',
      variantUpdated: 'Variant mis à jour avec succès',
      required: 'Requis',
      skuPlaceholder: 'ex: TSHIRT-ROUGE-L',
      pricePlaceholder: 'ex: 29.99',
      stockPlaceholder: 'ex: 100',
      attributeValue: 'Valeur',
      noAttributeDefs: 'Ce produit n\'a pas de définitions d\'attributs',
      cannotEditAttributes: 'Les attributs ne peuvent pas être modifiés',
      createdAt: 'Créé le',
      updatedAt: 'Modifié le',
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, selectedProductId]);

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
    setIsCreating(false);
    setEditingVariantId(null);
  };

  const handleStartCreate = () => {
    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;

    // Initialize attributes based on product's attribute definitions
    const initialAttributes: Record<string, string> = {};
    selectedProduct.attributeDefinitions.forEach(def => {
      initialAttributes[def.attributeName] = '';
    });

    setFormData({
      sku: '',
      price: '',
      stock: '',
      isActive: true,
      attributes: initialAttributes,
    });
    setIsCreating(true);
    setEditingVariantId(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setFormData({
      sku: '',
      price: '',
      stock: '',
      isActive: true,
      attributes: {},
    });
  };

  const handleCreateVariant = async () => {
    if (!shopId || !selectedProductId) return;

    // Validation
    if (!formData.sku.trim() || !formData.price || !formData.stock) {
      alert('Please fill all required fields');
      return;
    }

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;

    // Validate all attributes are filled
    const hasEmptyAttributes = Object.values(formData.attributes).some(v => !v.trim());
    if (hasEmptyAttributes) {
      alert('Please fill all attribute values');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Convert attributes to Map<attributeDefinitionId, attributeValue>
      const attributesMap: Record<number, string> = {};
      selectedProduct.attributeDefinitions.forEach(def => {
        const value = formData.attributes[def.attributeName];
        if (value) {
          attributesMap[def.id] = value;
        }
      });

      await createVariant(shopId, {
        productId: selectedProductId,
        shopId: shopId,
        sku: formData.sku.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
        attributes: attributesMap,
      });

      // Reload variants
      await loadVariants(selectedProductId);
      handleCancelCreate();
    } catch (err) {
      console.error('Failed to create variant:', err);
      setError('Failed to create variant');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (variant: ProductVariantDTO) => {
    setEditingVariantId(variant.id);
    setEditFormData({
      sku: variant.sku,
      price: variant.price.toString(),
      stock: variant.stock.toString(),
      isActive: variant.isActive,
    });
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingVariantId(null);
    setEditFormData({
      sku: '',
      price: '',
      stock: '',
      isActive: true,
    });
  };

  const handleUpdateVariant = async (variantId: number) => {
    if (!shopId) return;

    // Validation
    if (!editFormData.sku.trim() || !editFormData.price || !editFormData.stock) {
      alert('Please fill all required fields');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateVariant(shopId, variantId, {
        sku: editFormData.sku.trim(),
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock),
        isActive: editFormData.isActive,
      });

      // Reload variants
      if (selectedProductId) {
        await loadVariants(selectedProductId);
      }
      handleCancelEdit();
    } catch (err) {
      console.error('Failed to update variant:', err);
      setError('Failed to update variant');
    } finally {
      setIsSaving(false);
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
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List (Left Sidebar) */}
        <Card className="lg:col-span-1">
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
                    <div className="text-sm opacity-80">
                      {product.attributeDefinitions.length} {translations.attributes.toLowerCase()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Variants List (Right Side) */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedProductId ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {translations.noProductSelected}
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {translations.selectProductHint}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Create Button */}
              {!isCreating && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleStartCreate}
                    disabled={selectedProduct?.attributeDefinitions.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.createVariant}
                  </Button>
                </div>
              )}

              {/* No attribute definitions warning */}
              {selectedProduct?.attributeDefinitions.length === 0 && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="py-4">
                    <p className="text-yellow-800">
                      {translations.noAttributeDefs}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Create Form */}
              {isCreating && selectedProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>{translations.createNewVariant}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* SKU */}
                    <div>
                      <Label htmlFor="create-sku">
                        {translations.sku} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="create-sku"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        placeholder={translations.skuPlaceholder}
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <Label htmlFor="create-price">
                        {translations.price} <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="create-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder={translations.pricePlaceholder}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <Label htmlFor="create-stock">
                        {translations.stock} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="create-stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        placeholder={translations.stockPlaceholder}
                      />
                    </div>

                    {/* Attributes */}
                    <div className="space-y-3">
                      <Label>{translations.attributes}</Label>
                      {selectedProduct.attributeDefinitions.map((def) => (
                        <div key={def.id}>
                          <Label htmlFor={`attr-${def.id}`} className="text-sm">
                            {def.attributeName} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`attr-${def.id}`}
                            value={formData.attributes[def.attributeName] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                attributes: {
                                  ...formData.attributes,
                                  [def.attributeName]: e.target.value,
                                },
                              })
                            }
                            placeholder={`${translations.attributeValue} (${def.attributeName})`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="create-isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="create-isActive" className="cursor-pointer">
                        {translations.active}
                      </Label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleCreateVariant}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {translations.saving}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {translations.save}
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelCreate}
                        variant="outline"
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        {translations.cancel}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Variants List */}
              {isLoadingVariants ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : variants.length === 0 && !isCreating ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{translations.noVariants}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <Card key={variant.id}>
                      <CardContent className="pt-6">
                        {editingVariantId === variant.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">
                                {translations.editVariant}
                              </h3>
                              <Badge variant={variant.isActive ? 'default' : 'secondary'}>
                                {variant.isActive ? translations.active : translations.inactive}
                              </Badge>
                            </div>

                            {/* SKU */}
                            <div>
                              <Label htmlFor={`edit-sku-${variant.id}`}>
                                {translations.sku} <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`edit-sku-${variant.id}`}
                                value={editFormData.sku}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, sku: e.target.value })
                                }
                              />
                            </div>

                            {/* Price */}
                            <div>
                              <Label htmlFor={`edit-price-${variant.id}`}>
                                {translations.price} <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id={`edit-price-${variant.id}`}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editFormData.price}
                                  onChange={(e) =>
                                    setEditFormData({ ...editFormData, price: e.target.value })
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            {/* Stock */}
                            <div>
                              <Label htmlFor={`edit-stock-${variant.id}`}>
                                {translations.stock} <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`edit-stock-${variant.id}`}
                                type="number"
                                min="0"
                                value={editFormData.stock}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, stock: e.target.value })
                                }
                              />
                            </div>

                            {/* Attributes (read-only) */}
                            <div>
                              <Label>{translations.attributes} ({translations.cannotEditAttributes})</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(variant.attributes).map(([name, value]) => (
                                  <Badge key={name} variant="outline">
                                    {name}: {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`edit-isActive-${variant.id}`}
                                checked={editFormData.isActive}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, isActive: e.target.checked })
                                }
                                className="rounded"
                              />
                              <Label htmlFor={`edit-isActive-${variant.id}`} className="cursor-pointer">
                                {translations.active}
                              </Label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                              <Button
                                onClick={() => handleUpdateVariant(variant.id)}
                                disabled={isSaving}
                                className="flex-1"
                              >
                                {isSaving ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {translations.saving}
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {translations.save}
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                disabled={isSaving}
                              >
                                <X className="h-4 w-4 mr-2" />
                                {translations.cancel}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold">{variant.sku}</h3>
                                  <Badge variant={variant.isActive ? 'default' : 'secondary'}>
                                    {variant.isActive ? translations.active : translations.inactive}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {Object.entries(variant.attributes).map(([name, value]) => (
                                    <Badge key={name} variant="outline">
                                      {name}: {value}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button
                                onClick={() => handleStartEdit(variant)}
                                variant="ghost"
                                size="sm"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">{translations.price}:</span>
                                <span className="ml-2 font-medium">${variant.price.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{translations.stock}:</span>
                                <span className="ml-2 font-medium">{variant.stock}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
