import { useState } from 'react';
import { Archive, Plus, Search, History, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { Product, StockHistory, BackOfficeUser } from './types';
import { mockProducts, mockStockHistory, roles } from './mockData';
import { backofficeTranslations } from './translations';

interface StockViewProps {
  language: 'en' | 'fr';
  currentUser: BackOfficeUser;
}

export function StockView({ language, currentUser }: StockViewProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>(mockStockHistory);
  const [stockSearch, setStockSearch] = useState('');
  const [showStockHistory, setShowStockHistory] = useState<string | null>(null);

  const userRole = roles.find((r) => r.name === currentUser.role);
  const canUpdate = userRole?.permissions.stock.update || false;

  const text = backofficeTranslations[language];

  // Flatten all variants from all products for stock management
  const allVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productName: product.name,
    })),
  );

  const filteredVariants = allVariants.filter(
    (variant) =>
      variant.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      variant.sku.toLowerCase().includes(stockSearch.toLowerCase()),
  );

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { status: 'outOfStock', icon: XCircle, color: 'text-destructive' };
    if (stock <= threshold)
      return { status: 'lowStock', icon: AlertTriangle, color: 'text-yellow-500' };
    return { status: 'inStock', icon: CheckCircle, color: 'text-green-500' };
  };

  return (
    <div className="p-6">
      <Card className="liquid-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Archive className="w-6 h-6 text-primary" />
              {text.stockManagement}
            </CardTitle>
            {canUpdate && (
              <Button className="liquid-button">
                <Plus className="w-4 h-4 mr-2" />
                {text.adjustStock}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={text.search}
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden ios-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{text.product}</TableHead>
                  <TableHead>{text.variant}</TableHead>
                  <TableHead>{text.sku}</TableHead>
                  <TableHead>{text.currentStock}</TableHead>
                  <TableHead>{text.lowStockThreshold}</TableHead>
                  <TableHead>{text.lastUpdated}</TableHead>
                  <TableHead>{text.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariants.map((variant) => {
                  const stockStatus = getStockStatus(variant.stock, variant.lowStockThreshold);
                  const StatusIcon = stockStatus.icon;

                  return (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">{variant.productName}</TableCell>
                      <TableCell>{variant.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{variant.sku}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${stockStatus.color}`} />
                          <span className="font-semibold">{variant.stock}</span>
                        </div>
                      </TableCell>
                      <TableCell>{variant.lowStockThreshold}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{variant.lastUpdated}</div>
                          <div className="text-muted-foreground">{variant.updatedBy}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {canUpdate && (
                            <Button variant="ghost" size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowStockHistory(variant.id)}
                          >
                            <History className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredVariants.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">{text.search}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
