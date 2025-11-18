import { useState } from 'react';
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

interface StockViewProps {
  language: 'en' | 'fr';
  translations: any;
}

const stockInventoryData = [
  {
    id: 'INV-001',
    product: 'Classic T-Shirt',
    sku: 'TSH-001',
    warehouse: 'Main Warehouse',
    supplier: 'TextileCo',
    stock: 145,
    minStock: 50,
    maxStock: 500,
    status: 'In Stock',
  },
  {
    id: 'INV-002',
    product: 'Denim Jeans',
    sku: 'JNS-002',
    warehouse: 'Main Warehouse',
    supplier: 'DenimPro',
    stock: 23,
    minStock: 30,
    maxStock: 300,
    status: 'Low Stock',
  },
  {
    id: 'INV-003',
    product: 'Summer Dress',
    sku: 'DRS-003',
    warehouse: 'Secondary Warehouse',
    supplier: 'FashionHub',
    stock: 0,
    minStock: 20,
    maxStock: 200,
    status: 'Out of Stock',
  },
  {
    id: 'INV-004',
    product: 'Leather Jacket',
    sku: 'JKT-004',
    warehouse: 'Main Warehouse',
    supplier: 'LeatherLux',
    stock: 89,
    minStock: 25,
    maxStock: 150,
    status: 'In Stock',
  },
  {
    id: 'INV-005',
    product: 'Running Shoes',
    sku: 'SHO-005',
    warehouse: 'Secondary Warehouse',
    supplier: 'SportGear',
    stock: 12,
    minStock: 40,
    maxStock: 400,
    status: 'Low Stock',
  },
  {
    id: 'INV-006',
    product: 'Wool Sweater',
    sku: 'SWT-006',
    warehouse: 'Main Warehouse',
    supplier: 'TextileCo',
    stock: 487,
    minStock: 30,
    maxStock: 250,
    status: 'Overstock',
  },
];

const stockLevelsData = [
  { month: 'Jan', totalStock: 2340, lowStock: 45, overstock: 89 },
  { month: 'Feb', totalStock: 2456, lowStock: 38, overstock: 102 },
  { month: 'Mar', totalStock: 2289, lowStock: 52, overstock: 76 },
  { month: 'Apr', totalStock: 2567, lowStock: 41, overstock: 118 },
  { month: 'May', totalStock: 2398, lowStock: 47, overstock: 95 },
  { month: 'Jun', totalStock: 2634, lowStock: 35, overstock: 134 },
];

export function StockView({ language, translations }: StockViewProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const dt = translations;

  const lowStockCount = stockInventoryData.filter((item) => item.status === 'Low Stock').length;
  const outOfStockCount = stockInventoryData.filter(
    (item) => item.status === 'Out of Stock',
  ).length;
  const totalStock = stockInventoryData.reduce((sum, item) => sum + item.stock, 0);

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: 'default' | 'destructive' | 'secondary' | 'outline' } = {
      'In Stock': 'default',
      'Low Stock': 'secondary',
      'Out of Stock': 'destructive',
      Overstock: 'outline',
    };
    return <Badge variant={statusMap[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{dt.stock.title}</h1>

        <div className="flex gap-3">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-[180px] ios-surface border-0 rounded-2xl">
              <SelectValue placeholder={language === 'en' ? 'Warehouse' : 'Entrepôt'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? 'All Warehouses' : 'Tous'}</SelectItem>
              <SelectItem value="main">{language === 'en' ? 'Main' : 'Principal'}</SelectItem>
              <SelectItem value="secondary">
                {language === 'en' ? 'Secondary' : 'Secondaire'}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-[180px] ios-surface border-0 rounded-2xl">
              <SelectValue placeholder={language === 'en' ? 'Supplier' : 'Fournisseur'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? 'All Suppliers' : 'Tous'}</SelectItem>
              <SelectItem value="textileco">TextileCo</SelectItem>
              <SelectItem value="denimpro">DenimPro</SelectItem>
              <SelectItem value="fashionhub">FashionHub</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={dt.stock.totalProducts}
          value={stockInventoryData.length.toString()}
          icon={Package}
        />
        <StatCard
          title={dt.stock.lowStock}
          value={lowStockCount.toString()}
          icon={AlertTriangle}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title={dt.stock.outOfStock}
          value={outOfStockCount.toString()}
          icon={TrendingDown}
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title={dt.stock.stockValue}
          value={`$${(totalStock * 45).toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Stock Levels Chart */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Stock Levels Over Time' : 'Niveaux de Stock'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockLevelsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalStock"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name={language === 'en' ? 'Total Stock' : 'Stock Total'}
              />
              <Line
                type="monotone"
                dataKey="lowStock"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name={language === 'en' ? 'Low Stock' : 'Stock Faible'}
              />
              <Line
                type="monotone"
                dataKey="overstock"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                name={language === 'en' ? 'Overstock' : 'Surstock'}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Inventory Details' : "Détails de l'Inventaire"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Product' : 'Produit'}</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>{language === 'en' ? 'Warehouse' : 'Entrepôt'}</TableHead>
                <TableHead>{language === 'en' ? 'Stock' : 'Stock'}</TableHead>
                <TableHead>{language === 'en' ? 'Min/Max' : 'Min/Max'}</TableHead>
                <TableHead>{language === 'en' ? 'Status' : 'Statut'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockInventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell>{item.warehouse}</TableCell>
                  <TableCell className="font-semibold">{item.stock}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {item.minStock} / {item.maxStock}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
