import { ShoppingBag } from 'lucide-react';

export function DashboardLogo() {
  return (
    <div className="mb-8 w-full">
      <div className="flex items-center gap-2 px-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-green-600 flex items-center justify-center liquid-glow shrink-0">
          <ShoppingBag className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-foreground dashboard-logo-title">shopifake</div>
          <p className="text-muted-foreground-enhanced dashboard-logo-subtitle">Back-Office</p>
        </div>
      </div>
    </div>
  );
}
