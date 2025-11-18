import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
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
import { TrendingUp, Users, DollarSign, AlertTriangle, ShoppingCart, Package } from 'lucide-react';

interface DashboardHomeProps {
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

const recentActivities = [
  { id: '1', action: 'New order #12345', time: '2 minutes ago', type: 'order' },
  { id: '2', action: 'Product stock updated', time: '15 minutes ago', type: 'stock' },
  { id: '3', action: 'New customer registered', time: '1 hour ago', type: 'user' },
  { id: '4', action: 'Payment received', time: '2 hours ago', type: 'payment' },
];

export function DashboardHome({ language, translations }: DashboardHomeProps) {
  const dt = translations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">
          {language === 'en' ? 'Dashboard Overview' : 'Aperçu du Tableau de Bord'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en'
            ? "Welcome back! Here's what's happening today."
            : "Bon retour ! Voici ce qui se passe aujourd'hui."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={language === 'en' ? 'Total Revenue' : 'Revenu Total'}
          value="$74,523"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title={language === 'en' ? 'Total Orders' : 'Commandes Totales'}
          value="1,234"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title={language === 'en' ? 'Active Users' : 'Utilisateurs Actifs'}
          value="892"
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatCard
          title={language === 'en' ? 'Low Stock Items' : 'Articles en Stock Faible'}
          value="23"
          icon={AlertTriangle}
          trend={{ value: 5.1, isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <Card className="liquid-card">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Sales Overview' : 'Aperçu des Ventes'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="liquid-card">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Revenue Trend' : 'Tendance du Revenu'}</CardTitle>
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
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name={language === 'en' ? 'Revenue' : 'Revenu'}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Recent Activity' : 'Activité Récente'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-xl ios-surface"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-primary" />}
                    {activity.type === 'stock' && <Package className="w-4 h-4 text-primary" />}
                    {activity.type === 'user' && <Users className="w-4 h-4 text-primary" />}
                    {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
