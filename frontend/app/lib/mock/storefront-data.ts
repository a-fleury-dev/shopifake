import type { Shop, Category, Product, ProductVariant } from '../types/storefront';

// Mock Shop Data
export const mockStorefrontShop: Shop = {
  id: 1,
  adminId: 1,
  domainName: 'my-awesome-shop',
  name: 'My Awesome Shop',
  description: 'Welcome to our amazing store! We offer the best products with exceptional quality and service.',
  bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

// Mock Categories with hierarchy
export const mockCategories: Category[] = [
  // Root: Clothing
  { id: 1, shopId: 1, label: 'Clothing', slug: 'clothing', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 2, shopId: 1, parentId: 1, label: 'T-Shirts', slug: 't-shirts', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 7, shopId: 1, parentId: 2, label: 'Casual', slug: 'casual-tshirts', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 8, shopId: 1, parentId: 2, label: 'Premium', slug: 'premium-tshirts', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 3, shopId: 1, parentId: 1, label: 'Jackets', slug: 'jackets', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 9, shopId: 1, parentId: 3, label: 'Winter', slug: 'winter-jackets', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 10, shopId: 1, parentId: 3, label: 'Spring', slug: 'spring-jackets', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 11, shopId: 1, parentId: 1, label: 'Pants', slug: 'pants', position: 3, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 12, shopId: 1, parentId: 11, label: 'Jeans', slug: 'jeans', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 13, shopId: 1, parentId: 11, label: 'Chinos', slug: 'chinos', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  
  // Root: Accessories
  { id: 4, shopId: 1, label: 'Accessories', slug: 'accessories', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 5, shopId: 1, parentId: 4, label: 'Bags', slug: 'bags', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 14, shopId: 1, parentId: 5, label: 'Backpacks', slug: 'backpacks', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 15, shopId: 1, parentId: 5, label: 'Messenger Bags', slug: 'messenger-bags', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 16, shopId: 1, parentId: 4, label: 'Jewelry', slug: 'jewelry', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 17, shopId: 1, parentId: 4, label: 'Watches', slug: 'watches', position: 3, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  
  // Root: Electronics
  { id: 6, shopId: 1, label: 'Electronics', slug: 'electronics', position: 3, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 18, shopId: 1, parentId: 6, label: 'Audio', slug: 'audio', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 19, shopId: 1, parentId: 18, label: 'Headphones', slug: 'headphones', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 20, shopId: 1, parentId: 18, label: 'Speakers', slug: 'speakers', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 21, shopId: 1, parentId: 6, label: 'Cameras', slug: 'cameras', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  
  // Root: Home & Living
  { id: 22, shopId: 1, label: 'Home & Living', slug: 'home-living', position: 4, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 23, shopId: 1, parentId: 22, label: 'Furniture', slug: 'furniture', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 24, shopId: 1, parentId: 23, label: 'Chairs', slug: 'chairs', position: 1, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 25, shopId: 1, parentId: 23, label: 'Tables', slug: 'tables', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 26, shopId: 1, parentId: 22, label: 'Decor', slug: 'decor', position: 2, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
];

// Mock Products with full variants and attributes
export const mockProducts: Product[] = [
  {
    id: 1,
    categoryId: 2,
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: 'High-quality cotton t-shirt perfect for everyday wear. Soft, comfortable, and durable.',
    isActive: true,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    attributeDefinitions: [
      { id: 1, productId: 1, attributeName: 'Color', position: 1, createdAt: '2025-01-02T00:00:00Z' },
      { id: 2, productId: 1, attributeName: 'Size', position: 2, createdAt: '2025-01-02T00:00:00Z' },
    ],
    variants: [
      {
        id: 1,
        productId: 1,
        sku: 'TSH-RED-S',
        price: 29.99,
        stock: 50,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-02T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
        attributes: [
          { id: 1, variantId: 1, attributeDefinitionId: 1, attributeValue: 'Red', attributeName: 'Color' },
          { id: 2, variantId: 1, attributeDefinitionId: 2, attributeValue: 'S', attributeName: 'Size' },
        ],
      },
      {
        id: 2,
        productId: 1,
        sku: 'TSH-RED-M',
        price: 29.99,
        stock: 45,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-02T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
        attributes: [
          { id: 3, variantId: 2, attributeDefinitionId: 1, attributeValue: 'Red', attributeName: 'Color' },
          { id: 4, variantId: 2, attributeDefinitionId: 2, attributeValue: 'M', attributeName: 'Size' },
        ],
      },
      {
        id: 3,
        productId: 1,
        sku: 'TSH-BLUE-S',
        price: 29.99,
        stock: 30,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-02T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
        attributes: [
          { id: 5, variantId: 3, attributeDefinitionId: 1, attributeValue: 'Blue', attributeName: 'Color' },
          { id: 6, variantId: 3, attributeDefinitionId: 2, attributeValue: 'S', attributeName: 'Size' },
        ],
      },
      {
        id: 4,
        productId: 1,
        sku: 'TSH-BLUE-M',
        price: 29.99,
        stock: 35,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-02T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
        attributes: [
          { id: 7, variantId: 4, attributeDefinitionId: 1, attributeValue: 'Blue', attributeName: 'Color' },
          { id: 8, variantId: 4, attributeDefinitionId: 2, attributeValue: 'M', attributeName: 'Size' },
        ],
      },
    ],
  },
  {
    id: 2,
    categoryId: 3,
    name: 'Winter Puffer Jacket',
    slug: 'winter-puffer-jacket',
    description: 'Stay warm and stylish with our premium winter jacket. Water-resistant and insulated for maximum comfort.',
    isActive: true,
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
    attributeDefinitions: [
      { id: 3, productId: 2, attributeName: 'Color', position: 1, createdAt: '2025-01-03T00:00:00Z' },
      { id: 4, productId: 2, attributeName: 'Size', position: 2, createdAt: '2025-01-03T00:00:00Z' },
    ],
    variants: [
      {
        id: 5,
        productId: 2,
        sku: 'JAC-BLK-M',
        price: 149.99,
        stock: 20,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
        attributes: [
          { id: 9, variantId: 5, attributeDefinitionId: 3, attributeValue: 'Black', attributeName: 'Color' },
          { id: 10, variantId: 5, attributeDefinitionId: 4, attributeValue: 'M', attributeName: 'Size' },
        ],
      },
      {
        id: 6,
        productId: 2,
        sku: 'JAC-BLK-L',
        price: 149.99,
        stock: 15,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
        attributes: [
          { id: 11, variantId: 6, attributeDefinitionId: 3, attributeValue: 'Black', attributeName: 'Color' },
          { id: 12, variantId: 6, attributeDefinitionId: 4, attributeValue: 'L', attributeName: 'Size' },
        ],
      },
      {
        id: 7,
        productId: 2,
        sku: 'JAC-NAV-M',
        price: 149.99,
        stock: 18,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1548883354-ecdc2c90d294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
        attributes: [
          { id: 13, variantId: 7, attributeDefinitionId: 3, attributeValue: 'Navy', attributeName: 'Color' },
          { id: 14, variantId: 7, attributeDefinitionId: 4, attributeValue: 'M', attributeName: 'Size' },
        ],
      },
    ],
  },
  {
    id: 3,
    categoryId: 5,
    name: 'Premium Leather Backpack',
    slug: 'premium-leather-backpack',
    description: 'Handcrafted leather backpack with multiple compartments. Perfect for work or travel.',
    isActive: true,
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z',
    attributeDefinitions: [
      { id: 5, productId: 3, attributeName: 'Color', position: 1, createdAt: '2025-01-04T00:00:00Z' },
    ],
    variants: [
      {
        id: 8,
        productId: 3,
        sku: 'BAG-BRN',
        price: 199.99,
        stock: 12,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-04T00:00:00Z',
        updatedAt: '2025-01-04T00:00:00Z',
        attributes: [
          { id: 15, variantId: 8, attributeDefinitionId: 5, attributeValue: 'Brown', attributeName: 'Color' },
        ],
      },
      {
        id: 9,
        productId: 3,
        sku: 'BAG-BLK',
        price: 199.99,
        stock: 10,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-04T00:00:00Z',
        updatedAt: '2025-01-04T00:00:00Z',
        attributes: [
          { id: 16, variantId: 9, attributeDefinitionId: 5, attributeValue: 'Black', attributeName: 'Color' },
        ],
      },
    ],
  },
  {
    id: 4,
    categoryId: 6,
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-headphones',
    description: 'Premium wireless headphones with active noise cancellation. 30-hour battery life and superior sound quality.',
    isActive: true,
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
    attributeDefinitions: [
      { id: 6, productId: 4, attributeName: 'Color', position: 1, createdAt: '2025-01-05T00:00:00Z' },
    ],
    variants: [
      {
        id: 10,
        productId: 4,
        sku: 'HEAD-BLK',
        price: 299.99,
        stock: 25,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z',
        attributes: [
          { id: 17, variantId: 10, attributeDefinitionId: 6, attributeValue: 'Black', attributeName: 'Color' },
        ],
      },
      {
        id: 11,
        productId: 4,
        sku: 'HEAD-WHT',
        price: 299.99,
        stock: 20,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z',
        attributes: [
          { id: 18, variantId: 11, attributeDefinitionId: 6, attributeValue: 'White', attributeName: 'Color' },
        ],
      },
      {
        id: 12,
        productId: 4,
        sku: 'HEAD-SLVR',
        price: 299.99,
        stock: 15,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z',
        attributes: [
          { id: 19, variantId: 12, attributeDefinitionId: 6, attributeValue: 'Silver', attributeName: 'Color' },
        ],
      },
    ],
  },
  {
    id: 5,
    categoryId: 2,
    name: 'Premium Polo Shirt',
    slug: 'premium-polo-shirt',
    description: 'Elegant polo shirt made from premium cotton. Perfect for casual and semi-formal occasions.',
    isActive: true,
    createdAt: '2025-01-06T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
    attributeDefinitions: [
      { id: 7, productId: 5, attributeName: 'Color', position: 1, createdAt: '2025-01-06T00:00:00Z' },
      { id: 8, productId: 5, attributeName: 'Size', position: 2, createdAt: '2025-01-06T00:00:00Z' },
    ],
    variants: [
      {
        id: 13,
        productId: 5,
        sku: 'POLO-WHT-M',
        price: 49.99,
        stock: 40,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-06T00:00:00Z',
        updatedAt: '2025-01-06T00:00:00Z',
        attributes: [
          { id: 20, variantId: 13, attributeDefinitionId: 7, attributeValue: 'White', attributeName: 'Color' },
          { id: 21, variantId: 13, attributeDefinitionId: 8, attributeValue: 'M', attributeName: 'Size' },
        ],
      },
      {
        id: 14,
        productId: 5,
        sku: 'POLO-WHT-L',
        price: 49.99,
        stock: 35,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-06T00:00:00Z',
        updatedAt: '2025-01-06T00:00:00Z',
        attributes: [
          { id: 22, variantId: 14, attributeDefinitionId: 7, attributeValue: 'White', attributeName: 'Color' },
          { id: 23, variantId: 14, attributeDefinitionId: 8, attributeValue: 'L', attributeName: 'Size' },
        ],
      },
      {
        id: 15,
        productId: 5,
        sku: 'POLO-NAVY-M',
        price: 49.99,
        stock: 30,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        createdAt: '2025-01-06T00:00:00Z',
        updatedAt: '2025-01-06T00:00:00Z',
        attributes: [
          { id: 24, variantId: 15, attributeDefinitionId: 7, attributeValue: 'Navy', attributeName: 'Color' },
          { id: 25, variantId: 15, attributeDefinitionId: 8, attributeValue: 'M', attributeName: 'Size' },
        ],
      },
    ],
  },
];

// Helper functions
export function getAllVariantsWithProductInfo(): ProductVariant[] {
  const variants: ProductVariant[] = [];
  
  mockProducts.forEach(product => {
    product.variants.forEach(variant => {
      variants.push({
        ...variant,
        productName: product.name,
        productDescription: product.description,
        productSlug: product.slug,
        categoryId: product.categoryId,
      });
    });
  });
  
  return variants;
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(product => product.slug === slug);
}

export function getProductByVariantId(variantId: number): Product | undefined {
  return mockProducts.find(product => 
    product.variants.some(v => v.id === variantId)
  );
}

export function getVariantById(variantId: number): ProductVariant | undefined {
  for (const product of mockProducts) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      return {
        ...variant,
        productName: product.name,
        productDescription: product.description,
        productSlug: product.slug,
        categoryId: product.categoryId,
      };
    }
  }
  return undefined;
}
