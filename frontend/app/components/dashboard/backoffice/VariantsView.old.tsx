import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Search, Plus, Save, X } from 'lucide-react';
import {
  searchProducts,
  getVariantsByProduct,
  getAttributeDefinitionsByProduct,
  getVariantAttributes,
} from '../../../lib/mock/backoffice-data';
import type { Product } from '../../../lib/types/backoffice';

interface VariantsViewProps {
  language: 'en' | 'fr';
  currentUser: any;
}

export function VariantsView({ language }: VariantsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    sku: '',
    price: '',
    stock: '',
    imageUrl: '',
    attributes: {} as Record<number, string>,
  });

  const text = {
    en: {
      title: 'Product Variants',
      searchProduct: 'Search product by name...',
      selectProduct: 'Select a product to view its variants',
      createVariant: 'Create Variant',
      sku: 'SKU',
      price: 'Price',
      stock: 'Stock',
      image: 'Image',
      selectImage: 'Select Image',
      attributes: 'Attributes',
      save: 'Save',
      cancel: 'Cancel',
      backToSearch: 'Back to Search',
      noProducts: 'No products found',
      noVariants: 'No variants for this product',
      duplicateError: 'A variant with these attributes already exists',
    },
    fr: {
      title: 'Variantes de Produits',
      searchProduct: 'Rechercher un produit par nom...',
      selectProduct: 'Sélectionnez un produit pour voir ses variantes',
      createVariant: 'Créer une Variante',
      sku: 'SKU',
      price: 'Prix',
      stock: 'Stock',
      image: 'Image',
      selectImage: 'Sélectionner une Image',
      attributes: 'Attributs',
      save: 'Enregistrer',
      cancel: 'Annuler',
      backToSearch: 'Retour à la Recherche',
      noProducts: 'Aucun produit trouvé',
      noVariants: 'Aucune variante pour ce produit',
      duplicateError: 'Une variante avec ces attributs existe déjà',
    },
  };

  const t = text[language];
  const filteredProducts = searchQuery ? searchProducts(searchQuery) : [];

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsCreating(false);
  };

  const handleCreateVariant = () => {
    if (!selectedProduct) return;
    
    const attrs = getAttributeDefinitionsByProduct(selectedProduct.id);
    const attrValues: Record<number, string> = {};
    attrs.forEach((attr) => {
      attrValues[attr.id] = '';
    });

    setFormData({
      sku: '',
      price: '',
      stock: '',
      imageUrl: '',
      attributes: attrValues,
    });
    setSelectedImageFile(null);
    setImagePreview('');
    setIsCreating(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'en' ? 'Please select an image file' : 'Veuillez sélectionner un fichier image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'en' ? 'Image size must be less than 5MB' : 'La taille de l\'image doit être inférieure à 5 Mo');
      return;
    }

    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFormData({ ...formData, imageUrl: previewUrl });
  };

  const handleSaveVariant = () => {
    if (!selectedProduct) return;

    // TODO: Upload image to image-service first
    // TODO: Check for duplicate variant combinations
    // TODO: Call API to create variant
    console.log('Creating variant:', {
      productId: selectedProduct.id,
      ...formData,
      imageFile: selectedImageFile,
    });

    setIsCreating(false);
    setSelectedImageFile(null);
    setImagePreview('');
  };

  const updateAttribute = (attrId: number, value: string) => {
    setFormData({
      ...formData,
      attributes: { ...formData.attributes, [attrId]: value },
    });
  };

  // Product selection view
  if (!selectedProduct) {
    return (
      <div className="space-y-6">
        <h1 className="text-foreground">{t.title}</h1>

        <Card className="liquid-card">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t.searchProduct}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {filteredProducts.length === 0 && searchQuery && (
              <div className="text-center py-8 text-muted-foreground">{t.noProducts}</div>
            )}

            {filteredProducts.length === 0 && !searchQuery && (
              <div className="text-center py-8 text-muted-foreground">{t.selectProduct}</div>
            )}

            {filteredProducts.map((product) => {
              const variants = getVariantsByProduct(product.id);
              return (
                <div
                  key={product.id}
                  className="ios-surface p-4 rounded-lg cursor-pointer"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.slug}</div>
                    </div>
                    <Badge variant="outline">{variants.length} variants</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Variant management view
  const variants = getVariantsByProduct(selectedProduct.id);
  const attributeDefinitions = getAttributeDefinitionsByProduct(selectedProduct.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">{selectedProduct.name}</h1>
          <p className="text-sm text-muted-foreground">{selectedProduct.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedProduct(null)}>
            <X className="w-4 h-4 mr-2" />
            {t.backToSearch}
          </Button>
          {!isCreating && (
            <Button onClick={handleCreateVariant} className="liquid-button">
              <Plus className="w-4 h-4 mr-2" />
              {t.createVariant}
            </Button>
          )}
        </div>
      </div>

      {isCreating && (
        <Card className="liquid-card">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">{t.sku}</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="TSH-001-RED-M"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t.price}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="19.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">{t.stock}</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.image}</Label>
              <div className="space-y-2">
                <Input
                  id="variantImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('variantImage')?.click()}
                  className="w-full"
                >
                  {t.selectImage}
                </Button>
                {imagePreview && (
                  <div className="relative aspect-square w-full max-w-xs rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Variant preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.attributes}</Label>
              <div className="grid grid-cols-2 gap-3">
                {attributeDefinitions.map((attr) => (
                  <div key={attr.id} className="space-y-1">
                    <Label htmlFor={`attr-${attr.id}`}>{attr.attributeName}</Label>
                    <Input
                      id={`attr-${attr.id}`}
                      value={formData.attributes[attr.id] || ''}
                      onChange={(e) => updateAttribute(attr.id, e.target.value)}
                      placeholder={`ex: ${attr.attributeName === 'Couleur' ? 'Rouge' : 'M'}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveVariant} className="liquid-button">
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="liquid-card">
        <CardHeader>
          <h3 className="font-semibold">
            {variants.length} {t.attributes}
          </h3>
        </CardHeader>
        <CardContent>
          {variants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t.noVariants}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.sku}</TableHead>
                  <TableHead>{t.price}</TableHead>
                  <TableHead>{t.stock}</TableHead>
                  <TableHead>{t.attributes}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => {
                  const variantAttrs = getVariantAttributes(variant.id);
                  return (
                    <TableRow key={variant.id}>
                      <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                      <TableCell>${variant.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={variant.stock < 20 ? 'destructive' : 'default'}>
                          {variant.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {variantAttrs.map((attr) => {
                            const def = attributeDefinitions.find(
                              (d) => d.id === attr.attributeDefinitionId,
                            );
                            return (
                              <Badge key={attr.id} variant="outline" className="text-xs">
                                {def?.attributeName}: {attr.attributeValue}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
