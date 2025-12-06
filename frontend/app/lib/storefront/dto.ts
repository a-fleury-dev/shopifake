/**
 * Data Transfer Objects for Storefront API
 */

/**
 * Category DTO
 */
export interface CategoryDTO {
  id: number;
  shopId: number;
  parentId: number | null;
  label: string;
  slug: string;
  position: number;
}

/**
 * Category Tree Node DTO
 */
export interface CategoryTreeNodeDTO {
  id: number;
  label: string;
  slug: string;
  position: number;
  children: CategoryTreeNodeDTO[];
}

/**
 * Category Tree DTO
 */
export interface CategoryTreeDTO {
  children: CategoryTreeNodeDTO[];
}

/**
 * Attribute Definition DTO
 */
export interface AttributeDefinitionDTO {
  id: number;
  attributeName: string;
  position: number;
}

/**
 * Product DTO
 */
export interface ProductDTO {
  id: number;
  categoryId: number;
  shopId: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributeDefinitions: AttributeDefinitionDTO[];
}

/**
 * Product Variant DTO
 */
export interface ProductVariantDTO {
  id: number;
  productId: number;
  shopId: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: Record<string, string>; // Map<attributeName, attributeValue>
}

/**
 * Product with Variants (for storefront display)
 * Combines product info with its variants
 */
export interface ProductWithVariantsDTO {
  product: ProductDTO;
  variants: ProductVariantDTO[];
}
