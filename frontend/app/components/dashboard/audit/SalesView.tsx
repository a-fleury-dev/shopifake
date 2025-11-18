import { useState } from 'react';
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

interface SalesViewProps {
  language: 'en' | 'fr';
  translations: any;
}

const monthlySalesData = [
  { month: 'Jan', sales: 45000, orders: 245, revenue: 52000 },
  { month: 'Feb', sales: 52000, orders: 289, revenue: 58000 },
  { month: 'Mar', sales: 48000, orders: 267, revenue: 54000 },
  { month: 'Apr', sales: 61000, orders: 321, revenue: 68000 },
  { month: 'May', sales: 55000, orders: 298, revenue: 62000 },
  { month: 'Jun', sales: 67000, orders: 345, revenue: 74000 },
];

export function SalesView({ language, translations }: SalesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dt = translations;

  // Calculate totals
  const totalUnitsSold = monthlySalesData.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = monthlySalesData.reduce((sum, item) => sum + item.revenue, 0);
  const avgOrderValue = totalRevenue / totalUnitsSold;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{dt.sales.title}</h1>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px] ios-surface border-0 rounded-2xl">
            <SelectValue placeholder={dt.sales.filterByCategory} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dt.sales.allCategories}</SelectItem>
            <SelectItem value="accessories">{dt.sales.accessories}</SelectItem>
            <SelectItem value="kids">{dt.sales.kidsClothing}</SelectItem>
            <SelectItem value="men">{dt.sales.menClothing}</SelectItem>
            <SelectItem value="shoes">{dt.sales.shoes}</SelectItem>
            <SelectItem value="women">{dt.sales.womenClothing}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={dt.sales.totalUnitsSold}
          value={totalUnitsSold.toLocaleString()}
          icon={ShoppingCart}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title={dt.sales.totalRevenue}
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title={dt.sales.avgOrderValue}
          value={`$${avgOrderValue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
        />
      </div>

      {/* Sales Chart */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{dt.sales.salesByMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlySalesData}>
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
              <Bar
                dataKey="sales"
                fill="hsl(var(--primary))"
                name={language === 'en' ? 'Sales' : 'Ventes'}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--chart-2))"
                name={language === 'en' ? 'Revenue' : 'Revenu'}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{dt.sales.monthlyPerformance}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySalesData}>
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
                dataKey="orders"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name={dt.sales.unitsOrdered}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
