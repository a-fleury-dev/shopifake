import { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { Product, BackOfficeUser } from './types';
import { mockProducts, roles } from './mockData';
import { backofficeTranslations } from './translations';

interface ProductsViewProps {
  language: 'en' | 'fr';
  currentUser: BackOfficeUser;
}

export function ProductsView({ language, currentUser }: ProductsViewProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userRole = roles.find((r) => r.name === currentUser.role);
  const canEdit = userRole?.permissions.products.update || false;
  const canCreate = userRole?.permissions.products.create || false;
  const canDelete = userRole?.permissions.products.delete || false;

  const text = backofficeTranslations[language];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <div className="p-6">
      <Card className="liquid-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              {text.products}
            </CardTitle>
            {canCreate && (
              <Button className="liquid-button">
                <Plus className="w-4 h-4 mr-2" />
                {text.add}
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
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden ios-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{text.name}</TableHead>
                  <TableHead>{text.sku}</TableHead>
                  <TableHead>{text.price}</TableHead>
                  <TableHead>{text.variants}</TableHead>
                  <TableHead>{text.collection}</TableHead>
                  <TableHead>{text.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.sku}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge>{product.variants.length}</Badge>
                    </TableCell>
                    <TableCell>{product.collection || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">{text.search}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
