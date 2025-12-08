// Backend-aligned types for backoffice management

export interface Category {
  id: number;
  shopId: number;
  parentId: number | null;
  label: string;
  slug: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributeDefinitions?: AttributeDefinition[];
  variants?: ProductVariant[];
}

export interface AttributeDefinition {
  id: number;
  productId: number;
  attributeName: string;
  position: number;
  createdAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes?: VariantAttribute[];
}

export interface VariantAttribute {
  id: number;
  variantId: number;
  attributeDefinitionId: number;
  attributeValue: string;
}

// Helper type for creating new entities
export type CreateCategoryDto = Pick<Category, 'label' | 'parentId'>;
export type UpdateCategoryDto = Pick<Category, 'id' | 'label'>;

export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & {
  attributeDefinitions: string[]; // Array of attribute names
};

export type CreateVariantDto = Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'> & {
  attributes: { attributeDefinitionId: number; attributeValue: string }[];
};

export type UpdateStockDto = {
  variantId: number;
  stockChange: number; // Positive to add, negative to remove
};
