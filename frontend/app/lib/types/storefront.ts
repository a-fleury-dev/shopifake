// Storefront Types based on Backend API Architecture

export interface Shop {
  id: number;
  adminId: number;
  domainName: string;
  name: string;
  description?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  shopId: number;
  parentId?: number;
  label: string;
  slug: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  // Frontend only
  children?: Category[];
}

export interface AttributeDefinition {
  id: number;
  productId: number;
  attributeName: string;
  position: number;
  createdAt: string;
}

export interface VariantAttribute {
  id: number;
  variantId: number;
  attributeDefinitionId: number;
  attributeValue: string;
  // Joined data
  attributeName?: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  attributes: VariantAttribute[];
  // Joined product data
  productName?: string;
  productDescription?: string;
  productSlug?: string;
  categoryId?: number;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  attributeDefinitions: AttributeDefinition[];
  variants: ProductVariant[];
}

export interface CartItem {
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
