import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Save,
  X,
  Package,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import {
  mockCategories,
  mockProducts,
  searchProducts,
  getAttributeDefinitionsByProduct,
} from '../../../lib/mock/backoffice-data';
import type { Product } from '../../../lib/types/backoffice';

interface ProductsViewProps {
  language: 'en' | 'fr';
  currentUser: any;
}

export function ProductsView({ language }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    categoryId: '',
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
      description: 'Description',
      active: 'Active',
      attributeDefinitions: 'Attribute Definitions',
      addAttribute: 'Add Attribute',
      save: 'Save',
      cancel: 'Cancel',
      backToList: 'Back to List',
      products: 'products',
      attributes: 'attributes',
      noProducts: 'No products found',
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
      description: 'Description',
      active: 'Actif',
      attributeDefinitions: 'Définitions d\'Attributs',
      addAttribute: 'Ajouter un Attribut',
      save: 'Enregistrer',
      cancel: 'Annuler',
      backToList: 'Retour à la Liste',
      products: 'produits',
      attributes: 'attributs',
      noProducts: 'Aucun produit trouvé',
      attributePlaceholder: 'ex: Couleur, Taille, Matière',
    },
  };

  const t = text[language];

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : mockProducts;

  const handleCreateProduct = () => {
    // TODO: Call API to create product
    console.log('Creating product:', formData);
    setIsCreating(false);
    setFormData({
      categoryId: '',
      name: '',
      description: '',
      isActive: true,
      attributeDefinitions: [''],
    });
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    const attrs = getAttributeDefinitionsByProduct(product.id);
    setFormData({
      categoryId: product.categoryId.toString(),
      name: product.name,
      description: product.description,
      isActive: product.isActive,
      attributeDefinitions: attrs.length > 0 ? attrs.map((a) => a.attributeName) : [''],
    });
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) return;
    // TODO: Call API to update product
    console.log('Updating product:', { id: selectedProduct.id, ...formData });
    setSelectedProduct(null);
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

  // Show form view when creating or editing
  if (isCreating || selectedProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground">{isCreating ? t.createProduct : t.editProduct}</h1>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreating(false);
              setSelectedProduct(null);
            }}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t.category}</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t.description}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.attributeDefinitions}</Label>
              {formData.attributeDefinitions.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={attr}
                    onChange={(e) => updateAttribute(index, e.target.value)}
                    placeholder={t.attributePlaceholder}
                  />
                  {formData.attributeDefinitions.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeAttribute(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAttributeField}>
                <Plus className="w-4 h-4 mr-2" />
                {t.addAttribute}
              </Button>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setSelectedProduct(null);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
              <Button
                onClick={isCreating ? handleCreateProduct : handleSaveProduct}
                className="liquid-button"
              >
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{t.title}</h1>
        <Button onClick={() => setIsCreating(true)} className="liquid-button">
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
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">{t.noProducts}</div>
          )}

          {filteredProducts.map((product) => {
            const attrs = getAttributeDefinitionsByProduct(product.id);
            const category = mockCategories.find((c) => c.id === product.categoryId);

            return (
              <div
                key={product.id}
                className="ios-surface p-4 rounded-lg cursor-pointer"
                onClick={() => handleEditProduct(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Package className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category?.label} • {product.slug}
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
                      {product.isActive ? t.active : 'Inactive'}
                    </Badge>
                    {attrs.length > 0 && (
                      <Badge variant="outline">
                        {attrs.length} {t.attributes}
                      </Badge>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
