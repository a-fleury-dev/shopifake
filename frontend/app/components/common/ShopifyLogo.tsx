import { ShoppingBag } from 'lucide-react';

interface ShopifyLogoProps {
  className?: string;
}

export function ShopifyLogo({ className }: ShopifyLogoProps) {
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center flex-shrink-0`}
    >
      <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white" />
    </div>
  );
}
