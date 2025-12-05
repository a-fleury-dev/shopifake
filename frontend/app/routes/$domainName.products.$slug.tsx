import { useState, useMemo } from 'react';
import { useNavigate, useParams, type MetaFunction } from 'react-router';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { storefrontTranslations } from '../lib/translations/storefront';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { getProductBySlug } from '../lib/mock/storefront-data';
export const meta: MetaFunction = ({ params }) => {
  const product = getProductBySlug(params.slug || '');
  return [
    { title: product ? `${product.name} - Shop` : 'Product - Shop' },
    { name: 'description', content: product?.description || 'Product details' },
  ];
};

function ProductDetailContent() {
  const navigate = useNavigate();
  const { domainName, slug } = useParams();
  const language = 'en'; // TODO: Add language detection/selection
  const t = storefrontTranslations[language];
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [currentVariantId, setCurrentVariantId] = useState<number | null>(null);

  const product = getProductBySlug(slug || '');

  // Get unique values for each attribute
  const attributeOptions = useMemo(() => {
    if (!product) return {};
    
    const options: Record<number, Set<string>> = {};
    
    product.attributeDefinitions.forEach(def => {
      options[def.id] = new Set();
      product.variants.forEach(variant => {
        if (variant.isActive) {
          const attr = variant.attributes.find(a => a.attributeDefinitionId === def.id);
          if (attr) {
            options[def.id].add(attr.attributeValue);
          }
        }
      });
    });
    
    return options;
  }, [product]);

  // Set initial variant
  useMemo(() => {
    if (product && !currentVariantId && product.variants.length > 0) {
      setCurrentVariantId(product.variants[0].id);
    }
  }, [product, currentVariantId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t.errors.productNotFound}</h2>
          <Button onClick={() => navigate(`/${domainName}`)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.product.backToStore}
          </Button>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants.find(v => v.id === currentVariantId);

  if (!currentVariant) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(currentVariant, quantity, t.cart.itemAdded);
    setQuantity(1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < currentVariant.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Group variants by attribute combinations for selection
  const attributeDefinitions = product.attributeDefinitions;
  const currentAttributes = currentVariant.attributes.reduce((acc, attr) => {
    acc[attr.attributeDefinitionId] = attr.attributeValue;
    return acc;
  }, {} as Record<number, string>);

  const handleAttributeChange = (attributeDefId: number, value: string) => {
    // Find variant matching the new attribute combination
    const newAttributes = { ...currentAttributes, [attributeDefId]: value };
    
    const matchingVariant = product.variants.find(variant => {
      if (!variant.isActive) return false;
      
      return attributeDefinitions.every(def => {
        const variantAttr = variant.attributes.find(a => a.attributeDefinitionId === def.id);
        return variantAttr && variantAttr.attributeValue === newAttributes[def.id];
      });
    });
    
    if (matchingVariant) {
      setCurrentVariantId(matchingVariant.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-strong-transparent border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Button onClick={() => navigate(`/${domainName}`)} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.product.backToStore}
          </Button>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image */}
          <div className="liquid-card no-hover p-6 aspect-square">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <ImageWithFallback
                src={currentVariant.imageUrl || 'https://via.placeholder.com/800'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {currentVariant.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl px-6 py-3 rounded-xl bg-red-500">
                    {t.product.outOfStock}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Product Name & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(currentVariant.price)}
                </span>
                {currentVariant.stock > 0 && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {currentVariant.stock} {t.product.available}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Current Variant Attributes */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t.product.attributes}
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentVariant.attributes.map((attr, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {attr.attributeName}: {attr.attributeValue}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                SKU: {currentVariant.sku}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t.product.description}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </>
            )}

            {/* Variant Selection */}
            {attributeDefinitions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t.product.variants}</h3>
                  
                  {attributeDefinitions.map(def => (
                    <div key={def.id}>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        {def.attributeName}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(attributeOptions[def.id] || []).map(value => {
                          const isSelected = currentAttributes[def.id] === value;
                          return (
                            <button
                              key={value}
                              onClick={() => handleAttributeChange(def.id, value)}
                              className={`px-4 py-2 rounded-xl transition-all ${
                                isSelected
                                  ? 'liquid-button text-primary-foreground'
                                  : 'ios-surface hover:bg-muted'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 inline mr-2" />}
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {t.product.quantity}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 ios-surface rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseQuantity}
                      disabled={quantity >= currentVariant.stock}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentVariant.stock > 0
                      ? `${currentVariant.stock} ${t.product.inStock.toLowerCase()}`
                      : t.product.outOfStock}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={currentVariant.stock === 0}
                className="w-full h-14 text-lg gap-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {t.product.addToCart}
              </Button>

              {currentVariant.stock === 0 && (
                <p className="text-sm text-red-500 text-center">
                  {t.product.outOfStock}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetailContent />
    </CartProvider>
  );
}
