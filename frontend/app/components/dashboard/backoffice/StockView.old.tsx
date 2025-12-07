import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Search, Plus, Save, X, Package as PackageIcon } from 'lucide-react';
import {
  searchProducts,
  getVariantsByProduct,
  getAttributeDefinitionsByProduct,
  getVariantAttributes,
  mockProductVariants,
  getVariantBySku,
} from '../../../lib/mock/backoffice-data';
import type { Product, ProductVariant, AttributeDefinition } from '../../../lib/types/backoffice';

interface StockViewProps {
  language: 'en' | 'fr';
  currentUser: any;
}

export function StockView({ language }: StockViewProps) {
  const [searchSku, setSearchSku] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [stockChange, setStockChange] = useState(0);

  const text = {
    en: {
      title: 'Stock Management',
      searchBySku: 'Search by SKU...',
      currentStock: 'Current Stock',
      addStock: 'Add Stock',
      removeStock: 'Remove Stock',
      stockChange: 'Stock Change',
      save: 'Save Changes',
      cancel: 'Cancel',
      sku: 'SKU',
      price: 'Price',
      stock: 'Stock',
      attributes: 'Attributes',
      noVariant: 'No variant found with this SKU',
      recentVariants: 'Recent Variants',
    },
    fr: {
      title: 'Gestion du Stock',
      searchBySku: 'Rechercher par SKU...',
      currentStock: 'Stock Actuel',
      addStock: 'Ajouter du Stock',
      removeStock: 'Retirer du Stock',
      stockChange: 'Modification du Stock',
      save: 'Enregistrer',
      cancel: 'Annuler',
      sku: 'SKU',
      price: 'Prix',
      stock: 'Stock',
      attributes: 'Attributs',
      noVariant: 'Aucune variante trouvée avec ce SKU',
      recentVariants: 'Variantes Récentes',
    },
  };

  const t = text[language];

  const handleSearch = () => {
    if (!searchSku.trim()) return;
    const variant = getVariantBySku(searchSku.trim());
    setSelectedVariant(variant || null);
    setStockChange(0);
  };

  const handleSaveStock = () => {
    if (!selectedVariant || stockChange === 0) return;
    // TODO: Call API to update stock
    console.log('Updating stock:', {
      variantId: selectedVariant.id,
      stockChange,
    });
    setSelectedVariant(null);
    setStockChange(0);
    setSearchSku('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-foreground">{t.title}</h1>

      <Card className="liquid-card">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t.searchBySku}
              value={searchSku}
              onChange={(e) => setSearchSku(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
        </CardHeader>

        {selectedVariant && (
          <CardContent className="space-y-4">
            <div className="ios-surface p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold">{selectedVariant.sku}</div>
                  <div className="text-sm text-muted-foreground">
                    ${selectedVariant.price.toFixed(2)}
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {selectedVariant.stock} {t.stock}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockChange">{t.stockChange}</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStockChange((prev) => prev - 1)}
                    disabled={stockChange <= -selectedVariant.stock}
                  >
                    -
                  </Button>
                  <Input
                    id="stockChange"
                    type="number"
                    value={stockChange}
                    onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <Button variant="outline" onClick={() => setStockChange((prev) => prev + 1)}>
                    +
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.currentStock}: {selectedVariant.stock} → {selectedVariant.stock + stockChange}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveStock} className="liquid-button" disabled={stockChange === 0}>
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
                <Button variant="outline" onClick={() => setSelectedVariant(null)}>
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
              </div>
            </div>
          </CardContent>
        )}

        {!selectedVariant && searchSku && (
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">{t.noVariant}</div>
          </CardContent>
        )}
      </Card>

      {/* Recent variants table */}
      <Card className="liquid-card">
        <CardHeader>
          <h3 className="font-semibold">{t.recentVariants}</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.sku}</TableHead>
                <TableHead>{t.price}</TableHead>
                <TableHead>{t.stock}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProductVariants.slice(0, 10).map((variant) => (
                <TableRow
                  key={variant.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchSku(variant.sku);
                    setSelectedVariant(variant);
                    setStockChange(0);
                  }}
                >
                  <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                  <TableCell>${variant.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={variant.stock < 20 ? 'destructive' : 'default'}>
                      {variant.stock}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
