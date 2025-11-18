import { useState } from 'react';
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Target, Users, TrendingUp, Zap } from 'lucide-react';

interface ABTestingViewProps {
  language: 'en' | 'fr';
  translations: any;
}

const mockABTestVariants = [
  {
    variant: 'Control',
    visitors: 12456,
    conversions: 987,
    conversionPercent: 7.92,
    avgOrder: 89.5,
    revenue: 88321.5,
  },
  {
    variant: 'Variant A',
    visitors: 12389,
    conversions: 1124,
    conversionPercent: 9.07,
    avgOrder: 92.3,
    revenue: 103707.2,
  },
  {
    variant: 'Variant B',
    visitors: 12501,
    conversions: 1056,
    conversionPercent: 8.45,
    avgOrder: 87.8,
    revenue: 92716.8,
  },
];

const abTestConversionRateData = [
  { day: 'Day 1', control: 6.5, variantA: 7.2, variantB: 6.8 },
  { day: 'Day 2', control: 6.8, variantA: 7.5, variantB: 7.1 },
  { day: 'Day 3', control: 7.1, variantA: 7.8, variantB: 7.4 },
  { day: 'Day 4', control: 7.3, variantA: 8.2, variantB: 7.7 },
  { day: 'Day 5', control: 7.5, variantA: 8.5, variantB: 8.0 },
  { day: 'Day 6', control: 7.6, variantA: 8.7, variantB: 8.2 },
  { day: 'Day 7', control: 7.8, variantA: 8.9, variantB: 8.3 },
  { day: 'Day 8', control: 7.7, variantA: 9.0, variantB: 8.4 },
  { day: 'Day 9', control: 7.9, variantA: 9.1, variantB: 8.5 },
  { day: 'Day 10', control: 7.92, variantA: 9.07, variantB: 8.45 },
];

const abTestFunnelData = [
  {
    stage: 'Landing',
    control: 12456,
    variantA: 12389,
    variantB: 12501,
  },
  {
    stage: 'Signup',
    control: 3742,
    variantA: 4210,
    variantB: 3875,
  },
  {
    stage: 'Checkout',
    control: 1498,
    variantA: 1810,
    variantB: 1625,
  },
  {
    stage: 'Conversion',
    control: 987,
    variantA: 1124,
    variantB: 1056,
  },
];

export function ABTestingView({ language, translations }: ABTestingViewProps) {
  const [selectedExperiment, setSelectedExperiment] = useState('experiment1');
  const [selectedVariant, setSelectedVariant] = useState('all');
  const dt = translations;

  const totalVisitors = mockABTestVariants.reduce((sum, variant) => sum + variant.visitors, 0);
  const totalConversions = mockABTestVariants.reduce(
    (sum, variant) => sum + variant.conversions,
    0,
  );
  const avgConversionRate = ((totalConversions / totalVisitors) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{dt.abTesting.title}</h1>

        <div className="flex gap-3">
          <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
            <SelectTrigger className="w-[200px] ios-surface border-0 rounded-2xl">
              <SelectValue placeholder={dt.abTesting.experiment} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="experiment1">
                {language === 'en' ? 'Homepage CTA Test' : "Test CTA Page d'accueil"}
              </SelectItem>
              <SelectItem value="experiment2">
                {language === 'en' ? 'Checkout Flow' : 'Flux de Paiement'}
              </SelectItem>
              <SelectItem value="experiment3">
                {language === 'en' ? 'Product Page Layout' : 'Layout Page Produit'}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedVariant} onValueChange={setSelectedVariant}>
            <SelectTrigger className="w-[150px] ios-surface border-0 rounded-2xl">
              <SelectValue placeholder={dt.abTesting.variant} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? 'All Variants' : 'Toutes'}</SelectItem>
              <SelectItem value="control">{dt.abTesting.control}</SelectItem>
              <SelectItem value="a">{dt.abTesting.variantA}</SelectItem>
              <SelectItem value="b">{dt.abTesting.variantB}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={dt.abTesting.totalVisitors}
          value={totalVisitors.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title={dt.abTesting.totalConversions}
          value={totalConversions.toLocaleString()}
          icon={Target}
          trend={{ value: 14.5, isPositive: true }}
        />
        <StatCard
          title={dt.abTesting.conversionRateMetric}
          value={`${avgConversionRate}%`}
          icon={TrendingUp}
          trend={{ value: 9.2, isPositive: true }}
        />
        <StatCard title={dt.abTesting.pValue} value="0.023" icon={Zap} />
      </div>

      {/* Conversion Rate Over Time */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{dt.abTesting.conversionRate}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={abTestConversionRateData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" />
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
                dataKey="control"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name={dt.abTesting.control}
              />
              <Line
                type="monotone"
                dataKey="variantA"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name={dt.abTesting.variantA}
              />
              <Line
                type="monotone"
                dataKey="variantB"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name={dt.abTesting.variantB}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funnel Analysis */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Funnel Analysis' : 'Analyse de Tunnel'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={abTestFunnelData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="stage" />
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
                dataKey="control"
                fill="hsl(var(--chart-1))"
                name={dt.abTesting.control}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="variantA"
                fill="hsl(var(--primary))"
                name={dt.abTesting.variantA}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="variantB"
                fill="hsl(var(--chart-3))"
                name={dt.abTesting.variantB}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Variants Table */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Variant Performance' : 'Performance des Variantes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dt.abTesting.variantTable.variant}</TableHead>
                <TableHead className="text-right">{dt.abTesting.variantTable.visitors}</TableHead>
                <TableHead className="text-right">
                  {dt.abTesting.variantTable.conversions}
                </TableHead>
                <TableHead className="text-right">
                  {dt.abTesting.variantTable.conversionPercent}
                </TableHead>
                <TableHead className="text-right">{dt.abTesting.variantTable.avgOrder}</TableHead>
                <TableHead className="text-right">{dt.abTesting.variantTable.revenue}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockABTestVariants.map((variant) => (
                <TableRow key={variant.variant}>
                  <TableCell className="font-medium">{variant.variant}</TableCell>
                  <TableCell className="text-right">{variant.visitors.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {variant.conversions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {variant.conversionPercent}%
                  </TableCell>
                  <TableCell className="text-right">${variant.avgOrder.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${variant.revenue.toLocaleString()}
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
