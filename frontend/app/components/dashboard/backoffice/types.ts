// Types for BackOffice Module

export interface CategoryAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface CategoryHierarchy {
  id: string;
  name: string;
  description: string;
  gender?: 'homme' | 'femme' | 'enfant' | 'neutre';
  productsCount: number;
  attributes?: CategoryAttribute[];
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  parentId: string;
  name: string;
  description: string;
  attributes?: CategoryAttribute[];
  availableFilters: string[];
  subSubCategories?: SubSubCategory[];
}

export interface SubSubCategory {
  id: string;
  parentId: string;
  name: string;
  description: string;
  attributes?: CategoryAttribute[];
  filters: Filter[];
  productsCount: number;
}

export interface Filter {
  id: string;
  name: string;
  values: string[];
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  categoryId: string;
  collection?: string;
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  stockTracking: boolean;
  allowNegativeStock: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  lowStockThreshold: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface StockHistory {
  id: string;
  variantId: string;
  action: 'add' | 'remove' | 'set';
  previousStock: number;
  newStock: number;
  quantity: number;
  reason: string;
  date: string;
  author: string;
}

export interface Role {
  id: string;
  name: 'admin' | 'manager' | 'reader';
  permissions: {
    categories: { create: boolean; read: boolean; update: boolean; delete: boolean };
    products: { create: boolean; read: boolean; update: boolean; delete: boolean };
    variants: { create: boolean; read: boolean; update: boolean; delete: boolean };
    stock: { read: boolean; update: boolean };
    filters: { create: boolean; read: boolean; update: boolean; delete: boolean };
    roles: { manage: boolean };
  };
}

export interface BackOfficeUser {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'reader';
}
