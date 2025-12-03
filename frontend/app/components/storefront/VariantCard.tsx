import type { ProductVariant } from '../../lib/types/storefront';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface VariantCardProps {
  variant: ProductVariant;
  onClick: () => void;
  language: 'en' | 'fr';
}

export function VariantCard({ variant, onClick, language }: VariantCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="liquid-card cursor-pointer group overflow-hidden p-6"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-5">
        <ImageWithFallback
          src={variant.imageUrl || 'https://via.placeholder.com/400'}
          alt={variant.productName || ''}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {variant.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white px-4 py-2 rounded-lg bg-red-500 text-sm">
              {language === 'en' ? 'Out of Stock' : 'Rupture de stock'}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3 px-1">
        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {variant.productName}
        </h3>

        {/* Variant Attributes */}
        <div className="flex flex-wrap gap-1.5">
          {variant.attributes.map((attr, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {attr.attributeValue}
            </span>
          ))}
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-primary">
            {formatPrice(variant.price)}
          </span>
          {variant.stock > 0 && variant.stock < 10 && (
            <span className="text-xs text-orange-500">
              {variant.stock} {language === 'en' ? 'left' : 'restant(s)'}
            </span>
          )}
        </div>

        {/* SKU */}
        <div className="text-xs text-muted-foreground">
          SKU: {variant.sku}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
}
