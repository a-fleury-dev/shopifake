import type { ComponentType } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="liquid-card border-0 !transform-none !scale-100 !translate-y-0 !shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.25)] dark:!shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-muted-foreground-enhanced">{title}</CardTitle>
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center liquid-glow">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-foreground font-bold">{value}</p>
            {trend && (
              <p
                className={`text-sm flex items-center gap-1 mt-1 ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {trend.value}%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
