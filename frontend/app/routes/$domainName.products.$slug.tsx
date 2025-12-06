import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, type MetaFunction } from 'react-router';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Loader2 } from 'lucide-react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { storefrontTranslations } from '../lib/translations/storefront';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { fetchShopByDomain } from '../clients/shopApiClient';
import { fetchAllProductsWithVariants } from '../clients/storefrontApiClient';
import { transformProductsWithVariants } from '../lib/storefront/transform';
import type { ProductVariant } from '../lib/types/storefront';
export const meta: MetaFunction = () => {
  return [
    { title: 'Product - Shop' },
    { name: 'description', content: 'Product details' },
  ];
};

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  variants: ProductVariant[];
  attributeDefinitions: Array<{ name: string; values: string[] }>;
}

function ProductDetailContent() {
  const navigate = useNavigate();
  const { domainName, slug } = useParams();
  const [searchParams] = useSearchParams();
  const language = 'en'; // TODO: Add language detection/selection
  const t = storefrontTranslations[language];
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [currentVariantId, setCurrentVariantId] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load shop and product data
  useEffect(() => {
    const loadData = async () => {
      if (!domainName || !slug) return;

      try {
        setIsLoading(true);
        
        // Fetch shop
        const shopData = await fetchShopByDomain(domainName);

        // Fetch all products with variants
        const productsWithVariants = await fetchAllProductsWithVariants(shopData.id);
        const allVariants = transformProductsWithVariants(productsWithVariants);

        // Find product by slug
        const foundProduct = allVariants.find(v => v.productSlug === slug);
        
        if (!foundProduct) {
          setError('Product not found');
          setIsLoading(false);
          return;
        }

        // Group all variants by product
        const productVariants = allVariants.filter(v => v.productSlug === slug);

        // Extract attribute definitions
        const attributeMap = new Map<string, Set<string>>();
        productVariants.forEach(variant => {
          variant.attributes.forEach(attr => {
            const key = attr.attributeName || `attr_${attr.attributeDefinitionId}`;
            if (!attributeMap.has(key)) {
              attributeMap.set(key, new Set());
            }
            attributeMap.get(key)!.add(attr.attributeValue);
          });
        });

        const attributeDefinitions = Array.from(attributeMap.entries()).map(([name, values]) => ({
          name,
          values: Array.from(values),
        }));

        const productData: Product = {
          id: foundProduct.productId,
          name: foundProduct.productName || 'Product',
          slug: foundProduct.productSlug || slug,
          description: foundProduct.productDescription,
          variants: productVariants,
          attributeDefinitions,
        };

        setProduct(productData);

        // Set initial variant from query param or first variant
        const variantIdParam = searchParams.get('variant');
        if (variantIdParam) {
          const variantId = parseInt(variantIdParam, 10);
          const variant = productVariants.find(v => v.id === variantId);
          if (variant) {
            setCurrentVariantId(variantId);
          } else {
            setCurrentVariantId(productVariants[0].id);
          }
        } else {
          setCurrentVariantId(productVariants[0].id);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
        setIsLoading(false);
      }
    };

    loadData();
  }, [domainName, slug, searchParams]);

  // Get unique values for each attribute
  const attributeOptions = useMemo(() => {
    if (!product) return {};
    
    const options: Record<string, Set<string>> = {};
    
    product.attributeDefinitions.forEach(def => {
      options[def.name] = new Set(def.values);
    });
    
    return options;
  }, [product]);

  // Set initial variant
  useMemo(() => {
    if (product && !currentVariantId && product.variants.length > 0) {
      setCurrentVariantId(product.variants[0].id);
    }
  }, [product, currentVariantId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{error || t.errors.productNotFound}</h2>
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
    const key = attr.attributeName || `attr_${attr.attributeDefinitionId}`;
    acc[key] = attr.attributeValue;
    return acc;
  }, {} as Record<string, string>);

  const handleAttributeChange = (attributeName: string, value: string) => {
    // Find variant matching the new attribute combination
    const newAttributes = { ...currentAttributes, [attributeName]: value };
    
    const matchingVariant = product.variants.find(variant => {
      if (!variant.isActive) return false;
      
      return attributeDefinitions.every(def => {
        const variantAttr = variant.attributes.find(a => 
          (a.attributeName || `attr_${a.attributeDefinitionId}`) === def.name
        );
        return variantAttr && variantAttr.attributeValue === newAttributes[def.name];
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
                {currentVariant.attributes.map((attr) => (
                  <Badge key={attr.id} variant="secondary" className="px-3 py-1">
                    {attr.attributeName || 'Attribute'}: {attr.attributeValue}
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
                    <div key={def.name}>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        {def.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(attributeOptions[def.name] || []).map(value => {
                          const isSelected = currentAttributes[def.name] === value;
                          return (
                            <button
                              key={value}
                              onClick={() => handleAttributeChange(def.name, value)}
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
